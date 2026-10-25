import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../../../core/Service/user/user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserProfile } from '../../../../core/models/iuser-profile.interface';
import { CommuntyService } from '../../../../core/Service/main/communty.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  private readonly userService = inject(UserService);
  private readonly communtyService = inject(CommuntyService);
  private readonly router = inject(Router);
  user: WritableSignal<WritableSignal<IUserProfile>> = signal(this.userService.user);
  isMenuOpen: WritableSignal<boolean> = signal(false);
  unreadCount: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.getUnreadCount();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  signOut(): void {
    this.closeMenu();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

    getUnreadCount() {
    this.communtyService.getUnreadCount().subscribe((res: any) => {
      this.unreadCount.set(res.data.unreadCount);
    });
  }
}
