'use client';

import { Task, statusConfigs, priorityConfigs } from '@/types/task';
import { useI18n } from '@/i18n/I18nProvider';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { t } = useI18n();
  const statusConfig = statusConfigs.find(s => s.key === task.status)!;
  const priorityConfig = priorityConfigs.find(p => p.key === task.priority)!;

  const canEdit = task.status === 'waits' || task.status === 'fail';

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 mb-3 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {t(statusConfig.labelKey)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.badgeColor} ${priorityConfig.color}`}>
              {t(priorityConfig.labelKey)}
            </span>
          </div>
          <p className="text-gray-800 font-medium">{task.title}</p>
        </div>
        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
            title={t('edit')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
