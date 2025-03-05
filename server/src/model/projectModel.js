import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalBudget: { type: Number, required: true },
    totalSpending: { type: Number, default: 0 }, 
    totalSpent: { type: Number, default: 0 }, 
    projectAdvance: { type: Number, default: 0 },
    
    remainingFromClient: { 
        type: Number, 
        default: function() { return this.totalBudget - this.projectAdvance; } 
    },
    remainingAfterSpending: { 
        type: Number, 
        default: function() { return this.totalBudget - this.totalSpending; }
    },
    cashOnHand: { 
        type: Number, 
        default: function() { return this.projectAdvance - this.totalSpent; }
    },
    
    advancePaymentStatus: { type: Boolean, default: function() { return this.projectAdvance > 0; } },
    fullPaymentDone: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    
    workers: [{
        workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
        totalPayment: { type: Number, required: true }, 
        advanceGiven: { type: Number, default: 0 },
        remainingPayment: { 
            type: Number, 
            default: function() { return this.totalPayment - this.advanceGiven; } 
        }
    }],
    
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
