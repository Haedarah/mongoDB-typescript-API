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
        if (customer && customer.points) {
            const validPointsArray = customer.points
                .filter((point: any) => new Date(point.expiry) > new Date() && parseFloat(point.current_points) > 0)
                .map((point: any) => ({ points: point.current_points, valid_until: point.expiry }));

            const response = {
                total_points: calculateTotalPoints(customer.points),
                points: validPointsArray
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

        const totalPoints = calculateTotalPoints(customer.points);

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

    const { points, expiry } = req.body;

    let newPoint: any = {};
    let transaction_id;

    if (points >= 0) {
        transaction_id = "MONET-add_" + generateTxId();

        if (companyKey == "Company1" || companyKey == "Company4") { //Company1 and Company4 have the exact same point schema.
            newPoint = {
                points: String(points),
                issuance: new Date(),
                expiry: points >= 0 ? new Date(expiry) : null,
                current_points: String(points),
                tx_id: transaction_id
            }
        }

        else if (companyKey == "Company2") {
            newPoint = {
                points: String(points),
                issued_on: new Date(),
                expiry: points >= 0 ? new Date(expiry) : null,
                current_points: String(points),
                tx_id: transaction_id
            }
        }

        else if (companyKey == "Company3") {
            newPoint = {
                points: String(points),
                issued: new Date(),
                expiry: points >= 0 ? new Date(expiry) : null,
                current_points: String(points),
                tx_id: transaction_id
            }
        }

    }
    else {
        transaction_id = "MONET-deduct_" + generateTxId();

        newPoint = {
            points: String(points),
            issued: new Date(),
            tx_id: transaction_id
        };

        let remainingDeduction = Math.abs(points);

        const user = await company.findOne(query, { 'customers.$': 1 });

        if (!user || !user.customers || user.customers.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const customer = user.customers[0];
        const currentDate = new Date();

        let totalAvailablePoints = calculateTotalPoints(customer.points);

        if (remainingDeduction > totalAvailablePoints) {
            res.status(400).json({ error: 'Insufficient points for deduction' });
            return;
        }

        for (const pointEntry of customer.points) {
            if (currentDate > pointEntry.expiry) continue;

            const availablePoints = parseFloat(pointEntry.current_points) || 0;

            if (remainingDeduction <= availablePoints) {
                pointEntry.current_points = (availablePoints - remainingDeduction).toString();

                pointEntry.deduction_history = pointEntry.deduction_history || [];
                pointEntry.deduction_history.push({
                    amount: remainingDeduction.toString(),
                    ref_tx_id: transaction_id
                });
                await company.updateOne(query, { 'customers.$.points': customer.points });
                break;
            }
            else {
                remainingDeduction -= availablePoints;
                pointEntry.current_points = "0";

                pointEntry.deduction_history = pointEntry.deduction_history || [];
                pointEntry.deduction_history.push({
                    amount: availablePoints.toString(),
                    ref_tx_id: transaction_id
                });
                await company.updateOne(query, { 'customers.$.points': customer.points });
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
                    id: addedPoint._id
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    };

}

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

const calculateTotalPoints = (pointsArray: any[]): number => {
    let totalPoints = 0;
    const currentDate = new Date();

    pointsArray.forEach((point: any) => {
        const pointValue = parseFloat(point.current_points) || 0;
        if (pointValue >= 0 && currentDate <= point.expiry) {
            totalPoints += pointValue;
        }
    });

    return totalPoints;
};