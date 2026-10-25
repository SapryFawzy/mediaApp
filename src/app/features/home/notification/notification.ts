import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommuntyService } from '../../../core/Service/main/communty.service';
import { Inotification } from './models/inotification.interface';
import { FormatDatePipe } from './../../../shared/pipes/format-date-pipe';

@Component({
  selector: 'app-notification',
  imports: [FormatDatePipe],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  private readonly communtyService = inject(CommuntyService);
  notifications: WritableSignal<Inotification[]> = signal([]);
  unreadCount: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications(isAll: boolean = true, unread: boolean = true, limit: number = 30) {
    this.getUnreadCount();
    this.communtyService.getAllNotifications(unread, limit, isAll).subscribe((res: any) => {
      this.notifications.set(res.data.notifications);
    });
  }

  markNotificationAsRead(id: string) {
    this.communtyService.markNotificationAsRead(id).subscribe(() => {
      this.getAllNotifications();
    });
  }

  markAllNotificationAsRead() {
    this.communtyService.markAllNotificationAsRead().subscribe(() => {
      this.getAllNotifications();
    });
  }

  getUnreadCount() {
    this.communtyService.getUnreadCount().subscribe((res: any) => {
      this.unreadCount.set(res.data.unreadCount);
    });
  }
}
