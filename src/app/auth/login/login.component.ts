import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../utils/notification.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private notificationUtils: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  get form() {
    return this.loginForm.controls;
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

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (
      this.dataService.checkUserAvailability(
        this.form['userName'].value,
        this.form['password'].value
      )
    ) {
      this.dataService.userLoggedIn();
      this.router.navigateByUrl('dashboard');
    } else {
      this.notificationUtils.errorMessage('Invalid user name or password.');
    }
  }

  navigate() {
    this.router.navigateByUrl('auth/sign-up');
  }
}
