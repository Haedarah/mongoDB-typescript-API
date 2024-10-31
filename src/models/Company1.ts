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

const Company1 = mongoose.model('Company1', companySchema, "Company1");

export default Company1;
