import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    id: string;
    name: string;
    language: string;
}

const courseSchema: Schema<ICourse> = new Schema({
    name: { type: String, required: true ,unique:true},
    language: { type: String, required: true},
});



export default mongoose.model<ICourse>('Course', courseSchema);
