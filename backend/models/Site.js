import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true },
    customDomain: { type: String, default: '' },
    theme: { type: String, default: 'standard/Y1_a_1_Column_Layout' },
    htmlContent: { type: String, default: '' },
    jsonData: { type: Object, default: {} },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    visitors: { type: Number, default: 0 },
    sslActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Site', siteSchema);
