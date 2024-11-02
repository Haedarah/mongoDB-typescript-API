import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
    name: String,
    username: String,
    email: String,
    phone: String,
    points: [{
        points: String,
        issued: { type: Date },
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

const Company3 = mongoose.model('Company3', companySchema, "Company3");

export default Company3;