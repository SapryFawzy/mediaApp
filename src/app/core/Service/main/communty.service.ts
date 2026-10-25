import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuntyService {
  private readonly httpClient = inject(HttpClient);

  getSuggestedFrinds(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/suggestions?limit=5`);
  }
}
