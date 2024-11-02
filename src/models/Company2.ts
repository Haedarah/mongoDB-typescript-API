import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
    name: String,
    username: String,
    email: String,
    phone: String,
    points: [{
        points: String,
        issued_on: { type: Date },
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

const Company2 = mongoose.model('Company2', companySchema, "Company2");

export default Company2;
