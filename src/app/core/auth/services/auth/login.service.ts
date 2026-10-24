import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ilogin } from '../../../../features/auth/login/interface/ilogin.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly httpClint = inject(HttpClient);

  sendLoginData(data : Ilogin) : Observable<object> {
    return this.httpClint.post(`${environment.BASE_URL}/users/signin`,data);
  }
}
