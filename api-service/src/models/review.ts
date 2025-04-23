import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    id: string;
    rakiId: string;
    meetingId: string;
    userId: string;
    points: number;
    comment: string;

}

const reviewSchema: Schema<IReview> = new Schema({
    rakiId: { type: String, required: true},
    meetingId: { type: String, required: true},
    userId: { type: String, required: true},
    points: { type: Number, required: true},
    comment: { type: String, required: true},
});



export default mongoose.model<IReview>('Review', reviewSchema);
