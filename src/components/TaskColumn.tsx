'use client';

import { Task, StatusConfig } from '@/types/task';
import { useI18n } from '@/i18n/I18nProvider';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  config: StatusConfig;
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function TaskColumn({ config, tasks, onStatusChange }: TaskColumnProps) {
  const { t } = useI18n();

  return (
    <div className={`${config.bgColor} rounded-xl border ${config.borderColor} p-4 flex-1 min-w-[280px]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.dotColor}`} />
          <h3 className={`font-semibold ${config.color}`}>{t(config.labelKey)}</h3>
          <span className="text-gray-400 text-sm bg-white px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}
