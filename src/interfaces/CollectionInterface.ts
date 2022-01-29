import { ItemInterface } from './ItemInterface';
export interface CollectionInterface {
  userId: string;
  title: string;
  author: string;
  description: string;
  tags?: Array<string> | null;
  items?: Array<ItemInterface> | null;
  likes: number;
  isPrivate: boolean;
  datePublished: Date;
  _id: string;
  id: string;
}
