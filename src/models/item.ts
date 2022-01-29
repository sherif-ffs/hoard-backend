import { Schema, model } from 'mongoose';
import { ItemInterface } from '../interfaces/ItemInterface';

const itemSchema = new Schema<ItemInterface>({
  author: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  collections: {
    type: [],
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [],
    required: false,
  },
  likes: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  imageID: {
    type: String,
    required: false,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  datePublished: {
    type: Date,
    required: true,
  },
});

export default model('Item', itemSchema);
