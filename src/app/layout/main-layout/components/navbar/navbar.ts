import { Component, inject, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../../../core/auth/services/user/user.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserProfile } from '../../../../core/models/iuser-profile.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  user: WritableSignal<WritableSignal<IUserProfile>> = signal(this.userService.user);
  isMenuOpen: WritableSignal<boolean> = signal(false);

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
}
