import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusRazgovora } from '../../core/models/enums';
import { Razgovor } from '../../core/models/razgovor.model';
import { RazgovorService } from '../../core/services/razgovor.service';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

type Tab = StatusRazgovora;

@Component({
  selector: 'app-razgovori-list-page',
  imports: [RouterLink, StatusTag, DatePipe],
  templateUrl: './razgovori-list-page.html',
  styleUrl: './razgovori-list-page.scss',
})
export class RazgovoriListPage {
  protected readonly StatusRazgovora = StatusRazgovora;

  protected razgovori = signal<Razgovor[]>([]);
  protected loading = signal(true);
  protected tab = signal<Tab>(StatusRazgovora.Otvoren);

  protected filtered = computed(() =>
    this.razgovori().filter((r) => r.statusRazgovora === this.tab()),
  );

  protected otvorenihCount = computed(
    () => this.razgovori().filter((r) => r.statusRazgovora === StatusRazgovora.Otvoren).length,
  );
  protected zatvorenihCount = computed(
    () => this.razgovori().filter((r) => r.statusRazgovora === StatusRazgovora.Zatvoren).length,
  );

  constructor(private readonly razgovorService: RazgovorService) {
    this.razgovorService.getMine().subscribe({
      next: (data) => {
        this.razgovori.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }
}
