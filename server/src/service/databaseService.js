import mongoose from 'mongoose';
import config from '../config/config.js';
import userModel from '../model/userModel.js';
import workerModel from '../model/workerModel.js';
import projectModel from '../model/projectModel.js';

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
    },
    addWorker: (payload) => {
        return workerModel.create(payload);
    },
    getWorkersByOwner: (ownerId) => {
        return workerModel.find({ ownerId, isActive: true });
    },
    
    getWorkerById: (id) => {
        return workerModel.findById(id);
    },
    
    updateWorker: (id, payload) => {
        return workerModel.findByIdAndUpdate(id, payload, { new: true });
    },
    
    deleteWorker: (id) => {
        return workerModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    },
    createProject: (payload) => {
        return projectModel.create(payload);
    },
    getAllProjects: (ownerId) => {
        return projectModel.find({ ownerId })
    },
    projectDetails: (id) => {
        return projectModel.findById(id)
    },
    deleteProject: (id, ownerId) => {
        return projectModel.findOneAndUpdate(
            { _id: id, ownerId: ownerId },
            { $set: { status: false } },
            { new: true }
        );
    },
    
};
