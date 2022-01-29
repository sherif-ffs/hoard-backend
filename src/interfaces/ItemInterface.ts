import { CollectionInterface } from './CollectionInterface';

export interface ItemInterface {
  _id: string;
  author: string;
  name: string;
  description: string;
  userId: string;
  collectionIds: Array<string> | null;
  collectionTitles: Array<string> | null;
  url: string;
  image?: string | null;
  imageID: string | null;
  collections: Array<CollectionInterface> | null;
  tags?: Array<string> | null;
  likes: number;
  isPrivate: boolean;
  datePublished: Date;
}
