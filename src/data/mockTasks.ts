import { Task } from '@/types/task';

export const mockTasks: Task[] = [
  { id: '1', title: 'task1', status: 'waits', priority: 'urgent', createdAt: new Date('2026-07-01T10:00:00') },
  { id: '2', title: 'task2', status: 'waits', priority: 'medium', createdAt: new Date('2026-07-01T11:00:00') },
  { id: '3', title: 'task3', status: 'waits', priority: 'normal', createdAt: new Date('2026-07-01T12:00:00') },
  { id: '9', title: 'task9', status: 'inProgress', priority: 'urgent', createdAt: new Date('2026-07-01T15:00:00') },
  { id: '10', title: 'task10', status: 'inProgress', priority: 'medium', createdAt: new Date('2026-07-01T16:00:00') },
  { id: '4', title: 'task4', status: 'done', priority: 'medium', createdAt: new Date('2026-07-01T09:00:00') },
  { id: '5', title: 'task5', status: 'done', priority: 'normal', createdAt: new Date('2026-07-01T08:00:00') },
  { id: '6', title: 'task6', status: 'done', priority: 'urgent', createdAt: new Date('2026-07-01T07:00:00') },
  { id: '7', title: 'task7', status: 'fail', priority: 'urgent', createdAt: new Date('2026-07-01T13:00:00') },
  { id: '8', title: 'task8', status: 'fail', priority: 'medium', createdAt: new Date('2026-07-01T14:00:00') },
];
