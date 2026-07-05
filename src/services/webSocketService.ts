/**
 * WebSocketService — singleton, lives OUTSIDE React.
 *
 * - Opens exactly ONE connection for the whole app (chat + notifications).
 * - Initialized after login, torn down on logout.
 * - Dispatches typed Redux actions on every inbound message.
 * - Exposes send(type, payload) matching the Django msg contract exactly.
 */
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
import { typingReceived } from '../features/chat/chatSlice';
import {
  handleChatReadConfirmed,
  handleIncomingChatMessage,
} from '../features/chat/chatThunks';

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

  sendChatMessage(chatId: string, content: string): void {
    this.send('chat.send', { chat_id: chatId, content });
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    this.send('chat.typing', { chat_id: chatId, is_typing: isTyping });
  }

  markChatRead(chatId: string): void {
    this.send('chat.read', { chat_id: chatId });
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
        break;

      case 'chat.message':
        dispatch(handleIncomingChatMessage(data.payload));
        break;

      case 'chat.typing':
        dispatch(typingReceived(data.payload));
        break;

      case 'chat.read_confirmed':
        dispatch(handleChatReadConfirmed(data.payload));
        break;

      case 'notification.new':
        dispatch(notificationReceived(data.payload));
        break;

      case 'notification.read_confirmed':
        dispatch(notificationReadConfirmed(data.payload));
        break;

      case 'notification.read_all_confirmed':
        dispatch(notificationReadAllConfirmed(data.payload));
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
