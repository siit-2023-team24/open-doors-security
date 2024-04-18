import { Injectable } from "@angular/core";

@Injectable()
export class AuthServiceMock {
    constructor() {}

    getId(): number {
        return 1;
    }
}