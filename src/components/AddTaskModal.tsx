'use client';

import { useState } from 'react';
import { getPriorityByAI, TaskStatus, statusConfigs } from '@/types/task';
import { useI18n } from '@/i18n/I18nProvider';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, status: TaskStatus) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('waits');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), status);
    setTitle('');
    setStatus('waits');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{t('modalTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('taskName')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('taskNamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectStatus')}</label>
            <div className="flex gap-3">
              {statusConfigs.map(config => (
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
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
