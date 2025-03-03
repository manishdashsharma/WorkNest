import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  otp: { 
    type: String, 
    required: true,
    default: ''
},
expiresAt: { 
    type: Date, 
    required: true,
    default: '' 
},
},{timestamps: true});

export default mongoose.model('User', userSchema);
