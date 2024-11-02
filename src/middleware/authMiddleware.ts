import { Request, Response, NextFunction } from 'express';

const authMiddleware = (companyKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const apiKey = req.headers['api-key'] as string;
        if (apiKey === companyKey) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: Invalid API key' });
        }
    };
};

export default authMiddleware;
