import { useMemo, useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import { useGetChatsQuery } from '@/features/chat/chatApi';
import ChatSidebar from '@/features/chat/components/ChatSidebar';
import ChatWindow from '@/features/chat/components/ChatWindow';
import type { Chat, User } from '@/features/chat/types';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

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

  return (
    <main className="flex h-dvh w-full max-w-8xl mx-auto bg-surface-container-lowest">
      <ChatSidebar
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
          target={chatWindowTarget}
          chat={activeChat}
          currentUserId={currentUserId}
          onChatCreated={handleChatCreated}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center bg-surface-bright">
          <p className="text-body-lg text-on-surface-variant">
            Select a conversation to start messaging
          </p>
        </div>
      )}
    </main>
  );
}
