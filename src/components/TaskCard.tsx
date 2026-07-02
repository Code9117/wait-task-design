import { Task, statusConfigs, priorityConfigs } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const statusConfig = statusConfigs.find(s => s.key === task.status)!;
  const priorityConfig = priorityConfigs.find(p => p.key === task.priority)!;
  const otherStatuses = statusConfigs.filter(s => s.key !== task.status);

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 mb-3 transition-all hover:shadow-md cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.badgeColor} ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
          <p className="text-gray-800 font-medium">{task.title}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {otherStatuses.map(status => (
          <button
            key={status.key}
            onClick={() => onStatusChange(task.id, status.key)}
            className={`text-xs px-3 py-1 rounded-full border ${status.borderColor} ${status.color} hover:${status.bgColor} transition-colors`}
          >
            → {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}