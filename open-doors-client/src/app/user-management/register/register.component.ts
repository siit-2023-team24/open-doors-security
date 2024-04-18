import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { UserAccount } from '../model/user-account.model';
import { Country } from 'src/app/shared/model/country';
import { MatSnackBar } from '@angular/material/snack-bar';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const passwordControl = control.get('password');
  const confirmPasswordControl = control.get('confirmPassword');

  if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
    if (confirmPasswordControl.errors) {
      confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    }
    return { passwordMismatch: true };
  } else {
    if (confirmPasswordControl) {
      confirmPasswordControl.setErrors(null);
    }
    return null;
  }
};

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumberRegex = /^\d{10}$/;

    if (control.value && !phoneNumberRegex.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../styles.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  countries = Object.values(Country);

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, 
    private snackBar: MatSnackBar) {  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      country: ['', Validators.required],
      city: ['', [Validators.required, Validators.maxLength(200)]],
      street: ['', [Validators.required, Validators.maxLength(200)]],
      role: ['ROLE_GUEST', []],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      number: ['1', Validators.min(1)],
      phone: ['', [Validators.required, phoneNumberValidator()]],
    }, { validator: passwordMatchValidator });
  }

  onRegisterClick(): void {
    if(!this.registerForm.valid) {
      this.errorMessage = 'Please fill out all the fields according to the validations.'
      return;
    }
    this.register();
  }

  register(): void {
    this.errorMessage = '';
    const user: UserAccount = this.registerForm.value;
    this.userService.register(user).subscribe(
      (response) => {
        console.log("SUCCESS! " + user, response);
        this.router.navigate(['login']);
        this.snackBar.open('Registration successful! Please check your email address to verify your account.', 'Close', {
          duration: 6000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      },
      (error) => {
        this.errorMessage="The username is taken. Please choose a different one.";
      }
    );
  }

}
