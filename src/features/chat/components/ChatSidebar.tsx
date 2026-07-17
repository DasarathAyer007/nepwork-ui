import { useMemo, useState } from 'react';

import { Search, SquarePen } from 'lucide-react';

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
  className?: string;
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
  className = 'flex',
}: ChatSidebarProps) {
  const { data: chats = [], isLoading } = useGetChatsQuery();
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');

  const unreadCount = useMemo(
    () => chats.filter((chat) => chat.unread_count > 0).length,
    [chats]
  );

  const getOtherMember = (chat: Chat) =>
    chat.members.find((member) => member.id !== currentUserId) ??
    chat.members[0];

  const visibleChats = useMemo(() => {
    const byFilter =
      filter === 'unread'
        ? chats.filter((chat) => chat.unread_count > 0)
        : chats;

    const query = search.trim().toLowerCase();
    if (!query) return byFilter;

    return byFilter.filter((chat) => {
      const other = getOtherMember(chat);
      const name = (other?.full_name || other?.username || '').toLowerCase();
      return name.includes(query);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, filter, search, currentUserId]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <aside
      className={`${className} w-full shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest md:w-80 lg:w-96`}>
      {/* Header */}
      <div className="shrink-0 border-b border-outline-variant p-md">
        <div className="mb-md flex items-center justify-between">
          <h2 className="text-headline-sm font-bold text-on-surface">Chats</h2>
          <button
            type="button"
            aria-label="New message"
            className="rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container-low hover:text-primary">
            <SquarePen size={20} />
          </button>
        </div>

        <div className="relative mb-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-9 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant focus-ring"
          />
        </div>

        <div className="flex gap-xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap rounded-full px-sm py-1.5 text-label-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}>
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`whitespace-nowrap rounded-full px-sm py-1.5 text-label-sm font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}>
            Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-md text-body-sm text-on-surface-variant">
            Loading chats…
          </div>
        )}

        {filter === 'all' && draftUser && showDraftEntry && (
          <div
            onClick={onSelectDraft}
            className={`flex cursor-pointer items-center gap-sm px-md py-sm transition-colors ${
              isDraftActive
                ? 'bg-primary-container/40'
                : 'hover:bg-surface-container-low'
            }`}>
            <img
              alt={draftUser.username}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
              src={draftUser.profile_picture || '/default-avatar.png'}
            />
            <div className="min-w-0 flex-1 border-b border-outline-variant/60 py-sm">
              <h3 className="truncate text-body-md font-semibold text-on-surface">
                {draftUser.full_name || draftUser.username}
              </h3>
              <p className="truncate text-body-sm italic text-on-surface-variant">
                Start a conversation
              </p>
            </div>
          </div>
        )}

        {!isLoading && visibleChats.length === 0 && (
          <div className="p-lg text-center text-body-sm text-on-surface-variant">
            {search
              ? 'No conversations match your search'
              : filter === 'unread'
                ? 'No unread chats'
                : 'No conversations yet'}
          </div>
        )}

        {visibleChats.map((chat) => {
          const otherMember = getOtherMember(chat);
          const isSelected = selectedChatId === chat.id;
          const isUnread = chat.unread_count > 0;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex cursor-pointer items-center gap-sm px-md py-sm transition-colors ${
                isSelected ? 'bg-primary-container/40' : 'hover:bg-surface-container-low'
              }`}>
              <div className="relative shrink-0">
                <img
                  alt={otherMember?.username}
                  className="h-12 w-12 rounded-full object-cover"
                  src={otherMember?.profile_picture || '/default-avatar.png'}
                />
                {otherMember?.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container-lowest bg-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1 border-b border-outline-variant/60 py-sm">
                <div className="flex items-baseline justify-between gap-xs">
                  <h3
                    className={`truncate text-body-md ${isUnread ? 'font-bold text-on-surface' : 'font-semibold text-on-surface'}`}>
                    {otherMember?.full_name || otherMember?.username}
                  </h3>
                  <span
                    className={`shrink-0 text-label-sm ${isUnread ? 'font-semibold text-primary' : 'font-medium text-outline'}`}>
                    {formatTime(chat.last_message?.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-xs">
                  <p
                    className={`truncate text-body-sm ${isUnread ? 'font-medium text-on-surface' : 'text-on-surface-variant'}`}>
                    {chat.last_message?.content ?? 'No messages yet'}
                  </p>
                  {isUnread && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-on-primary">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
