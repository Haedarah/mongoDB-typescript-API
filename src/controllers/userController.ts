import { Request, Response } from 'express';
import Company1 from '../models/Company1';
import Company2 from '../models/Company2';
import Company3 from '../models/Company3';
import Company4 from '../models/Company4';

const companyModels: { [key: string]: any } = {
    'Company1': Company1,
    'Company2': Company2,
    'Company3': Company3,
    'Company4': Company4
};

export const getUserPoints = async (req: Request, res: Response): Promise<void> => {
    const { username, phone, email } = req.query;

    const companyKey = req.baseUrl.split('/')[1];
    const company = companyModels[companyKey];

    if (!company) {
        res.status(400).json({ error: 'Invalid company route' });
        return;
    }

    let query: any = {};

    if (username) query = { 'customers.username': username };
    else if (phone) query = { 'customers.phone': phone };
    else if (email) query = { 'customers.email': email };
    else { res.status(400).json({ error: 'Missing query parameter' }); return; }

    try {
        const result = await company.findOne(query, { 'customers.$': 1 });
        if (!result) { res.status(404).json({ error: 'User not found' }); return; }

        const customer = result.customers[0];
        if (customer) {
            const response = {
                name: customer.name,
                username: customer.username,
                email: customer.email,
                phone: customer.phone,
                points: customer.points
            };
            res.json(response);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTotalPoints = async (req: Request, res: Response): Promise<void> => {
    const { username, phone, email } = req.query;

    const companyKey = req.baseUrl.split('/')[1];
    const company = companyModels[companyKey];

    if (!company) {
        res.status(400).json({ error: 'Invalid company route' });
        return;
    }

    let query: any = {};

    if (username) query = { 'customers.username': username };
    else if (phone) query = { 'customers.phone': phone };
    else if (email) query = { 'customers.email': email };
    else { res.status(400).json({ error: 'Missing query parameter' }); return; }

    try {
        const result = await company.findOne(query, { 'customers.points.$': 1 });
        if (!result) { res.status(404).json({ error: 'User not found' }); return; }

        const customer = result.customers[0];
        if (!customer || !customer.points) {
            res.status(404).json({ error: 'Customer points not found' });
            return;
        }

        let totalPoints = 0;
        const currentDate = new Date();

        customer.points.forEach((point: any) => {
            const pointValue = parseFloat(point.points) || 0;
            if (pointValue >= 0) {
                if (currentDate <= point.expiry) {
                    totalPoints += pointValue;
                }
            }
            else {
                totalPoints += pointValue;
            }
            if (totalPoints < 0) totalPoints = 0;
        });

        res.json({ totalPoints });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateUserPoints = async (req: Request, res: Response): Promise<void> => {
    const { username, phone, email } = req.query;
    const companyKey = req.baseUrl.split('/')[1];
    const company = companyModels[companyKey];

    if (!company) {
        res.status(400).json({ error: 'Invalid company route' });
        return;
    }

    let query: any = {};
    if (username) query = { 'customers.username': username };
    else if (phone) query = { 'customers.phone': phone };
    else if (email) query = { 'customers.email': email };
    else {
        res.status(400).json({ error: 'Missing identifier (username, phone, or email)' });
        return;
    }

    const { points } = req.body;

    let newPoint = {};
    let transaction_id;

    if (points >= 0) transaction_id = "MONET-add_" + generateTxId();
    else transaction_id = "MONET-deduct_" + generateTxId();

    if (companyKey == "Company1") {
        newPoint = {
            points: String(points),
            issuance: new Date(),
            expiry: points >= 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null, //two weeks from now
            tx_id: transaction_id
        }
    }

    else if (companyKey == "Company2") {
        newPoint = {
            points: String(points),
            issued_on: new Date(),
            expiry: points >= 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
            tx_id: transaction_id
        }
    }

    else if (companyKey == "Company3") {
        newPoint = {
            points: String(points),
            issued: new Date(),
            expiry: points >= 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
            tx_id: transaction_id
        }
    }

    else if (companyKey == "Company4") {
        newPoint = {
            points: String(points),
            issuance: new Date(),
            expiry: points >= 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
            tx_id: transaction_id
        }
    }

    try {
        const updatedDoc = await company.findOneAndUpdate(
            query,
            { $push: { 'customers.$.points': newPoint } },
            { returnDocument: 'after' }
        );

        if (!updatedDoc) {
            res.status(404).json({ error: 'User not found or no update performed' });
        }
        else {
            const addedPoint = updatedDoc.customers[0].points.slice(-1)[0];
            res.status(200).json({
                message: 'Points updated successfully',
                tx_id: transaction_id,
                mongoID: addedPoint._id
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

function generateTxId(): string {
    const now = new Date();

    const year = now.getFullYear().toString(); // YYYY
    const month = String(now.getMonth() + 1).padStart(2, '0'); // MM 
    const day = String(now.getDate()).padStart(2, '0'); // DD 
    const hours = String(now.getHours()).padStart(2, '0'); // HH
    const minutes = String(now.getMinutes()).padStart(2, '0'); // MM 
    const seconds = String(now.getSeconds()).padStart(2, '0'); // SS 
    const milliseconds = String(now.getMilliseconds()).padStart(4, '0'); // MMMM 

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}
