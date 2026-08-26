import { Component, OnInit, signal } from '@angular/core';
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
export class OglasFormPage implements OnInit {
  protected readonly GRADOVI_SRBIJE = GRADOVI_SRBIJE;
  protected readonly KATEGORIJE = KATEGORIJE;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;
  protected readonly TipOglasa = TipOglasa;

  protected isEdit = false;
  protected submitting = signal(false);
  protected loading = signal(false);
  protected uploading = signal(false);

  protected form: OglasCreate = {
    naziv: '',
    opis: '',
    tip: TipOglasa.Izgubljeno,
    kategorija: Kategorija.Ostalo,
    grad: '',
    latitude: null,
    longitude: null,
    fotografija: null,
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
          };
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

    this.uploading.set(true);
    this.oglasService
      .uploadFotografija(fajl)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (res) => (this.form.fotografija = res.url),
        error: () => (input.value = ''),
      });
  }

  removeFotografija(): void {
    this.form.fotografija = null;
  }

  onPinChange(pin: { lat: number; lng: number }): void {
    this.form.latitude = pin.lat;
    this.form.longitude = pin.lng;
  }

  useMyLocation(): void {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      this.form.latitude = pos.coords.latitude;
      this.form.longitude = pos.coords.longitude;
    });
  }

  submit(): void {
    if (!this.form.naziv || !this.form.opis || !this.form.grad) return;

    this.submitting.set(true);
    const dto: OglasCreate = { ...this.form, fotografija: this.form.fotografija || null };
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
