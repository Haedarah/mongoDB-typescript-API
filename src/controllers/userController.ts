import { Request, Response } from 'express';
import Company1 from '../models/Company1';

export const getUserPoints = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, phone, email } = req.query;

        const customers = await Company1.findOne({
            "customers": {
                $elemMatch: {
                    ...(username && { username }),
                    ...(phone && { phone }),
                    ...(email && { email }),
                }
            }
        });

        // console.log(customers)

        // to query phone number, use this: %2B instead of '+' in the url.
        // example: http://localhost:3000/api/users/points?phone=%2B911231231231 instead of http://localhost:3000/api/users/points?phone=+911231231231

        if (!customers) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const customer = customers.customers.find(
            (c) => c.username === username || c.phone === phone || c.email === email
        );

        if (customer) {
            res.json(customer.points);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
