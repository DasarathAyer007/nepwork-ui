// ──────────────────────────────────────────────────────────
// Chat domain types — must mirror the Django REST serializers
// ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  profile_picture: string | null;
  full_name?: string;
  online?: boolean;
}

export interface Message {
  id: string; // UUID
  chat_id: string; // UUID
  sender: User;
  content: string;
  is_read: boolean;
  created_at: string; // ISO timestamp
}

export interface Chat {
  id: string; // UUID
  name: string;
  members: User[];
  last_message: Message | null;
  unread_count: number;
  created_at: string;
}

export interface ChatTargetExisting {
  mode: 'existing';
  chatId: string;
  chat?: Chat;
}

export interface ChatTargetDraft {
  mode: 'draft';
  otherUser: User;
}

export type ChatTarget = ChatTargetExisting | ChatTargetDraft;
