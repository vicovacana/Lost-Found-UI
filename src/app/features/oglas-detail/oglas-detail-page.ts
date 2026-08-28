import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { KATEGORIJA_LABELS, StatusPotrazivanja, TipOglasa } from '../../core/models/enums';
import { Oglas } from '../../core/models/oglas.model';
import { Potrazivanje } from '../../core/models/potrazivanje.model';
import { Razgovor } from '../../core/models/razgovor.model';
import { AuthService } from '../../core/services/auth.service';
import { OglasService } from '../../core/services/oglas.service';
import { PotrazivanjeService } from '../../core/services/potrazivanje.service';
import { RazgovorService } from '../../core/services/razgovor.service';
import { ToastService } from '../../core/services/toast.service';
import { MapView } from '../../shared/components/map-view/map-view';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

@Component({
  selector: 'app-oglas-detail-page',
  imports: [RouterLink, MapView, StatusTag, DatePipe],
  templateUrl: './oglas-detail-page.html',
  styleUrl: './oglas-detail-page.scss',
})
export class OglasDetailPage implements OnInit {
  protected readonly TipOglasa = TipOglasa;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;
  protected readonly StatusPotrazivanja = StatusPotrazivanja;

  protected oglas = signal<Oglas | null>(null);
  protected loading = signal(true);
  protected myClaim = signal<Potrazivanje | null>(null);
  protected razgovor = signal<Razgovor | null>(null);
  protected potrazivanja = signal<Potrazivanje[]>([]);
  protected claiming = signal(false);
  protected openingRazgovor = signal(false);

  protected readonly auth: AuthService;

  private oglasId!: number;

  constructor(
    auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly oglasService: OglasService,
    private readonly potrazivanjeService: PotrazivanjeService,
    private readonly razgovorService: RazgovorService,
    private readonly toast: ToastService,
  ) {
    this.auth = auth;
  }

  ngOnInit(): void {
    this.oglasId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  get isOwner(): boolean {
    const user = this.auth.currentUser();
    const oglas = this.oglas();
    return !!user && !!oglas && user.korisnikId === oglas.kreatorId;
  }

  claim(): void {
    this.claiming.set(true);
    this.potrazivanjeService.create(this.oglasId).subscribe({
      next: (p) => {
        this.myClaim.set(p);
        this.claiming.set(false);
        this.toast.success('Zahtev je poslat.');
        this.loadRazgovor();
      },
      error: () => this.claiming.set(false),
    });
  }

  startRazgovor(): void {
    this.openingRazgovor.set(true);
    this.razgovorService.open(this.oglasId).subscribe({
      next: (r) => this.router.navigate(['/razgovori', r.razgovorId]),
      error: () => this.openingRazgovor.set(false),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.oglasService.getById(this.oglasId).subscribe({
      next: (oglas) => {
        this.oglas.set(oglas);
        this.loading.set(false);
        this.loadRelated();
      },
      error: () => this.loading.set(false),
    });
  }

  private loadRelated(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    if (!this.isOwner) {
      this.potrazivanjeService.getMine().subscribe((claims) => {
        const mine = claims.find((c) => c.oglasId === this.oglasId);
        if (mine) this.myClaim.set(mine);
      });
    }

    this.loadRazgovor();

    if (this.auth.isAdmin()) {
      this.potrazivanjeService.getForOglas(this.oglasId).subscribe((claims) => {
        this.potrazivanja.set(claims);
      });
    }
  }

  private loadRazgovor(): void {
    this.razgovorService
      .getForOglas(this.oglasId)
      .pipe(catchError(() => of(null)))
      .subscribe((r) => this.razgovor.set(r));
  }
}
