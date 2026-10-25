import { Component, inject, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../../core/Service/user/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { FormErrorMsgComponent } from '../../../shared/ui/auth/form-error-msg/form-error-msg.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sittings',
  imports: [ReactiveFormsModule, FormErrorMsgComponent],
  templateUrl: './sittings.component.html',
  styleUrl: './sittings.component.css',
})
export class SittingsComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  changePasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
  });
  reNewPassword: FormControl = new FormControl('');
  showError: WritableSignal<boolean> = signal(false);

  changePassword() {
    if (this.changePasswordForm.invalid) return;
    if (this.changePasswordForm.get('newPassword')?.value !== this.reNewPassword.value) {
      this.showError.set(true);
      return;
    }
    console.log(this.changePasswordForm.value);

    this.userService.changePassword(this.changePasswordForm.value).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  showPassword(passwordElement: any) {
    if (passwordElement.type === 'password') {
      passwordElement.type = 'text';
    } else {
      passwordElement.type = 'password';
    }
  }
}
