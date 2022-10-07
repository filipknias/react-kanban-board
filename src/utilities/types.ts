import type { Timestamp } from 'firebase/firestore';

export interface Board {
  id: string;
  userId: string;
  name: string;
  createdAt: Timestamp;
}

export interface Column {
  id: string;
  boardId: string;
  userId: string;
  name: string;
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  columnId: string;
  userId: string;
  name: string;
  description: string|null;
  subtasks: Subtask[];
  createdAt: Timestamp;
}

export interface Subtask {
  idx: number;
  name: string;
  done: boolean;
}

export type SubmitAction = "create" | "update";