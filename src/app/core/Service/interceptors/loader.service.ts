import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loading: WritableSignal<boolean> = signal(false);
}
