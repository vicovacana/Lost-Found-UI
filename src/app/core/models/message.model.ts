export interface Message {
  messageId: number;
  userId: number;
  username: string;
  conversationId: number;
  createdAt: string;
  content: string;
}

export interface MessageCreate {
  content: string;
}
