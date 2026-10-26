import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginService } from '../../../core/auth/services/auth/login.service';
import { Ilogin } from './interface/ilogin.interface';
import { FormErrorMsgComponent } from '../../../shared/ui/auth/form-error-msg/form-error-msg.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FormErrorMsgComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly logInService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  SignInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  error: WritableSignal<string> = signal('');
  iserror: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    initFlowbite();
  }

  signIn() {
    this.iserror.set(false);
    this.SignInForm.markAllAsTouched();
    if (this.SignInForm.valid) {
      setTimeout(() => {
      }, 3000);
      this.logInService.sendLoginData(this.SignInForm.value as Ilogin).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.router.navigate(['/feed']);
          }
        },
        error: (e) => {
          this.error.set(e.error.message);
          this.iserror.set(true);
        },
      });
    } else {
      this.SignInForm.markAllAsTouched();
    }
  }

  showPassword(passwordElement: any) {
    if (passwordElement.type === 'password') {
      passwordElement.type = 'text';
    } else {
      passwordElement.type = 'password';
    }
  }
}
