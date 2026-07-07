'use client';

import { useState, useEffect } from 'react';
import { getPriorityByAI, TaskStatus, addTaskStatusOptions, Task } from '@/types/task';
import { useI18n } from '@/i18n/I18nProvider';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, status: TaskStatus) => void;
  onUpdate: (taskId: string, title: string) => void;
  onCheckDuplicate: (title: string, excludeId?: string) => boolean;
  task?: Task | null;
}

export default function AddTaskModal({ isOpen, onClose, onAdd, onUpdate, onCheckDuplicate, task }: AddTaskModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('waits');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
    } else {
      setTitle('');
      setStatus('waits');
    }
    setError('');
  }, [task, isOpen]);

  const isEditMode = !!task;

  const handleSubmit = () => {
    setError('');
    if (!title.trim()) {
      setError(t('taskNameRequired'));
      return;
    }
    if (onCheckDuplicate(title.trim(), task?.id)) {
      setError(t('taskAlreadyExists'));
      return;
    }
    if (isEditMode && task) {
      onUpdate(task.id, title.trim());
    } else {
      onAdd(title.trim(), status);
    }
    setTitle('');
    setStatus('waits');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{isEditMode ? t('editTaskTitle') : t('modalTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">{t('taskName')}</label>
            <input
              style={{ color: '#333333' }}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder={t('taskNamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          {!isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectStatus')}</label>
                <div className="flex gap-3">
                  {addTaskStatusOptions.map(config => (
                    <button
                      key={config.key}
                      onClick={() => setStatus(config.key)}
                      className={`flex-1 py-3 rounded-lg border transition-all ${
                        status === config.key
                          ? `${config.borderColor} ${config.bgColor} ${config.color}`
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {t(config.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <span className="font-medium">{t('aiSortLabel')}</span>
                  <span>{t('aiSortHint')}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isEditMode ? t('save') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
