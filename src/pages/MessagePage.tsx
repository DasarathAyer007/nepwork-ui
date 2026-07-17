import { useMemo, useState } from 'react';

import { MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { selectUser } from '@/features/auth/authSelectors';
import { useGetChatsQuery } from '@/features/chat/chatApi';
import ChatSidebar from '@/features/chat/components/ChatSidebar';
import ChatWindow from '@/features/chat/components/ChatWindow';
import type { Chat, User } from '@/features/chat/types';

type SelectedChat =
  | {
      mode: 'existing';
      chatId: string;
    }
  | {
      mode: 'draft';
      user: User;
    }
  | null;

export default function MessagePage() {
  const user = useSelector(selectUser);
  const currentUserId = String(user?.id ?? '');

  const [searchParams] = useSearchParams();

  /**
   * Build draft user from URL parameters.
   *
   * Example:
   * /messages?userId=5&username=john
   */
  const draftUser = useMemo<User | null>(() => {
    const id = searchParams.get('userId');
    const username = searchParams.get('username');

    if (!id || !username) return null;

    return {
      id,
      username,
      full_name: searchParams.get('fullName') ?? undefined,
      profile_picture: searchParams.get('profile_picture') ?? null,
      online: false,
    };
  }, [searchParams]);

  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);

  const { data: chats = [] } = useGetChatsQuery();

  const existingChat = useMemo<Chat | null>(() => {
    if (!draftUser?.id) return null;

    return (
      chats.find((chat) =>
        chat.members.some((member) => member.id === draftUser.id)
      ) ?? null
    );
  }, [chats, draftUser]);

  const activeSelection = useMemo<SelectedChat>(() => {
    if (!draftUser) {
      return selectedChat;
    }

    if (selectedChat?.mode === 'existing') {
      return selectedChat;
    }

    if (existingChat) {
      return {
        mode: 'existing',
        chatId: existingChat.id,
      };
    }

    if (
      selectedChat?.mode === 'draft' &&
      selectedChat.user.id === draftUser.id
    ) {
      return selectedChat;
    }

    return {
      mode: 'draft',
      user: draftUser,
    };
  }, [draftUser, existingChat, selectedChat]);

  const activeChat =
    activeSelection?.mode === 'existing'
      ? (chats.find((c) => c.id === activeSelection.chatId) ?? null)
      : null;

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat({
      mode: 'existing',
      chatId: chat.id,
    });
  };

  const handleSelectDraft = (user: User) => {
    setSelectedChat({
      mode: 'draft',
      user,
    });
  };

  const handleChatCreated = (chatId: string) => {
    setSelectedChat({
      mode: 'existing',
      chatId,
    });
  };

  const chatWindowTarget = useMemo(() => {
    if (!activeSelection) return null;

    if (activeSelection.mode === 'existing') {
      return {
        mode: 'existing' as const,
        chatId: activeSelection.chatId,
      };
    }

    return {
      mode: 'draft' as const,
      otherUser: activeSelection.user,
    };
  }, [activeSelection]);

  const showDraftEntry = Boolean(
    draftUser &&
    (!existingChat || selectedChat?.mode === 'draft') &&
    selectedChat?.mode !== 'existing'
  );

  // On small screens only one pane is visible at a time, WhatsApp-style:
  // the chat list until a conversation is opened, then the conversation
  // (with a back button to return to the list).
  const isConversationOpen = Boolean(chatWindowTarget);

  return (
    <div className="mx-auto flex h-full w-full max-w-8xl overflow-hidden bg-surface-container-lowest md:p-md">
      <div className="flex h-full w-full overflow-hidden border border-outline-variant/60 bg-surface-container-lowest md:rounded-xl md:shadow-md">
        <ChatSidebar
          className={isConversationOpen ? 'hidden md:flex' : 'flex'}
          selectedChatId={
            activeSelection?.mode === 'existing' ? activeSelection.chatId : null
          }
          currentUserId={currentUserId}
          draftUser={draftUser}
          isDraftActive={
            activeSelection?.mode === 'draft' &&
            activeSelection.user.id === draftUser?.id
          }
          showDraftEntry={showDraftEntry}
          onSelectChat={handleSelectChat}
          onSelectDraft={() => {
            if (draftUser) {
              handleSelectDraft(draftUser);
            }
          }}
        />

        {chatWindowTarget ? (
          <ChatWindow
            className="flex"
            target={chatWindowTarget}
            chat={activeChat}
            currentUserId={currentUserId}
            onChatCreated={handleChatCreated}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-md bg-surface-container-low/40 text-center md:flex">
            <div className="flex size-20 items-center justify-center rounded-full bg-surface-container-high">
              <MessageSquare className="size-9 text-outline" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-title-md font-semibold text-on-surface">
                Your messages
              </p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
