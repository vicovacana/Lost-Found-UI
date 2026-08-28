import { StatusRazgovora } from './enums';

export interface Razgovor {
  razgovorId: number;
  datumKreiranja: string;
  statusRazgovora: StatusRazgovora;
  oglasId: number;
  oglasNaziv: string;
  opisLokacije: string | null;
}
