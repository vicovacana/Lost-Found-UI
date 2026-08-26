import { StatusPotrazivanja } from './enums';

export interface Potrazivanje {
  korisnikId: number;
  korisnickoIme: string;
  oglasId: number;
  datumKreiranja: string;
  status: StatusPotrazivanja;
  datumRazresavanja: string | null;
}
