import { useMemo, useState } from 'react';

import { SquarePen } from 'lucide-react';

import { useGetChatsQuery } from '../chatApi';
import type { Chat, User } from '../types';

interface ChatSidebarProps {
  selectedChatId: string | null;
  currentUserId: string;
  draftUser?: User | null;
  isDraftActive?: boolean;
  showDraftEntry?: boolean;
  onSelectChat: (chat: Chat) => void;
  onSelectDraft?: () => void;
}

type FilterMode = 'all' | 'unread';

export default function ChatSidebar({
  selectedChatId,
  currentUserId,
  draftUser,
  isDraftActive,
  showDraftEntry = true,
  onSelectChat,
  onSelectDraft,
}: ChatSidebarProps) {
  const { data: chats = [], isLoading } = useGetChatsQuery();
  const [filter, setFilter] = useState<FilterMode>('all');

  const unreadCount = useMemo(
    () => chats.filter((chat) => chat.unread_count > 0).length,
    [chats]
  );

  const visibleChats = useMemo(
    () =>
      filter === 'unread'
        ? chats.filter((chat) => chat.unread_count > 0)
        : chats,
    [chats, filter]
  );

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherMember = (chat: Chat) =>
    chat.members.find((member) => member.id !== currentUserId) ??
    chat.members[0];

  return (
    <aside className="w-full md:w-80 lg:w-96 border-r border-outline-variant bg-surface-container-lowest flex flex-col">
      {/* Header */}
      <div className="p-md border-b border-outline-variant">
        <div className="flex justify-between items-center mb-sm">
          <h2 className="text-headline-sm">Chats</h2>
          <button
            type="button"
            aria-label="New message"
            className="text-primary p-xs hover:bg-surface-container-low rounded-lg transition-all">
            <SquarePen size={20} />
          </button>
        </div>
        <div className="flex gap-xs overflow-x-auto pb-xs custom-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-sm py-1.5 rounded-lg text-label-sm font-semibold whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant border border-outline-variant'
            }`}>
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-sm py-1.5 rounded-lg text-label-sm font-semibold whitespace-nowrap transition-all ${
              filter === 'unread'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant border border-outline-variant'
            }`}>
            Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="p-md text-body-sm text-on-surface-variant">
            Loading chats…
          </div>
        )}

        {filter === 'all' && draftUser && showDraftEntry && (
          <div
            onClick={onSelectDraft}
            className={`p-md flex gap-sm cursor-pointer transition-all border-l-4 ${
              isDraftActive
                ? 'bg-surface-container-low border-primary'
                : 'border-transparent hover:bg-surface-container-low'
            }`}>
            <div className="relative shrink-0">
              <img
                alt={draftUser.username}
                className="w-12 h-12 rounded-full object-cover"
                src={draftUser.profile_picture || '/default-avatar.png'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-body-md truncate">
                  {draftUser.full_name || draftUser.username}
                </h3>
              </div>
              <p className="text-body-sm text-on-surface-variant truncate italic">
                Start a conversation
              </p>
            </div>
          </div>
        )}

        {!isLoading && visibleChats.length === 0 && (
          <div className="p-md text-body-sm text-on-surface-variant text-center">
            {filter === 'unread' ? 'No unread chats' : 'No conversations yet'}
          </div>
        )}

        {visibleChats.map((chat) => {
          const otherMember = getOtherMember(chat);
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`p-md flex gap-sm cursor-pointer transition-all border-l-4 ${
                selectedChatId === chat.id
                  ? 'bg-surface-container-low border-primary'
                  : 'border-transparent hover:bg-surface-container-low'
              }`}>
              <div className="relative shrink-0">
                <img
                  alt={otherMember?.username}
                  className="w-12 h-12 rounded-full object-cover"
                  src={otherMember?.profile_picture || '/default-avatar.png'}
                />
                {otherMember?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-surface-container-low rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-body-md truncate">
                    {otherMember?.full_name || otherMember?.username}
                  </h3>
                  <span className="text-label-sm text-outline font-medium">
                    {formatTime(chat.last_message?.created_at)}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant truncate">
                  {chat.last_message?.content}
                </p>
              </div>
              {chat.unread_count > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full self-start">
                  {chat.unread_count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
