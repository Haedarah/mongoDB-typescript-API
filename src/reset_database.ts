import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs'; //to read json files
import path from 'path';

dotenv.config();

// const dbUri = process.env.MONGODB_URI || ''; //local
const dbUri = process.env.MONGO_URI || ''; //atlas

const collections = ['Company1', 'Company2', 'Company3', 'Company4'];
const defaultDataFolder = path.join(__dirname, '../default_companies'); //To get the default_companies directory, please reach out to me.

async function resetDatabase() {
    try {
        await mongoose.connect(dbUri);
        console.log('Connected to the COMPANIES database.');

        const collections = await mongoose.connection.listCollections();


        for (const collectionName of collections) {

            const colName = collectionName.name;
            const filePath = path.join(defaultDataFolder, `${colName}.json`); //creates the path to a default database collection.

            if ((await (mongoose.connection.listCollections()))) {
                await mongoose.connection.dropCollection(colName); //drop the current collection
                console.log(`Dropped existing collection: ${colName}`);
            }

            const rawData = fs.readFileSync(filePath, 'utf-8'); //read the data from the file
            const defaultData = JSON.parse(rawData); //parse the json data into a javascript object 

            await mongoose.connection.collection(colName).insertMany(defaultData);//insert the default collection
            console.log(`Inserted default data for collection: ${colName}`);
        }
        console.log('Database reset complete.');
    } catch (error) {
        console.error('Error resetting the database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from the database.');
    }
}

resetDatabase();
