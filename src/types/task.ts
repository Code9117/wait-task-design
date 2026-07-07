export type TaskStatus = 'waits' | 'inProgress' | 'fail' | 'done';

export type Priority = 'urgent' | 'medium' | 'normal';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: Date;
}

export interface StatusConfig {
  key: TaskStatus;
  labelKey: 'statusWaits' | 'statusInProgress' | 'statusFail' | 'statusDone' | 'statusExecuteNow';
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

export const statusConfigs: StatusConfig[] = [
  { key: 'waits', labelKey: 'statusWaits', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', dotColor: 'bg-green-500' },
  { key: 'inProgress', labelKey: 'statusInProgress', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500' },
  { key: 'fail', labelKey: 'statusFail', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', dotColor: 'bg-red-500' },
  { key: 'done', labelKey: 'statusDone', color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', dotColor: 'bg-gray-400' },
];

export const addTaskStatusOptions: StatusConfig[] = [
  { key: 'waits', labelKey: 'statusWaits', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', dotColor: 'bg-green-500' },
  { key: 'inProgress', labelKey: 'statusExecuteNow', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500' },
];

export interface PriorityConfig {
  key: Priority;
  labelKey: 'priorityUrgent' | 'priorityMedium' | 'priorityNormal';
  color: string;
  badgeColor: string;
}

export const priorityConfigs: PriorityConfig[] = [
  { key: 'urgent', labelKey: 'priorityUrgent', color: 'text-red-600', badgeColor: 'bg-red-100' },
  { key: 'medium', labelKey: 'priorityMedium', color: 'text-yellow-600', badgeColor: 'bg-yellow-100' },
  { key: 'normal', labelKey: 'priorityNormal', color: 'text-gray-500', badgeColor: 'bg-gray-100' },
];

export const getPriorityByAI = (): Priority => {
  const rand = Math.random();
  if (rand < 0.3) return 'urgent';
  if (rand < 0.6) return 'medium';
  return 'normal';
};