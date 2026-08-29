import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SERBIAN_CITIES } from '../../core/models/serbian-cities';
import { CATEGORY_LABELS, CATEGORIES, Category, ListingType } from '../../core/models/enums';
import { ListingCreate } from '../../core/models/listing.model';
import { ListingService } from '../../core/services/listing.service';
import { ToastService } from '../../core/services/toast.service';
import { MapView } from '../../shared/components/map-view/map-view';

@Component({
  selector: 'app-listing-form-page',
  imports: [FormsModule, MapView],
  templateUrl: './listing-form-page.html',
  styleUrl: './listing-form-page.scss',
})
export class ListingFormPage implements OnInit, OnDestroy {
  protected readonly SERBIAN_CITIES = SERBIAN_CITIES;
  protected readonly CATEGORIES = CATEGORIES;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;
  protected readonly ListingType = ListingType;

  protected isEdit = false;
  protected submitting = signal(false);
  protected loading = signal(false);
  protected previewUrl = signal<string | null>(null);
  protected selectedFileName = signal<string | null>(null);
  protected addLocation = signal(false);

  private selectedFile: File | null = null;

  protected form: ListingCreate = {
    title: '',
    description: '',
    type: ListingType.Lost,
    category: Category.Other,
    city: '',
    latitude: null,
    longitude: null,
    photo: null,
    locationDescription: null,
  };

  private listingId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly listingService: ListingService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.listingId = Number(idParam);
      this.loading.set(true);
      this.listingService.getById(this.listingId).subscribe({
        next: (o) => {
          this.form = {
            title: o.title,
            description: o.description,
            type: o.type,
            category: o.category,
            city: o.city,
            latitude: o.latitude,
            longitude: o.longitude,
            photo: o.photo,
            locationDescription: o.locationDescription,
          };
          this.addLocation.set(o.latitude !== null && o.longitude !== null);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName.set(file.name);
    this.revokePreview();
    this.previewUrl.set(URL.createObjectURL(file));
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.selectedFileName.set(null);
    this.revokePreview();
    this.form.photo = null;
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

  setType(type: ListingType): void {
    this.form.type = type;
    if (type === ListingType.Lost) {
      this.form.locationDescription = null;
    }
  }

  onPinChange(pin: { lat: number; lng: number }): void {
    this.form.latitude = pin.lat;
    this.form.longitude = pin.lng;
  }

  onToggleLocation(enabled: boolean): void {
    this.addLocation.set(enabled);
    if (!enabled) {
      this.form.latitude = null;
      this.form.longitude = null;
    }
  }

  submit(): void {
    if (!this.form.title || !this.form.description || !this.form.city) return;

    this.submitting.set(true);

    if (this.selectedFile) {
      this.listingService.uploadPhoto(this.selectedFile).subscribe({
        next: (res) => this.createOrUpdate(res.url),
        error: () => this.submitting.set(false),
      });
    } else {
      this.createOrUpdate(this.form.photo);
    }
  }

  private createOrUpdate(photo: string | null): void {
    const dto: ListingCreate = {
      ...this.form,
      photo,
      latitude: this.addLocation() ? this.form.latitude : null,
      longitude: this.addLocation() ? this.form.longitude : null,
    };
    const request$ =
      this.isEdit && this.listingId
        ? this.listingService.update(this.listingId, dto)
        : this.listingService.create(dto);

    request$.pipe(finalize(() => this.submitting.set(false))).subscribe((listing) => {
      this.toast.success(this.isEdit ? 'Oglas je izmenjen.' : 'Oglas je objavljen.');
      this.router.navigate(['/oglasi', listing.listingId]);
    });
  }
}
