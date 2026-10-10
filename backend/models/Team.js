import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['Owner', 'Administrator', 'Editor', 'Author', 'Subscriber'], default: 'Editor' },
    status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Pending' },
    invitedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Team', teamSchema);
