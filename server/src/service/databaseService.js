import mongoose from 'mongoose';
import config from '../config/config.js';
import userModel from '../model/userModel.js';

export default {
    connect: async () => {
        try {
            await mongoose.connect(config.DATABASE_URL);
            return mongoose.connection;
        } catch (err) {
            throw err;
        }
    },
    user: (payload) => {
        return userModel.create(payload)
    },
    getUserByEmail: (email) => {
        return userModel.findOne({ email });
    },
    updateOTPUserByEmail: (email, payload) => {
        return userModel.updateOne(
            { email }, 
            payload,
            { upsert: true, new: true }
        );
    },
    getUserById: (id) => {
        return userModel.findById(id);
    }
};
