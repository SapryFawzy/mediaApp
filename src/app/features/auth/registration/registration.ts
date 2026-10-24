import {
  Component,
  OnInit,
  viewChild,
  signal,
  ElementRef,
  inject,
  WritableSignal,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  FormBuilder,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';
import { RegisterationService } from '../../../core/auth/services/auth/registeration.service';
import { Iregisteration } from './interface/iregisteration.interface';
import { IregisterationResponse } from './interface/iregisteration-response.interface';
import { FormErrorMsgComponent } from '../../../shared/ui/auth/form-error-msg/form-error-msg.component';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, ReactiveFormsModule, FormErrorMsgComponent],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  private readonly registerationService = inject(RegisterationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  approve = viewChild<ElementRef<HTMLInputElement>>('aprrove');
  registrationForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.pattern(/^[a-z0-9_]{3,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: this.cheackPassword },
  );

  sucssesMsg: WritableSignal<string> = signal('');
  error: WritableSignal<[]> = signal([]);
  isSucssed: WritableSignal<boolean> = signal(false);
  iserror: WritableSignal<boolean> = signal(false);
  isapproved: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    initFlowbite();
  }

  cheackPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;

    if (form.get('rePassword')?.touched && password !== rePassword) {
      form.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  registration() {
    this.isSucssed.set(false);
    this.iserror.set(false);
    const aprova = this.approve()?.nativeElement.checked; // italianooooooo
    if (!aprova) {
      this.isapproved.set(true);
    }
    if (this.registrationForm.valid && aprova) {
      this.registerationService
        .sendRegisterationData(this.registrationForm.value as Iregisteration)
        .subscribe({
          next: (res) => {
            let respnse: IregisterationResponse = res as IregisterationResponse;
            if (respnse.success) {
              this.sucssesMsg.set(respnse.message);
              this.isSucssed.set(true);
            }
          },
          error: (e) => {
            const erroes = e.error.message.split(':');
            this.error.set(erroes[0].split(','));
            this.iserror.set(true);
          },
          complete: () => {
            setTimeout(() => {
              this.isSucssed.set(false);
              this.router.navigate(['/login']);
            }, 3000);
          },
        });
    } else {
      this.registrationForm.markAllAsTouched();
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
