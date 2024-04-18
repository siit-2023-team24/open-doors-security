import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { mockNewUser, mockUser } from './mocks/user.service.mock';
import { EditUser } from './model/edit-user.model';

describe('UserServiceService', () => {
  let service: UserService;
  let httpController: HttpTestingController;
  let url = 'http://localhost:9090/open-doors';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getUser and return appropriate EditUser', () => {
    const id = 1;

    service.getUser(id).subscribe((data) => {
      expect(data).toEqual(mockUser);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${url}/users/${id}`
    });

    req.flush(mockUser);
  });

  it('should call updateUser', () => {
    const updatedUser: EditUser = {
      id: 1,
      firstName: "Nino",
      lastName: "Lahife",
      country: "Germany",
      city: "Berlin",
      street: "Nikola Tesla Strasse",
      number: 2,
      phone: "987654321"
    }
    const formData: FormData = new FormData();
    formData.append('id', updatedUser.id.toString());
    formData.append('firstName', updatedUser.firstName);
    formData.append('lastName', updatedUser.lastName);
    formData.append('country', updatedUser.country);
    formData.append('city', updatedUser.city);
    formData.append('street', updatedUser.street);
    formData.append('number', updatedUser.number.toString());
    formData.append('phone', updatedUser.phone);

    service.updateUser(formData).subscribe((data => {
      expect(data).toEqual(updatedUser);
    }));

    const req = httpController.expectOne({
      method: 'PUT',
      url: `${url}/users`
    });

    req.flush(updatedUser);
  });

  it('should call register and the API should return the user that was added', () => {
    
    service.register(mockNewUser).subscribe((data) => {
      expect(data).toEqual(mockNewUser);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/auth/register`,
    });

    req.flush(mockNewUser);
  });
  
});
