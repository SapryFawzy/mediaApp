import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './shared/directives/loading-overlay/loading-overlay.component';
import { LoaderService } from './core/auth/services/interceptors/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mediaApp');
  private readonly loaderService = inject(LoaderService);
  loading: Signal<boolean> = computed(() => this.loaderService.loading());
}
