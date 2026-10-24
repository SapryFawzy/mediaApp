import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-error-msg',
  imports: [],
  templateUrl: './form-error-msg.component.html',
  styleUrl: './form-error-msg.component.css',
})
export class FormErrorMsgComponent {
  errorMsg = input('');
}
