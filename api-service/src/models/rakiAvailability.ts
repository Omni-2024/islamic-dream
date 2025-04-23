import mongoose, { Schema, Document } from 'mongoose';

export interface IRakiAvailability extends Document {
    rakiId: string;
    startTime: string;
    isAvailable: boolean;
}

const rakiAvailabilitySchema: Schema<IRakiAvailability> = new Schema({
    rakiId: { type: String, required: true },
    startTime: { type: String, required: true },
    isAvailable: { type: Boolean, required: true}
});



export default mongoose.model<IRakiAvailability>('RakiAvailability', rakiAvailabilitySchema);
