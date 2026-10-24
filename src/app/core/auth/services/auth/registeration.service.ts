import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iregisteration } from '../../../../features/auth/registration/interface/iregisteration.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterationService {
  private readonly httpClient = inject(HttpClient);

  sendRegisterationData(data: Iregisteration): Observable<object> {
    return this.httpClient.post(`${environment.BASE_URL}users/signup`, data);
  }
}
