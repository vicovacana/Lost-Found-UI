import { Kategorija, TipOglasa } from './enums';

export interface Oglas {
  oglasId: number;
  naziv: string;
  opis: string;
  datumKreiranja: string;
  tip: TipOglasa;
  kategorija: Kategorija;
  grad: string;
  latitude: number | null;
  longitude: number | null;
  fotografija: string | null;
  opisLokacije: string | null;
  kreatorId: number;
  kreatorKorisnickoIme: string;
  adminId: number | null;
}

export interface OglasCreate {
  naziv: string;
  opis: string;
  tip: TipOglasa;
  kategorija: Kategorija;
  grad: string;
  latitude: number | null;
  longitude: number | null;
  fotografija: string | null;
  opisLokacije: string | null;
}

export type OglasUpdate = OglasCreate;

export interface OglasFilters {
  tip?: TipOglasa;
  kreatorId?: number;
  adminId?: number;
  kategorija?: Kategorija;
  grad?: string;
  samoAktivni?: boolean;
}
