import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';

const userSchema = new Schema<UserInterface>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  portfolio: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  collections: {
    type: [],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const user = model('User', userSchema);
export default user;
