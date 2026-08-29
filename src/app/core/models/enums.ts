export enum ListingType {
  Lost = 0,
  Found = 1,
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.Lost]: 'Izgubljeno',
  [ListingType.Found]: 'Nađeno',
};

export enum Category {
  Electronics = 0,
  WalletsAndDocuments = 1,
  Keys = 2,
  BagsAndBackpacks = 3,
  Jewelry = 4,
  Clothing = 5,
  Pets = 6,
  Other = 7,
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.Electronics]: 'Elektronika',
  [Category.WalletsAndDocuments]: 'Novčanici i dokumenta',
  [Category.Keys]: 'Ključevi',
  [Category.BagsAndBackpacks]: 'Torbe i ranci',
  [Category.Jewelry]: 'Nakit',
  [Category.Clothing]: 'Odeća',
  [Category.Pets]: 'Kućni ljubimci',
  [Category.Other]: 'Ostalo',
};

export const CATEGORIES: Category[] = Object.values(Category).filter(
  (v): v is Category => typeof v === 'number',
);

export enum ClaimStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
}

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.Pending]: 'Na čekanju',
  [ClaimStatus.Accepted]: 'Prihvaćeno',
  [ClaimStatus.Rejected]: 'Odbijeno',
};

export enum ConversationStatus {
  Open = 0,
  Closed = 1,
}

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, string> = {
  [ConversationStatus.Open]: 'Otvoren',
  [ConversationStatus.Closed]: 'Zatvoren',
};
