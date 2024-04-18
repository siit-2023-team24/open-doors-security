import { Injectable } from "@angular/core";

@Injectable()
export class ImageServiceMock {
    constructor() {}

    getPath(id: number, isProfile: boolean): string {
        return "";
    }
}