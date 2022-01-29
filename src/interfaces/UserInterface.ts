import { CollectionInterface } from './CollectionInterface';

export interface UserInterface {
  _id: number;
  name: string;
  password: string;
  email: string;
  role: string;
  twitter: string;
  portfolio: string;
  github: string;
  collections: Array<CollectionInterface>;
}
