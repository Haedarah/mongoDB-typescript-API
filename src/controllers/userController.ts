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

        res.json({ totalPoints }); // Return the total points in the response
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

