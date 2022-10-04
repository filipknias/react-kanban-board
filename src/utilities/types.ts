import type { Timestamp } from 'firebase/firestore';

export interface Board {
  id: string;
  name: string;
  createdAt: Timestamp;
}