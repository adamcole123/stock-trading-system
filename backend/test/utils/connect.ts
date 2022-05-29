import User from '../../src/infrastructure/User/User';
import mongoose from 'mongoose';
import config from './config';

export async function connect () {
	console.log('connect');
}

export function disconnect () {
	mongoose.disconnect();
}