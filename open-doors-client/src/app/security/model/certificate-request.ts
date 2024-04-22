export interface CertificateRequestDTO {
    userId: number,
    timestamp: Date,
    pending: boolean,
    issuerAlias: string
}