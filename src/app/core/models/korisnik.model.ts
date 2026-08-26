export interface Korisnik {
  korisnikId: number;
  korisnickoIme: string;
  email: string;
  vremeKreiranja: string;
  uloga: string;
}

export interface KorisnikUpdate {
  korisnickoIme: string;
  email: string;
}
