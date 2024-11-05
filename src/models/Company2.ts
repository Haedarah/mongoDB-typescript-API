import mongoose, { Schema, Document } from 'mongoose';

interface DeductionHistory {
    amount: string;
    ref_tx_id: string;
}

interface Points {
    points: string;
    issued_on: Date;
    expiry?: Date;
    current_points?: string;
    deduction_history?: DeductionHistory[];
    tx_id: string;
}

interface Customer {
    name: string;
    username: string;
    email: string;
    phone: string;
    points: Points[];
}

interface Company extends Document {
    company_id: string;
    company_category: string;
    company_name: string;
    customers: Customer[];
}

const deductionHistorySchema = new Schema<DeductionHistory>({
    amount: { type: String, required: true },
    ref_tx_id: { type: String, required: true }
});

const pointsSchema = new Schema<Points>({
    points: { type: String, required: true },
    issued_on: { type: Date, required: true },
    expiry: { type: Date },
    current_points: { type: String },
    deduction_history: [deductionHistorySchema],
    tx_id: { type: String, required: true }
});

const customerSchema = new Schema<Customer>({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    points: [pointsSchema]
});

const companySchema = new Schema<Company>({
    company_id: { type: String, required: true },
    company_category: { type: String, required: true },
    company_name: { type: String, required: true },
    customers: [customerSchema]
});

const Company2 = mongoose.model<Company>('Company2', companySchema, 'Company2');

export default Company2;
