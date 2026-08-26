import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './shared/components/nav-bar/nav-bar';
import { ToastHost } from './shared/components/toast-host/toast-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, ToastHost],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
