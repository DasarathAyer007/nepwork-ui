import { selectUser } from '@/features/auth/authSelectors';
import { useGetChatsQuery } from '@/features/chat/chatApi';
import type { User as ChatUser } from '@/features/chat/types';
import { formatRelativeTime } from '@/features/dashboard/utils/overviewHelpers';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

import PreviewCard from './PreviewCard';

export default function MessagesPreviewCard() {
  const currentUser = useAppSelector(selectUser);
  const { data: chats } = useGetChatsQuery();

  const preview = [...(chats ?? [])]
    .filter((chat) => chat.last_message)
    .sort(
      (a, b) =>
        new Date(b.last_message!.created_at).getTime() -
        new Date(a.last_message!.created_at).getTime()
    )
    .slice(0, 3);

  const getOtherMember = (members: ChatUser[]) =>
    members.find((m) => m.id !== currentUser?.id) ?? members[0];

  return (
    <PreviewCard
      title="Messages"
      viewAllTo="/messages"
      isEmpty={preview.length === 0}
      emptyMessage="No messages yet.">
      <ul className="divide-y divide-outline-variant/40">
        {preview.map((chat) => {
          const otherMember = getOtherMember(chat.members);
          return (
            <li key={chat.id}>
              <Link
                to="/messages"
                className="flex items-center gap-3 py-2.5 group">
                <div className="size-9 rounded-full overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                  {otherMember?.profile_picture ? (
                    <img
                      src={otherMember.profile_picture}
                      alt={otherMember.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                    {otherMember?.full_name || otherMember?.username}
                  </p>
                  <p className="text-label-md text-on-surface-variant truncate">
                    {chat.last_message?.content}
                  </p>
                </div>
                {chat.last_message && (
                  <span className="text-label-md text-on-surface-variant/70 shrink-0">
                    {formatRelativeTime(chat.last_message.created_at)}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </PreviewCard>
  );
}
