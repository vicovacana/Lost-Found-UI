import { Category, ListingType } from './enums';

export interface Listing {
  listingId: number;
  title: string;
  description: string;
  createdAt: string;
  type: ListingType;
  category: Category;
  city: string;
  latitude: number | null;
  longitude: number | null;
  photo: string | null;
  locationDescription: string | null;
  creatorId: number;
  creatorUsername: string;
  adminId: number | null;
  adminUsername: string | null;
}

export interface ListingCreate {
  title: string;
  description: string;
  type: ListingType;
  category: Category;
  city: string;
  latitude: number | null;
  longitude: number | null;
  photo: string | null;
  locationDescription: string | null;
}

export type ListingUpdate = ListingCreate;

export interface ListingFilters {
  type?: ListingType;
  creatorId?: number;
  adminId?: number;
  category?: Category;
  city?: string;
  activeOnly?: boolean;
}
