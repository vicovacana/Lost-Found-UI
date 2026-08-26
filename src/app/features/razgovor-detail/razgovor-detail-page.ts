import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { StatusPotrazivanja, StatusRazgovora } from '../../core/models/enums';
import { Poruka } from '../../core/models/poruka.model';
import { Potrazivanje } from '../../core/models/potrazivanje.model';
import { Razgovor } from '../../core/models/razgovor.model';
import { AuthService } from '../../core/services/auth.service';
import { PorukaService } from '../../core/services/poruka.service';
import { PotrazivanjeService } from '../../core/services/potrazivanje.service';
import { RazgovorService } from '../../core/services/razgovor.service';
import { ToastService } from '../../core/services/toast.service';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

@Component({
  selector: 'app-razgovor-detail-page',
  imports: [FormsModule, StatusTag, DatePipe],
  templateUrl: './razgovor-detail-page.html',
  styleUrl: './razgovor-detail-page.scss',
})
export class RazgovorDetailPage implements OnInit {
  protected readonly StatusRazgovora = StatusRazgovora;
  protected readonly StatusPotrazivanja = StatusPotrazivanja;

  protected razgovor = signal<Razgovor | null>(null);
  protected poruke = signal<Poruka[]>([]);
  protected pending = signal<Potrazivanje[]>([]);
  protected loading = signal(true);
  protected sending = signal(false);
  protected novaPoruka = '';

  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;

  private razgovorId!: number;

  constructor(
    protected readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly razgovorService: RazgovorService,
    private readonly porukaService: PorukaService,
    private readonly potrazivanjeService: PotrazivanjeService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.razgovorId = Number(this.route.snapshot.paramMap.get('id'));
    this.razgovorService.getById(this.razgovorId).subscribe({
      next: (r) => {
        this.razgovor.set(r);
        this.loading.set(false);
        this.loadPoruke();
        if (this.auth.isAdmin() && r.statusRazgovora === StatusRazgovora.Otvoren) {
          this.loadPending(r.oglasId);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  get currentKorisnikId(): number | null {
    return this.auth.currentUser()?.korisnikId ?? null;
  }

  sendMessage(): void {
    const sadrzaj = this.novaPoruka.trim();
    if (!sadrzaj) return;
    this.sending.set(true);
    this.porukaService
      .create(this.razgovorId, { sadrzaj })
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe((poruka) => {
        this.poruke.update((list) => [...list, poruka]);
        this.novaPoruka = '';
        this.scrollToBottom();
      });
  }

  odluciPotrazivanje(p: Potrazivanje, status: StatusPotrazivanja): void {
    const oglasId = this.razgovor()?.oglasId;
    if (!oglasId) return;
    this.potrazivanjeService.updateStatus(oglasId, p.korisnikId, status).subscribe(() => {
      if (status === StatusPotrazivanja.Prihvaceno) {
        this.pending.set([]);
        this.razgovor.update((r) => (r ? { ...r, statusRazgovora: StatusRazgovora.Zatvoren } : r));
        this.toast.success('Potraživanje prihvaćeno. Razgovor je automatski zatvoren.');
      } else {
        this.pending.update((list) => list.filter((x) => x.korisnikId !== p.korisnikId));
        this.toast.success('Potraživanje odbijeno.');
      }
    });
  }

  private loadPoruke(): void {
    this.porukaService.getForRazgovor(this.razgovorId).subscribe((poruke) => {
      this.poruke.set(poruke);
      this.scrollToBottom();
    });
  }

  private loadPending(oglasId: number): void {
    this.potrazivanjeService.getForOglas(oglasId).subscribe((claims) => {
      this.pending.set(claims.filter((c) => c.status === StatusPotrazivanja.NaCekanju));
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }
}
