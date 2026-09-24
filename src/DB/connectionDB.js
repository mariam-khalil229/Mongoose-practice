import mongoose from 'mongoose';

const connectionDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Assignment7DB');
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.log("Database connection failed:", error);
    }
};

export default connectionDB;