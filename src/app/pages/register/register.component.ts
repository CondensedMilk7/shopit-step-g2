import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: [
      'Oscar Peterson',
      [
        Validators.required,
        Validators.pattern(/^[A-z]/),
        Validators.minLength(2),
        Validators.maxLength(20),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    positions: this.fb.array([this.fb.control('')]),
  });

  // გამოიყენეთ NonNullableFormBuilder რათა reset()-მა
  // კონტროლები გადაიყვანოს საწყის მნიშვნელობაზე და არა null-ზე.
  constructor(private fb: FormBuilder) {}

  get positions() {
    return this.registerForm.controls['positions'];
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.registerForm.reset();
    console.log(this.registerForm.value);
  }

  onUpdateName() {
    this.registerForm.patchValue({
      email: 'oscar@mail',
      password: '2-5-1',
    });
  }

  addPosition() {
    this.positions.push(this.fb.control(''));
  }
}
