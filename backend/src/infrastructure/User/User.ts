import mongoose from 'mongoose';
import userSchema from './UserSchema';

export default mongoose.model('User', userSchema, 'users');