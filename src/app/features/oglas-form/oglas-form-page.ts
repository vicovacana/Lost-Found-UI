import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { GRADOVI_SRBIJE } from '../../core/models/gradovi-srbije';
import { KATEGORIJA_LABELS, KATEGORIJE, Kategorija, TipOglasa } from '../../core/models/enums';
import { OglasCreate } from '../../core/models/oglas.model';
import { OglasService } from '../../core/services/oglas.service';
import { ToastService } from '../../core/services/toast.service';
import { MapView } from '../../shared/components/map-view/map-view';

@Component({
  selector: 'app-oglas-form-page',
  imports: [FormsModule, MapView],
  templateUrl: './oglas-form-page.html',
  styleUrl: './oglas-form-page.scss',
})
export class OglasFormPage implements OnInit, OnDestroy {
  protected readonly GRADOVI_SRBIJE = GRADOVI_SRBIJE;
  protected readonly KATEGORIJE = KATEGORIJE;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;
  protected readonly TipOglasa = TipOglasa;

  protected isEdit = false;
  protected submitting = signal(false);
  protected loading = signal(false);
  protected previewUrl = signal<string | null>(null);
  protected selectedFileName = signal<string | null>(null);
  protected dodajLokaciju = signal(false);

  private selectedFile: File | null = null;

  protected form: OglasCreate = {
    naziv: '',
    opis: '',
    tip: TipOglasa.Izgubljeno,
    kategorija: Kategorija.Ostalo,
    grad: '',
    latitude: null,
    longitude: null,
    fotografija: null,
    opisLokacije: null,
  };

  private oglasId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly oglasService: OglasService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.oglasId = Number(idParam);
      this.loading.set(true);
      this.oglasService.getById(this.oglasId).subscribe({
        next: (o) => {
          this.form = {
            naziv: o.naziv,
            opis: o.opis,
            tip: o.tip,
            kategorija: o.kategorija,
            grad: o.grad,
            latitude: o.latitude,
            longitude: o.longitude,
            fotografija: o.fotografija,
            opisLokacije: o.opisLokacije,
          };
          this.dodajLokaciju.set(o.latitude !== null && o.longitude !== null);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onFotografijaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fajl = input.files?.[0];
    if (!fajl) return;

    this.selectedFile = fajl;
    this.selectedFileName.set(fajl.name);
    this.revokePreview();
    this.previewUrl.set(URL.createObjectURL(fajl));
  }

  removeFotografija(): void {
    this.selectedFile = null;
    this.selectedFileName.set(null);
    this.revokePreview();
    this.form.fotografija = null;
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  private revokePreview(): void {
    const current = this.previewUrl();
    if (current) {
      URL.revokeObjectURL(current);
      this.previewUrl.set(null);
    }
  }

  setTip(tip: TipOglasa): void {
    this.form.tip = tip;
    if (tip === TipOglasa.Izgubljeno) {
      this.form.opisLokacije = null;
    }
  }

  onPinChange(pin: { lat: number; lng: number }): void {
    this.form.latitude = pin.lat;
    this.form.longitude = pin.lng;
  }

  onToggleLokacija(ukljuceno: boolean): void {
    this.dodajLokaciju.set(ukljuceno);
    if (!ukljuceno) {
      this.form.latitude = null;
      this.form.longitude = null;
    }
  }

  submit(): void {
    if (!this.form.naziv || !this.form.opis || !this.form.grad) return;

    this.submitting.set(true);

    if (this.selectedFile) {
      this.oglasService.uploadFotografija(this.selectedFile).subscribe({
        next: (res) => this.createOrUpdate(res.url),
        error: () => this.submitting.set(false),
      });
    } else {
      this.createOrUpdate(this.form.fotografija);
    }
  }

  private createOrUpdate(fotografija: string | null): void {
    const dto: OglasCreate = {
      ...this.form,
      fotografija,
      latitude: this.dodajLokaciju() ? this.form.latitude : null,
      longitude: this.dodajLokaciju() ? this.form.longitude : null,
    };
    const request$ =
      this.isEdit && this.oglasId
        ? this.oglasService.update(this.oglasId, dto)
        : this.oglasService.create(dto);

    request$.pipe(finalize(() => this.submitting.set(false))).subscribe((oglas) => {
      this.toast.success(this.isEdit ? 'Oglas je izmenjen.' : 'Oglas je objavljen.');
      this.router.navigate(['/oglasi', oglas.oglasId]);
    });
  }
}
