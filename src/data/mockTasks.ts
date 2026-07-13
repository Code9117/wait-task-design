import { Task } from '@/types/task';

export const mockTasks: Task[] = [
  { id: '1', title: 'task1', status: 'waits', priority: 'urgent', createdAt: new Date('2026-07-01T10:00:00') },
  { id: '2', title: 'task2', status: 'waits', priority: 'medium', createdAt: new Date('2026-07-01T11:00:00') },
  { id: '3', title: 'task3', status: 'waits', priority: 'normal', createdAt: new Date('2026-07-01T12:00:00') },
  { id: '9', title: 'task9', status: 'inProgress', priority: 'urgent', createdAt: new Date('2026-07-01T15:00:00') },
  { id: '10', title: 'task10', status: 'inProgress', priority: 'medium', createdAt: new Date('2026-07-01T16:00:00') },
  { id: '4', title: 'task4', status: 'done', priority: 'medium', createdAt: new Date('2026-07-01T09:00:00'), aiResult: '已成功处理全部用户反馈，共收到 15 条反馈，其中 12 条已解决，3 条已记录待后续版本优化。客户满意度提升 18%。' },
  { id: '5', title: 'task5', status: 'done', priority: 'normal', createdAt: new Date('2026-07-01T08:00:00'), aiResult: '日志清理任务已完成。共清理了 2.3GB 的旧日志文件，系统性能提升约 12%。建议设置定期自动清理计划。' },
  { id: '6', title: 'task6', status: 'done', priority: 'urgent', createdAt: new Date('2026-07-01T07:00:00'), aiResult: '数据库备份任务已成功执行。备份文件大小为 8.5GB，已上传至云端存储，备份时间点为 02:00:00。验证通过，数据完整性良好。' },
  { id: '7', title: 'task7', status: 'fail', priority: 'urgent', createdAt: new Date('2026-07-01T13:00:00') },
  { id: '8', title: 'task8', status: 'fail', priority: 'medium', createdAt: new Date('2026-07-01T14:00:00') },
];
