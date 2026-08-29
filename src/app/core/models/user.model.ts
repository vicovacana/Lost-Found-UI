export interface User {
  userId: number;
  username: string;
  email: string;
  createdAt: string;
  role: string;
}

export interface UserUpdate {
  username: string;
  email: string;
}
