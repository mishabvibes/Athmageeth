import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate {
    name: string;
    isLeader: boolean;
}

export interface IRegistration extends Document {
    institutionName: string;
    place: string;
    district: string;
    candidates: ICandidate[];
    whatsappNumber: string;
    unionOfficialNumber: string;
    principalName: string;
    principalPhone: string;
    receiptUrl?: string;
    paymentStatus?: 'pending' | 'verified' | 'rejected';
    createdAt: Date;
}

const CandidateSchema = new Schema({
    name: { type: String, required: true, trim: true },
    isLeader: { type: Boolean, default: false }
});

const RegistrationSchema: Schema = new Schema<IRegistration>(
    {
        institutionName: {
            type: String,
            required: [true, 'Name of Institution is required'],
            trim: true,
            index: true,
        },
        place: {
            type: String,
            required: [true, 'Place is required'],
            trim: true,
        },
        district: {
            type: String,
            required: [true, 'District is required'],
            trim: true,
            index: true,
        },
        candidates: {
            type: [CandidateSchema],
            required: [true, 'Candidates are required'],
            validate: [
                (val: ICandidate[]) => val.length > 0,
                'At least one candidate is required'
            ]
        },
        whatsappNumber: {
            type: String,
            required: [true, 'WhatsApp number is required'],
            unique: true,
            trim: true,
            index: true,
        },
        unionOfficialNumber: {
            type: String,
            required: [true, 'Union Official Phone number is required'],
            trim: true,
        },
        principalName: {
            type: String,
            required: [true, 'Name of Principal is required'],
            trim: true,
        },
        principalPhone: {
            type: String,
            required: [true, 'Phone number of Principal is required'],
            trim: true,
        },
        receiptUrl: {
            type: String,
            // required: [true, 'Payment receipt is required'], // Make optional initially for backward comp if needed, but form enforces it
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation error in development
const Registration: Model<IRegistration> =
    mongoose.models.Registration ||
    mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;
