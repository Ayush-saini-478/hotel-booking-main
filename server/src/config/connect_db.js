import mongoose from 'mongoose';
import { MONGODB_URI } from './server_config.js';

const connectDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
            .then(() => console.log("DB connected successfully"));
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
};

export default connectDb;