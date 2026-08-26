import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BEOGRAD: [number, number] = [44.8154, 20.4602];

@Component({
  selector: 'app-map-view',
  template: `<div class="map-view" #mapEl></div>`,
  styleUrl: './map-view.scss',
})
export class MapView implements AfterViewInit, OnChanges, OnDestroy {
  @Input() mode: 'view' | 'pick' = 'view';
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() zoom = 15;
  @Output() pinChange = new EventEmitter<{ lat: number; lng: number }>();

  @ViewChild('mapEl', { static: true }) private readonly mapEl!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  ngAfterViewInit(): void {
    const start: [number, number] =
      this.lat !== null && this.lng !== null ? [this.lat, this.lng] : BEOGRAD;

    this.map = L.map(this.mapEl.nativeElement).setView(start, this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    if (this.lat !== null && this.lng !== null) {
      this.placeMarker(this.lat, this.lng);
    } else if (this.mode === 'pick') {
      this.placeMarker(start[0], start[1]);
    }

    if (this.mode === 'pick') {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.placeMarker(e.latlng.lat, e.latlng.lng);
        this.pinChange.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    if ((changes['lat'] || changes['lng']) && this.lat !== null && this.lng !== null) {
      this.placeMarker(this.lat, this.lng);
      this.map.setView([this.lat, this.lng], this.map.getZoom());
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private placeMarker(lat: number, lng: number): void {
    if (!this.map) return;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: this.mode === 'pick' }).addTo(this.map);
      if (this.mode === 'pick') {
        this.marker.on('dragend', () => {
          const pos = this.marker!.getLatLng();
          this.pinChange.emit({ lat: pos.lat, lng: pos.lng });
        });
      }
    }
  }
}
