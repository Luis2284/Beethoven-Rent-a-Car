import { Client } from "./client.model";
import { Vehicle } from "./vehicle.model";

export interface Rental {
    id?: number;
    vehicleId: number;
    vehicle?: Vehicle;
    clientId: number;
    client?: Client;
    startDate: string; // ISO Date
    endDate: string;   // ISO Date
    initialMileage: number;
    finalMileage?: number;
    dailyRate: number;
    totalCost?: number;
    guaranteeAmount: number;
    contractCity?: string;
    contractHtml?: string;
    signedContractUrl?: string;
    status: 'Active' | 'Completed';
}
