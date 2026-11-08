export interface Expense {
    id?: number;
    vehicleId: number;
    date: Date;
    type: string;
    amount: number;
    description: string;
}
