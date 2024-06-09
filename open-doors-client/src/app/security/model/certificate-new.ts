import { Extensions } from "./extensions";

export interface CertificateNewDTO {
    alias: string,
    commonName: string,
    organization: string,
    organizationalUnit: string,
    locality: string,
    state: string,
    country: string,
    email: string,
    extensions: Extensions,
    startDate: Date,
    expirationDate: Date,
    issuerAlias: string,
}