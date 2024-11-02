import express from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Step1: Connect to COMPANIES database
connectDB();

//Step2: a middleware funciton in Express to automatically parse incoming jsons
app.use(express.json());

//Step3: Define routes:
app.use(
    '/Company1/api',
    authMiddleware(process.env.API_KEY_COMPANY1 as string),
    userRoutes
);
app.use(
    '/Company2/api',
    authMiddleware(process.env.API_KEY_COMPANY2 as string),
    userRoutes
);
app.use(
    '/Company3/api',
    authMiddleware(process.env.API_KEY_COMPANY3 as string),
    userRoutes
);
app.use(
    '/Company4/api',
    authMiddleware(process.env.API_KEY_COMPANY4 as string),
    userRoutes
);

//Step4: Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
