import mongoose, { Schema, Document } from 'mongoose';



export enum MeetingStatus {
    SCHEDULED = 'scheduled',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    PENDING='pending'
}

export interface IMeeting extends Document {
    id: string;
    meetingId: string;
    topic: string;
    date:string;
    rakiId:string;
    userId:string,
    notificationSend:boolean,
    status:string,
    isPaid:boolean,
    requestedAt:Date,
    note:string
}

const meetingSchema: Schema<IMeeting> = new Schema({
    meetingId: { type: String, required: true },
    topic: { type: String, required: true },
    date:{type:String,required:true},
    rakiId: { type: String, required: true },
    userId: { type: String },
    notificationSend:{type:Boolean},
    status:{type:String,default:MeetingStatus.SCHEDULED},
    isPaid:{type:Boolean, default: false},
    requestedAt:{type:Date},
    note:{type:String}
});



export default mongoose.model<IMeeting>('Meeting', meetingSchema);
