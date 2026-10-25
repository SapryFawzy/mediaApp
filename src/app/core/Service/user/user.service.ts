import { inject, Injectable, signal, WritableSignal } from '@angular/core';
// import { Iuser } from '../../../models/iuser.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IUserProfile } from '../../models/iuser-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  user: WritableSignal<IUserProfile> = signal({} as IUserProfile);

  constructor() {
    this.updateUserData();
  }

  updateUserData() {
    this.getUserProfileData().subscribe((res: any) => {
      this.user.set(res.data.user);
    });
  }

  getUserProfileData(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/profile-data`);
  }

  uploadUserPhoto(body: FormData): Observable<object> {
    return this.httpClient.put(environment.BASE_URL + `users/upload-photo`, body);
  }

  uploadUserCoverImage(body: FormData): Observable<object> {
    return this.httpClient.put(environment.BASE_URL + `users/upload-cover`, body);
  }

  getUserInfo(userId: string): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/${userId}/profile`);
  }

  getUserDetailProfileData(userId: string): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/${userId}`);
  }

  deleteCoverImage(): Observable<object> {
    return this.httpClient.delete(environment.BASE_URL + 'users/cover');
  }

  changePassword(body: any): Observable<object> {
    return this.httpClient.patch(environment.BASE_URL + `users/change-password`, body);
  }
}
