import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GRADOVI_SRBIJE } from '../../core/models/gradovi-srbije';
import { KATEGORIJA_LABELS, KATEGORIJE, Kategorija, TipOglasa } from '../../core/models/enums';
import { Oglas } from '../../core/models/oglas.model';
import { AuthService } from '../../core/services/auth.service';
import { OglasService } from '../../core/services/oglas.service';
import { OglasCard } from '../../shared/components/oglas-card/oglas-card';

type TipFilter = 'svi' | TipOglasa;
type StatusFilter = 'svi' | 'aktivni' | 'neaktivni';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, OglasCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly GRADOVI_SRBIJE = GRADOVI_SRBIJE;
  protected readonly KATEGORIJE = KATEGORIJE;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;
  protected readonly TipOglasa = TipOglasa;

  protected grad = signal<string>('');
  protected search = signal<string>('');
  protected tip = signal<TipFilter>('svi');
  protected kategorija = signal<Kategorija | null>(null);
  protected statusFilter = signal<StatusFilter>('aktivni');

  protected oglasi = signal<Oglas[]>([]);
  protected loading = signal(false);

  protected filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.oglasi();
    return this.oglasi().filter(
      (o) => o.naziv.toLowerCase().includes(q) || o.opis.toLowerCase().includes(q),
    );
  });

  constructor(
    protected readonly auth: AuthService,
    private readonly oglasService: OglasService,
  ) {
    this.reload();
  }

  setTip(tip: TipFilter): void {
    this.tip.set(tip);
    this.reload();
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.reload();
  }

  toggleKategorija(k: Kategorija): void {
    this.kategorija.set(this.kategorija() === k ? null : k);
    this.reload();
  }

  onGradChange(): void {
    this.reload();
  }

  private reload(): void {
    this.loading.set(true);
    const tipValue = this.tip();
    const statusValue = this.auth.isAdmin() ? this.statusFilter() : 'aktivni';
    this.oglasService
      .getAll({
        tip: tipValue === 'svi' ? undefined : tipValue,
        grad: this.grad() || undefined,
        kategorija: this.kategorija() ?? undefined,
        samoAktivni: statusValue === 'svi' ? undefined : statusValue === 'aktivni',
      })
      .subscribe({
        next: (data) => {
          this.oglasi.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
