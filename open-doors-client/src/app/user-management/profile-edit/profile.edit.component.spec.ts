import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileEditComponent } from './profile.edit.component';
import { UserService } from '../user.service';
import { UserServiceMock, mockEditedUser, mockUser } from '../mocks/user.service.mock';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthServiceMock } from '../mocks/auth.service.mock';
import { ImageService } from 'src/app/image-management/image.service';
import { ImageServiceMock } from '../mocks/image.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        RouterTestingModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [ProfileEditComponent],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ImageService, useClass: ImageServiceMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService)
    fixture.detectChanges();
  });

  it("should create Profile Edit component", () => {
    expect(component).toBeTruthy();
  });

  it('should have user loaded', () => {
    expect(component.userDto).toEqual(mockUser);
  });

  it(`html should patch data in form`, () => {
    fixture.whenStable().then(() => {
      expect(component.editProfileForm.value).toEqual(mockUser);
    });
  });

  it(`html should render the user`, () => {
    fixture.whenStable().then(() => {
      const firstName = fixture.nativeElement.querySelector('input[name=firstName]');
      const lastName = fixture.nativeElement.querySelector('input[name=lastName]');
      const country = fixture.nativeElement.querySelector('input[name=country]');
      const city = fixture.nativeElement.querySelector('input[name=city]');
      const street = fixture.nativeElement.querySelector('input[name=street]');
      const number = fixture.nativeElement.querySelector('input[name=number]');
      const phone = fixture.nativeElement.querySelector('input[name=phone]');

      expect(firstName.value).toEqual(mockUser.firstName);
      expect(lastName.value).toEqual(mockUser.lastName);
      expect(country.value).toEqual(mockUser.country);
      expect(city.value).toEqual(mockUser.city);
      expect(street.value).toEqual(mockUser.street);
      expect(number.value).toEqual(mockUser.number);
      expect(phone.value).toEqual(mockUser.phone);
    });
  });


  it(`form should be valid`, () => {
    component.editProfileForm.controls['firstName'].setValue('Marinette');
    component.editProfileForm.controls['lastName'].setValue('Du Pain Cheng');
    component.editProfileForm.controls['country'].setValue('China');
    component.editProfileForm.controls['city'].setValue('Beijing');
    component.editProfileForm.controls['street'].setValue('Jang Ce');
    component.editProfileForm.controls['number'].setValue(4);
    component.editProfileForm.controls['phone'].setValue('123123132');
    expect(component.editProfileForm.valid).toBeTruthy();
  });

  it(`form should be invalid`, () => {
    component.editProfileForm.controls['firstName'].setValue('');
    component.editProfileForm.controls['lastName'].setValue('');
    component.editProfileForm.controls['country'].setValue('');
    component.editProfileForm.controls['city'].setValue('');
    component.editProfileForm.controls['street'].setValue('');
    component.editProfileForm.controls['number'].setValue('');
    component.editProfileForm.controls['phone'].setValue('');
    expect(component.editProfileForm.valid).toBeFalsy();
  });

  it(`form should be valid`, () => {
    component.editProfileForm.controls['firstName'].setValue('Marinette');
    component.editProfileForm.controls['lastName'].setValue('Du Pain Cheng');
    component.editProfileForm.controls['country'].setValue('China');
    component.editProfileForm.controls['city'].setValue('Beijing');
    component.editProfileForm.controls['street'].setValue('Jang Ce');
    component.editProfileForm.controls['number'].setValue(4);
    component.editProfileForm.controls['phone'].setValue('123a');
    expect(component.editProfileForm.valid).toBeFalsy();
  });

  it(`should send request`, fakeAsync (() => {
    let spy = spyOn(userService, 'updateUser').and.callThrough();

    component.editProfileForm.patchValue(mockEditedUser);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.debugElement.query(By.css('#edit-btn')).triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.saveChanges).toHaveBeenCalledTimes(1);
      expect(component.editProfileForm.valid).toBeTrue();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  }));

  it(`should not send request`, fakeAsync (() => {
    let spy = spyOn(userService, 'updateUser').and.callThrough();

    component.editProfileForm.patchValue({
      id: 1,
      firstName: "Adrien",
      lastName: "Agreste",
      country: "France",
      city: "Paris",
      street: "Rue de Belgrade",
      number: 1,
      phone: "1a"
    });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.debugElement.query(By.css('#edit-btn')).triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.saveChanges).toHaveBeenCalledTimes(1);
      expect(component.editProfileForm.valid).toBeFalse();
      expect(spy).toHaveBeenCalledTimes(0);
    });
  }));



});
