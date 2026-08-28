import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KATEGORIJA_LABELS, TipOglasa } from '../../core/models/enums';
import { Korisnik } from '../../core/models/korisnik.model';
import { Oglas } from '../../core/models/oglas.model';
import { Potrazivanje } from '../../core/models/potrazivanje.model';
import { KorisnikService } from '../../core/services/korisnik.service';
import { OglasService } from '../../core/services/oglas.service';
import { PotrazivanjeService } from '../../core/services/potrazivanje.service';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

type Tab = 'oglasi' | 'potrazivanja';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, StatusTag],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  protected readonly TipOglasa = TipOglasa;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;

  protected me = signal<Korisnik | null>(null);
  protected mojiOglasi = signal<Oglas[]>([]);
  protected mojaPotrazivanja = signal<Potrazivanje[]>([]);
  protected tab = signal<Tab>('oglasi');
  protected loading = signal(true);

  constructor(
    private readonly korisnikService: KorisnikService,
    private readonly oglasService: OglasService,
    private readonly potrazivanjeService: PotrazivanjeService,
  ) {
    this.korisnikService.getMe().subscribe((me) => {
      this.me.set(me);
      this.oglasService.getAll({ kreatorId: me.korisnikId }).subscribe((oglasi) => {
        this.mojiOglasi.set(oglasi);
        this.loading.set(false);
      });
    });
    this.potrazivanjeService.getMine().subscribe((p) => this.mojaPotrazivanja.set(p));
  }

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }
}
