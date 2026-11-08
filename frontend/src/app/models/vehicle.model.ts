export interface Vehicle {
    id?: number;
    plate: string;
    color: string;
    brand: string;
    model: string;
    year: number;
    description?: string;
    imageUrl?: string;
    currentMileage: number;
    status: 'Available' | 'Rented' | 'Maintenance';
    administratorId?: number; // Foreign Key
    administrator?: any; // Avoiding circular dependency or import detailed Admin interface
}
