import { Extensions } from "./extensions";

export interface CertificateDTO {
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
    serialNumber: string,
    subjectPublicKey: string,
    valid?: boolean,
    revoked?: boolean
}