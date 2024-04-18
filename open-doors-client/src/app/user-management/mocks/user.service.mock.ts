import { Injectable } from "@angular/core";
import { EditUser } from "../model/edit-user.model";
import { Observable, of } from "rxjs";
import { UserAccount } from "../model/user-account.model";

@Injectable()
export class UserServiceMock {
    constructor() {}

    getUser(id: number): Observable<EditUser> {
        return of(mockUser);
    }

    updateUser(formData: FormData): EditUser {
        return mockEditedUser;
    }

    register(user: UserAccount): UserAccount {
        return mockNewUser;
    }
}

export const mockUser: EditUser = {
    id: 1,
    firstName: "Adrien",
    lastName: "Agreste",
    country: "France",
    city: "Paris",
    street: "Rue de Belgrade",
    number: 1,
    phone: "123456789"
};

export const mockEditedUser: EditUser = {
    id: 1,
    firstName: "Nino",
    lastName: "Lahife",
    country: "Germany",
    city: "Berlin",
    street: "Nikola Tesla Strasse",
    number: 2,
    phone: "987654321"
}

export const mockNewUser: UserAccount = {
    id: 3,
    username : "vaske@test.test",
    password : "12345678",
    role : "ROLE_GUEST",
    firstName : "Sveta",
    lastName : "Ili Mileta",
    phone : "0615502212",
    street : "Zeleznicka",
    number : 4,
    city: "Novi Sad",
    country : "Serbia"
}


export const validationErrorMessage: String = 'Please fill out all the fields according to the validations.';

export const stringOfLength201: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget neque vel mi volutpat cursus. Vestibulum imperdiet mi et fringilla scelerisque. Sed rhoncus, quam vitae malesuada lobortis, quam ex fermentum quam, non interdum justo arcu vel elit. Integer ultrices tellus vel ultricies congue. Duis auctor, odio nec consectetur tincidunt, mauris sem venenatis purus, eget fermentum justo libero sit amet justo. Sed dapibus bibendum arcu, non scelerisque mi facilisis et. Nunc vel dolor non sem aliquam aliquet a eget urna. Integer vitae ligula id odio gravida efficitur. Vestibulum fermentum risus vitae risus cursus, eu ultrices arcu tristique. In quis varius metus.";

export const validForm = {
    country : 'Serbia',
    city : 'Novi Sad',
    street : 'Zeleznicka',
    role : "ROLE_GUEST",
    username : "vaske@test.test",
    password : "12345678",
    confirmPassword : "12345678",
    firstName : "Sveta",
    lastName : "Ili Mileta",
    number : 4,
    phone : "0615502212"
}

export const invalidForm = {
    country : '',
    city : 'Novi Sad',
    street : 'Zeleznicka',
    role : "ROLE_GUEST",
    username : "vaske@test.test",
    password : "12345678",
    confirmPassword : "12345678",
    firstName : "Sveta",
    lastName : "Ili Mileta",
    number : 4,
    phone : "0615502212"
}