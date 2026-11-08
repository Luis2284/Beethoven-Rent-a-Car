export interface Administrator {
    id?: number;
    name: string;
    document: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    licenseNumber?: string;
    documentUrl?: string; // New
}
