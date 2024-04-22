export interface CertificateTemplateDTO {
    ca : boolean,
    usage : number[],
    extendedUsages : number[],
    name : string,
    id : number
}