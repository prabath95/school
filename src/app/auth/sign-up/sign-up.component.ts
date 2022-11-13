import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { NotificationService } from '../../utils/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {}

  createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null],
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      address: [null],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  get form() {
    return this.signUpForm.controls;
  }

  validateField(field: any) {
    return (
      (this.form[field].touched || this.form[field].disabled) &&
      this.form[field].enabled &&
      this.form[field].errors
    );
  }

  formTouched(controlName: string): boolean {
    return this.form[controlName].touched || this.form[controlName].dirty;
  }

  ngOnInit(): void {
    this.createSignUpForm();
  }

  register() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    if (this.form['password'].value != this.form['confirmPassword'].value) {
      this.notificationService.errorMessage('Password mismatch');
      return;
    }
    this.notificationService
      .confirmationMessage('This will create account.')
      .then((data) => {
        if (data.isConfirmed) {
          const userValidation = this.dataService.createUser(
            this.signUpForm.value
          );
          if (!userValidation) {
            this.notificationService.errorMessage('User already exists.');
          } else {
            this.navigateToLogin();
          }
        }
      });
  }

  navigateToLogin() {
    this.router.navigateByUrl('/auth/login');
  }

  reset() {
    this.notificationService
      .confirmationMessage('This will reset all data.')
      .then((data) => {
        if (data.isConfirmed) {
          this.signUpForm.reset();
        }
      });
  }
}
