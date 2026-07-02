import { Task } from '@/types/task';

export const mockTasks: Task[] = [
  { id: '1', title: '数据分析任务', status: 'waits', priority: 'urgent', createdAt: new Date('2026-07-01T10:00:00') },
  { id: '2', title: '报表生成', status: 'waits', priority: 'medium', createdAt: new Date('2026-07-01T11:00:00') },
  { id: '3', title: '系统监控检查', status: 'waits', priority: 'normal', createdAt: new Date('2026-07-01T12:00:00') },
  { id: '4', title: '用户反馈处理', status: 'done', priority: 'medium', createdAt: new Date('2026-07-01T09:00:00') },
  { id: '5', title: '日志清理', status: 'done', priority: 'normal', createdAt: new Date('2026-07-01T08:00:00') },
  { id: '6', title: '数据库备份', status: 'done', priority: 'urgent', createdAt: new Date('2026-07-01T07:00:00') },
  { id: '7', title: '接口调用失败', status: 'fail', priority: 'urgent', createdAt: new Date('2026-07-01T13:00:00') },
  { id: '8', title: '文件上传超时', status: 'fail', priority: 'medium', createdAt: new Date('2026-07-01T14:00:00') },
];