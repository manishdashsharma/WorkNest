import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    githubLink: { 
        type: String, 
        required: true 
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
},{timestamps:true})

export default mongoose.model('Worker', workerSchema);