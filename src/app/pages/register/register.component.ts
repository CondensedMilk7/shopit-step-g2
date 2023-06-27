import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-z]/),
        Validators.minLength(2),
        Validators.maxLength(20),
        this.badNameValidator('badname'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: [''],
    positions: this.fb.array([this.fb.control('')]),
  });

  // გამოიყენეთ NonNullableFormBuilder რათა reset()-მა
  // კონტროლები გადაიყვანოს საწყის მნიშვნელობაზე და არა null-ზე.
  constructor(private fb: NonNullableFormBuilder) {
    this.controls.confirmPassword.setValidators([
      this.confirmPasswordValidator(this.controls.password),
      Validators.required,
    ]);
    this.controls.name.valueChanges.subscribe(() => {
      console.log(this.controls.name);
    });
  }

  get controls() {
    return this.registerForm.controls;
  }

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

  badNameValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.includes(pattern)
        ? { badName: 'Includes bad name!' }
        : null;
    };
  }

  confirmPasswordValidator(compareTo: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== compareTo.value) {
        return { confirmPassword: 'Passwords do not match' };
      }
      return null;
    };
  }
}
