import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakConfig } from "keycloak-js";
import { Observable, of } from "rxjs";

@Injectable({providedIn: 'root'})
export class KeycloakConfigService {
    private config: KeycloakConfig;

    constructor(private http: HttpClient) {
    }

    getConfig(): Observable<KeycloakConfig> {
        if (this.config) {
            return of(this.config);
        } else {
            const configObservable = this.http.get<KeycloakConfig>('/api/keycloak/config');
            configObservable.subscribe(config => this.config = config);
            return configObservable;
        }
    }
}