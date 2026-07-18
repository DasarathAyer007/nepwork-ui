// ──────────────────────────────────────────────────────────
// Chat domain types — must mirror the Django REST serializers
// ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  profile_picture: string | null;
  full_name?: string;
}

export interface Message {
  id: string; // UUID (or a temp client-generated id for an optimistic/pending send)
  chat_id: string; // UUID
  sender: User;
  content: string;
  is_read: boolean;
  created_at: string; // ISO timestamp
  // Set locally on an optimistic send, echoed back by the server on the
  // real chat.message event so chatSlice can reconcile the two into one.
  client_ref?: string;
  // True only for the local optimistic copy, before the server's echo
  // arrives — lets the UI show a "sending…" state instead of a read-receipt
  // checkmark.
  pending?: boolean;
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
