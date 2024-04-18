import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../user.service';
import { UserServiceMock, invalidForm, mockNewUser, stringOfLength201, validForm, validationErrorMessage } from '../mocks/user.service.mock';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
//   let userServiceSpy: jasmine.SpyObj<UserService>;
  let userService: UserService;



  beforeEach(() => {
    // const userServiceSpyObj = jasmine.createSpyObj('UserService', ['register']);
    
    
    TestBed.configureTestingModule({
        declarations: [RegisterComponent],
        imports: [
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatInputModule,
          MatFormFieldModule,
          MatRadioModule,
          MatSelectModule,
          MatButtonModule,
          MatSnackBarModule,
          RouterTestingModule,
          HttpClientTestingModule,
        ],
        providers: [
            // { provide: UserService, useValue: userServiceSpyObj },
            { provide: UserService, useClass: UserServiceMock },

        ],
      }).compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    // userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userService = TestBed.get(UserService)

    fixture.detectChanges();
  });

  it('should create Register component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const defaultValues = {
      country: '',
      city: '',
      street: '',
      role: 'ROLE_GUEST',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      number: '1',
      phone: ''
    };

    expect(component.registerForm.value).toEqual(defaultValues);
  });

  it('should have required validators for form controls', () => {
    const controls = component.registerForm.controls;
    expect(controls['country'].valid).toBeFalsy();
    expect(controls['city'].valid).toBeFalsy();
    expect(controls['street'].valid).toBeFalsy();
    expect(controls['role'].valid).toBeTruthy();
    expect(controls['username'].valid).toBeFalsy();
    expect(controls['password'].valid).toBeFalsy();
    expect(controls['confirmPassword'].valid).toBeTruthy();
    expect(controls['firstName'].valid).toBeFalsy();
    expect(controls['lastName'].valid).toBeFalsy();
    expect(controls['number'].valid).toBeTruthy();
    expect(controls['phone'].valid).toBeFalsy();
  });

  it('form should be valid', () => {
    const controls = component.registerForm.controls;
    controls['country'].setValue('Serbia');
    controls['city'].setValue('Novi Sad');
    controls['street'].setValue('Zeleznicka');
    controls['role'].setValue("ROLE_GUEST");
    controls['username'].setValue("vaske@test.test");
    controls['password'].setValue("12345678");
    controls['confirmPassword'].setValue("12345678");
    controls['firstName'].setValue("Sveta");
    controls['lastName'].setValue("Ili Mileta");
    controls['number'].setValue(4);
    controls['phone'].setValue("0615502212");
  
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('form should be invalid for simple validations', () => {
    const controls = component.registerForm.controls;
    controls['city'].setValue(stringOfLength201);
    controls['street'].setValue(stringOfLength201);
    controls['password'].setValue("1234567");
    controls['confirmPassword'].setValue("12345678");
    controls['number'].setValue(0);
  
    expect(controls['city'].valid).toBeFalsy();
    expect(controls['street'].valid).toBeFalsy();
    expect(controls['password'].valid).toBeFalsy();
    expect(controls['confirmPassword'].valid).toBeFalsy();
    expect(controls['number'].valid).toBeFalsy();
    expect(controls['phone'].valid).toBeFalsy();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be invalid for email format', () => {
    const controls = component.registerForm.controls;

    controls['username'].setValue("vasketest.test");
    expect(controls['username'].valid).toBeFalsy();

    controls['username'].setValue("vasketesttest");
    expect(controls['username'].valid).toBeFalsy();
    
    controls['username'].setValue("@vasketesttest");
    expect(controls['username'].valid).toBeFalsy();
  
  });

  it('form should be invalid for phone format', () => {
    const controls = component.registerForm.controls;
    
    controls['phone'].setValue("123456789s");
    expect(controls['phone'].valid).toBeFalsy();
    
    controls['phone'].setValue("12345678901");
    expect(controls['phone'].valid).toBeFalsy();

    controls['phone'].setValue("123456789");
    expect(controls['phone'].valid).toBeFalsy();
  });

  it('should call the service', waitForAsync(async () => {
    let spy = spyOn(userService, 'register').and.callThrough();

    component.registerForm.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.errorMessage).toEqual('');
  }));

  it('should not call the service', waitForAsync(async () => {
    let spy = spyOn(userService, 'register').and.callThrough();
    
    component.registerForm.patchValue(invalidForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(0);
    expect(component.errorMessage).toEqual(validationErrorMessage);
  }));

  it('should call the register method', waitForAsync(async () => {
    spyOn(component, 'register');

    component.registerForm.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeTruthy();
    expect(component.register).toHaveBeenCalledTimes(1);
    expect(component.errorMessage).toEqual('');

  }));

  it('should not call the register method', waitForAsync(async () => {
    spyOn(component, 'register');

    component.registerForm.patchValue(invalidForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeFalsy();
    expect(component.register).toHaveBeenCalledTimes(0);
    expect(component.errorMessage).toEqual(validationErrorMessage);
  }));

  it('should call the onRegisterClick when the form is valid', waitForAsync(async () => {
    spyOn(component, 'onRegisterClick').and.callThrough();

    component.registerForm.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeTruthy();
    expect(component.onRegisterClick).toHaveBeenCalledTimes(1);
  }));

  it('should call the onRegisterClick when the form is invalid', waitForAsync(async () => {
    spyOn(component, 'onRegisterClick').and.callThrough;
    
    component.registerForm.patchValue(invalidForm);

    fixture.detectChanges();
    await fixture.whenStable();

    const registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    registerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.registerForm.valid).toBeFalsy();
    expect(component.onRegisterClick).toHaveBeenCalledTimes(1);
  }));
});