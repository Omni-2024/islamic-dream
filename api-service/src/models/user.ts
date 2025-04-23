import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    country:string;
    timezone:string;
    languages:[string],
    mobileNumber:string,
    yearOfExperience:number,
    description:string,
    firstTimeLogin:boolean,
    age:number,
    role: string;
    googleId:string
    password: string;
    status:string;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    isEmailVerified: boolean;
    profileImage: string;
    gender:string
}

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    role: { type: String, enum: ['super-admin', 'admin', 'user'], default: 'user' },
    country: { type: String },
    timezone: { type: String },
    languages: { type: [String] },
    status:{type:String},
    mobileNumber: { type: String },
    googleId:{type:String, sparse: true},
    age: { type: Number },
    firstTimeLogin:{type:Boolean},
    yearOfExperience: { type: Number },
    description: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    profileImage: { type: String },
    gender: { type: String ,default:"Male"},

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
