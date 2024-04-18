import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { }


  getPath(id: number | undefined, isProfile: boolean): string {
    if (!id) {
      id = -1;
    }
    return environment.apiHost + '/image/' + id + '/profile/' + isProfile;
  }

}
