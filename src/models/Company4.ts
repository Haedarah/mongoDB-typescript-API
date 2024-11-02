import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
    name: String,
    username: String,
    email: String,
    phone: String,
    points: [{
        points: String,
        issuance: { type: Date },
        expiry: { type: Date },
        tx_id: String
    }]
});

const companySchema = new Schema({
    company_id: String,
    company_category: String,
    company_name: String,
    customers: [customerSchema]
});

const Company4 = mongoose.model('Company4', companySchema, "Company4");

export default Company4;
