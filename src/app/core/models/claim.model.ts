import { ClaimStatus } from './enums';

export interface Claim {
  userId: number;
  username: string;
  listingId: number;
  createdAt: string;
  status: ClaimStatus;
  resolvedAt: string | null;
}
