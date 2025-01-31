import { Option } from './option';

export interface Poll {
  id: string;
  title: string;
  createdAt: Date;
  options: Option[];
}
