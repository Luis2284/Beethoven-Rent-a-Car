export interface Client {
    id: number;
    name: string;
    document: string;
    phone: string;
    email: string;
    address?: string; // Made optional to avoid strict errors if backend sends null
    city?: string;
    representativeName?: string;
    representativeDocument?: string;
    licenseNumber?: string;
    documentUrl?: string; // New
    licenseUrl?: string; // New
}
