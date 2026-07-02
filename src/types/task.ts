export type TaskStatus = 'waits' | 'done' | 'fail';

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
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const statusConfigs: StatusConfig[] = [
  { key: 'waits', label: '等待', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { key: 'fail', label: '失败', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { key: 'done', label: '成功', color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
];

export const priorityConfigs: { key: Priority; label: string; color: string; badgeColor: string }[] = [
  { key: 'urgent', label: '急', color: 'text-red-600', badgeColor: 'bg-red-100' },
  { key: 'medium', label: '中', color: 'text-yellow-600', badgeColor: 'bg-yellow-100' },
  { key: 'normal', label: '一般', color: 'text-gray-500', badgeColor: 'bg-gray-100' },
];

export const getPriorityByAI = (): Priority => {
  const rand = Math.random();
  if (rand < 0.3) return 'urgent';
  if (rand < 0.6) return 'medium';
  return 'normal';
};