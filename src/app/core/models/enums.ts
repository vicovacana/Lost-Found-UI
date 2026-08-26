export enum TipOglasa {
  Izgubljeno = 0,
  Nadjeno = 1,
}

export const TIP_OGLASA_LABELS: Record<TipOglasa, string> = {
  [TipOglasa.Izgubljeno]: 'Izgubljeno',
  [TipOglasa.Nadjeno]: 'Nađeno',
};

export enum Kategorija {
  Elektronika = 0,
  NovcaniciIDokumenta = 1,
  Kljucevi = 2,
  TorbeIRanci = 3,
  Nakit = 4,
  Odeca = 5,
  KucniLjubimci = 6,
  Ostalo = 7,
}

export const KATEGORIJA_LABELS: Record<Kategorija, string> = {
  [Kategorija.Elektronika]: 'Elektronika',
  [Kategorija.NovcaniciIDokumenta]: 'Novčanici i dokumenta',
  [Kategorija.Kljucevi]: 'Ključevi',
  [Kategorija.TorbeIRanci]: 'Torbe i ranci',
  [Kategorija.Nakit]: 'Nakit',
  [Kategorija.Odeca]: 'Odeća',
  [Kategorija.KucniLjubimci]: 'Kućni ljubimci',
  [Kategorija.Ostalo]: 'Ostalo',
};

export const KATEGORIJE: Kategorija[] = Object.values(Kategorija).filter(
  (v): v is Kategorija => typeof v === 'number',
);

export enum StatusPotrazivanja {
  NaCekanju = 0,
  Prihvaceno = 1,
  Odbijeno = 2,
}

export const STATUS_POTRAZIVANJA_LABELS: Record<StatusPotrazivanja, string> = {
  [StatusPotrazivanja.NaCekanju]: 'Na čekanju',
  [StatusPotrazivanja.Prihvaceno]: 'Prihvaćeno',
  [StatusPotrazivanja.Odbijeno]: 'Odbijeno',
};

export enum StatusRazgovora {
  Otvoren = 0,
  Zatvoren = 1,
}

export const STATUS_RAZGOVORA_LABELS: Record<StatusRazgovora, string> = {
  [StatusRazgovora.Otvoren]: 'Otvoren',
  [StatusRazgovora.Zatvoren]: 'Zatvoren',
};
