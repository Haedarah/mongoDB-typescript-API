import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//connects the mongoDB database
const connectDB = async () => {
    try {
        //await mongoose.connect(process.env.MONGODB_URI || ''); //For local Database
        await mongoose.connect(process.env.MONGO_URI || ''); //For Atlas Database
        console.log('Atlas MongoDB connected');
    } catch (error) {
        console.error('Atlas MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
