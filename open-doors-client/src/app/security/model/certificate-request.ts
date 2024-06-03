export interface CertificateRequestDTO {
    userId: string,
    timestamp: Date,
    pending: boolean,
    issuerAlias: string
}