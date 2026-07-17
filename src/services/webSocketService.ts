/**
 * WebSocketService — singleton, lives OUTSIDE React.
 *
 * - Opens exactly ONE connection for the whole app (chat + notifications).
 * - Initialized after login, torn down on logout.
 * - Dumb transport layer only: dispatches exactly one plain Redux action per
 *   inbound event, nothing more. Any cross-slice fan-out (patching the
 *   chatApi/notificationsApi RTK Query caches alongside chatSlice/
 *   notificationsSlice) belongs in listener middleware
 *   (app/listeners/chatListeners.ts, notificationListeners.ts), not here.
 * - Exposes send(type, payload) matching the Django msg contract exactly.
 */
import { notificationsApi } from '@/features/notifications/notificationsApi';
import {
  notificationReadAllConfirmed,
  notificationReadConfirmed,
  notificationReceived,
  setInitialUnreadCount,
} from '@/features/notifications/notificationsSlice';
import {
  socketClosed,
  socketConnecting,
  socketError,
  socketOpened,
} from '@/features/socket/socketSlice';
import type {
  ClientFrame,
  ClientMessageType,
  ServerEvent,
} from '@/types/websocket.types';
import type { Store } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from '../app/store';
import {
  chatCreated,
  chatReadConfirmed,
  messageReceived,
  setChatUnreadCount,
  typingReceived,
  userPresenceChanged,
} from '../features/chat/chatSlice';

const RECONNECT_BASE_DELAY = 1000; // ms
const RECONNECT_MAX_DELAY = 30000; // ms

type AppStore = Store<RootState> & { dispatch: AppDispatch };

interface InitOptions {
  wsBaseUrl: string;
  getToken: () => string | null | undefined;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private store: AppStore | null = null;
  private wsBaseUrl = '';
  private getToken: InitOptions['getToken'] = () => null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private messageQueue: string[] = [];
  private markReadTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Call once, after the Redux store is created (e.g. in AppRoot on mount).
   * `getToken` is a function returning the current auth token, so it always
   * reads the latest value on (re)connect.
   */
  init(store: AppStore, { wsBaseUrl, getToken }: InitOptions): void {
    this.store = store;
    this.wsBaseUrl = wsBaseUrl;
    this.getToken = getToken;
  }

  connect(): void {
    if (!this.store) {
      console.error('WebSocketService: call init() before connect()');
      return;
    }

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return; // already connected/connecting — no-op
    }

    this.shouldReconnect = true;
    const token = this.getToken();
    const url = token ? `${this.wsBaseUrl}/?token=${token}` : this.wsBaseUrl;

    this.store.dispatch(socketConnecting());
    this.socket = new WebSocket(url);

    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
    this.socket.onerror = this.handleError;
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.markReadTimers.forEach((timer) => clearTimeout(timer));
    this.markReadTimers.clear();

    if (this.socket) {
      this.socket.close(1000, 'client disconnect');
      this.socket = null;
    }
    this.store?.dispatch(socketClosed());
  }

  /**
   * Low-level send matching the Django router's expected frame shape.
   * Prefer the typed convenience methods below in application code.
   */
  send<T extends ClientMessageType>(
    type: T,
    payload: Omit<Extract<ClientFrame, { type: T }>, 'type'> = {} as Omit<
      Extract<ClientFrame, { type: T }>,
      'type'
    >
  ): void {
    const frame = JSON.stringify({ type, ...payload });

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(frame);
    } else {
      // Queue and flush once reconnected
      this.messageQueue.push(frame);
    }
  }

  // ------------------------------------------------------------------ //
  //  Convenience wrappers matching each backend msg type                 //
  // ------------------------------------------------------------------ //

  startChat(memberIds: string[], content: string, clientRef?: string): void {
    this.send('chat.start', {
      member_ids: memberIds,
      content,
      client_ref: clientRef,
    });
  }

  sendChatMessage(chatId: string, content: string, clientRef?: string): void {
    this.send('chat.send', { chat_id: chatId, content, client_ref: clientRef });
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    this.send('chat.typing', { chat_id: chatId, is_typing: isTyping });
  }

  /**
   * Debounced per-chat: a burst of incoming messages while the chat is open
   * (each one re-triggering a read receipt via chatListeners.ts) collapses
   * into a single chat.read send instead of one per message.
   */
  markChatRead(chatId: string): void {
    const pending = this.markReadTimers.get(chatId);
    if (pending) clearTimeout(pending);

    this.markReadTimers.set(
      chatId,
      setTimeout(() => {
        this.markReadTimers.delete(chatId);
        this.send('chat.read', { chat_id: chatId });
      }, 250)
    );
  }

  markNotificationRead(notificationId: number): void {
    this.send('notification.read', { notification_id: notificationId });
  }

  markAllNotificationsRead(): void {
    this.send('notification.read_all', {});
  }

  // ------------------------------------------------------------------ //
  //  Internal handlers                                                   //
  // ------------------------------------------------------------------ //

  private handleOpen = (): void => {
    this.reconnectAttempts = 0;
    this.store?.dispatch(socketOpened());

    while (this.messageQueue.length > 0) {
      const frame = this.messageQueue.shift();
      if (frame) this.socket?.send(frame);
    }
  };

  private handleMessage = (event: MessageEvent<string>): void => {
    let data: ServerEvent;
    try {
      data = JSON.parse(event.data) as ServerEvent;
    } catch {
      console.error('WebSocketService: failed to parse message', event.data);
      return;
    }

    if (!this.store) return;
    const dispatch = this.store.dispatch;

    switch (data.type) {
      case 'connection.established':
        dispatch(setInitialUnreadCount(data.payload.unread_notifications));
        dispatch(setChatUnreadCount(data.payload.unread_chat_messages));
        break;

      case 'chat.created':
        dispatch(chatCreated(data.payload));
        break;

      case 'chat.started':
        // Sender's own ack for chat.start — the new chat + its first
        // message land the same way a chat.created + chat.message pair
        // would for the other member, so the sender's UI (and cache)
        // converges via the same two actions/listeners. client_ref is
        // merged into the message so it reconciles with any optimistic
        // bubble the same way a plain chat.send echo does.
        dispatch(chatCreated(data.payload.chat));
        dispatch(
          messageReceived({
            ...data.payload.message,
            client_ref: data.payload.client_ref,
          })
        );
        break;

      case 'chat.message':
        dispatch(messageReceived(data.payload));
        break;

      case 'chat.typing':
        dispatch(typingReceived(data.payload));
        break;

      case 'chat.read_confirmed':
        dispatch(chatReadConfirmed(data.payload));
        break;

      case 'user.presence':
        dispatch(userPresenceChanged(data.payload));
        break;

      case 'notification.new':
        dispatch(notificationReceived(data.payload));
        break;

      case 'notification.read_confirmed':
        dispatch(notificationReadConfirmed(data.payload));
        // liveNotifications (socket-delivered) is patched by the reducer
        // above, but the dropdown's "latest" fetch and the /notifications
        // page render from the RTK Query cache — invalidate so they pick
        // up the read state too.
        dispatch(
          notificationsApi.util.invalidateTags([
            { type: 'Notification', id: data.payload.notification_id },
            { type: 'Notification', id: 'LIST' },
            { type: 'Notification', id: 'LATEST' },
          ])
        );
        break;

      case 'notification.read_all_confirmed':
        dispatch(notificationReadAllConfirmed(data.payload));
        dispatch(
          notificationsApi.util.invalidateTags([
            { type: 'Notification', id: 'LIST' },
            { type: 'Notification', id: 'LATEST' },
          ])
        );
        break;

      case 'error':
        console.error('WebSocketService: server error', data.payload);
        dispatch(socketError(data.payload));
        break;

      default: {
        // Exhaustiveness check — TS will flag this if ServerEvent grows
        // a new variant that isn't handled above.
        const _exhaustive: never = data;
        console.warn('WebSocketService: unhandled message type', _exhaustive);
      }
    }
  };

  private handleClose = (): void => {
    this.store?.dispatch(socketClosed());

    if (this.shouldReconnect) {
      this.scheduleReconnect();
    }
  };

  private handleError = (): void => {
    this.store?.dispatch(
      socketError({ message: 'WebSocket connection error' })
    );
    // onclose fires automatically after onerror — reconnect handled there
  };

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    const delay = Math.min(
      RECONNECT_BASE_DELAY * 2 ** this.reconnectAttempts,
      RECONNECT_MAX_DELAY
    );
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) this.connect();
    }, delay);
  }
}

// Single shared instance for the whole app
const webSocketService = new WebSocketService();
export default webSocketService;
