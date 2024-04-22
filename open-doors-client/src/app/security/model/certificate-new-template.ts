export interface CertificateNewTemplateDTO {
    ca : boolean,
    usage : number[],
    extendedUsages : number[],
    name : string,
    id? : number
}