export interface Poruka {
  porukaId: number;
  korisnikId: number;
  korisnickoIme: string;
  razgovorId: number;
  datumKreiranja: string;
  sadrzaj: string;
}

export interface PorukaCreate {
  sadrzaj: string;
}
