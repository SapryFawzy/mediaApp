import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuntyService {
  private readonly httpClient = inject(HttpClient);

  getSuggestedFrinds(limit: number = 5): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/suggestions?limit=${limit}`);
  }

  getAllNotifications(unread: boolean, limit: number, isAll: boolean): Observable<object> {
    return this.httpClient.get(
      environment.BASE_URL +
        `notifications?${!isAll ? `unread=${unread}&` : ''}page=1&limit=${limit}`,
    );
  }

  markNotificationAsRead(id: string): Observable<object> {
    return this.httpClient.patch(environment.BASE_URL + `notifications/${id}/read`, {});
  }

  markAllNotificationAsRead(): Observable<object> {
    return this.httpClient.patch(environment.BASE_URL + `notifications/read-all`, {});
  }

  getUnreadCount(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `notifications/unread-count`);
  }

  searchForFriend(value: string, limit: number = 20): Observable<object> {
    return this.httpClient.get(
      environment.BASE_URL + `users/search?page=1&limit=${limit}&q=${value}`,
    );
  }
}
