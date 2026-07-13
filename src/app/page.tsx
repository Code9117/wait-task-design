'use client';

import { useState, useEffect } from 'react';
import { Task, statusConfigs, getPriorityByAI, TaskStatus, Priority } from '@/types/task';
import { mockTasks } from '@/data/mockTasks';
import { useI18n } from '@/i18n/I18nProvider';
import TaskColumn from '@/components/TaskColumn';
import AddTaskModal from '@/components/AddTaskModal';
import TaskResultModal from '@/components/TaskResultModal';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import OpenAI from 'openai';
import { initOpenAIClient, getOpenAIClient, SUPPORTED_MODELS, analyzeTaskPriority, executeTask, ModelConfig, DEFAULT_API_KEY, MAX_FREE_CALLS, getRemainingCalls, isFreeQuotaExceeded } from '@/service';

interface Settings {
  apiKey: string;
  model: string;
}

export default function Home() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    model: SUPPORTED_MODELS[0].id,
  });
  const [aiEnabled, setAiEnabled] = useState(!!DEFAULT_API_KEY);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedResultTask, setSelectedResultTask] = useState<Task | null>(null);
  const [remainingCalls, setRemainingCalls] = useState(MAX_FREE_CALLS);
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);

  useEffect(() => {
    if (DEFAULT_API_KEY && !getOpenAIClient()) {
      initOpenAIClient({
        apiKey: DEFAULT_API_KEY,
        model: SUPPORTED_MODELS[0].id,
      });
    }
    setRemainingCalls(getRemainingCalls());
  }, []);

  const handleViewResult = (task: Task) => {
    setSelectedResultTask(task);
    setIsResultModalOpen(true);
  };

  const handleSaveSettings = () => {
    const apiKeyToUse = settings.apiKey.trim() || DEFAULT_API_KEY;
    if (apiKeyToUse) {
      initOpenAIClient({
        apiKey: apiKeyToUse,
        model: settings.model,
      });
      setAiEnabled(true);
    } else {
      setAiEnabled(false);
    }
    setIsSettingsOpen(false);
  };

  const handleExecuteTask = async (task: Task) => {
    if (!aiEnabled) return;

    const client = getOpenAIClient();
    if (!client) return;

    if (!settings.apiKey.trim() && isFreeQuotaExceeded()) {
      setShowQuotaWarning(true);
      return;
    }

    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'inProgress' as TaskStatus } : t));

    try {
      const result = await executeTask(client, task.title);
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done' as TaskStatus, aiResult: result } : t));
      setRemainingCalls(getRemainingCalls());
    } catch {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'fail' as TaskStatus } : t));
    }
  };

  const handleAddTask = async (title: string, status: TaskStatus) => {
    let priority: Priority = getPriorityByAI();

    if (aiEnabled) {
      const client = getOpenAIClient();
      if (client) {
        try {
          if (!settings.apiKey.trim() && isFreeQuotaExceeded()) {
            setShowQuotaWarning(true);
            priority = getPriorityByAI();
          } else {
            priority = await analyzeTaskPriority(client, title);
            setRemainingCalls(getRemainingCalls());
          }
        } catch {
          priority = getPriorityByAI();
        }
      }
    }

    const shouldExecute = status === 'inProgress' || priority === 'urgent';
    const initialStatus = shouldExecute ? ('inProgress' as TaskStatus) : status;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: initialStatus,
      priority,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);

    if (shouldExecute && aiEnabled) {
      const client = getOpenAIClient();
      if (client) {
        try {
          if (!settings.apiKey.trim() && isFreeQuotaExceeded()) {
            setShowQuotaWarning(true);
            setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'waits' as TaskStatus } : t));
          } else {
            const result = await executeTask(client, title);
            setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'done' as TaskStatus, aiResult: result } : t));
            setRemainingCalls(getRemainingCalls());
          }
        } catch {
          setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'fail' as TaskStatus } : t));
        }
      }
    }
  };

  const handleUpdateTask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus: TaskStatus = task.status === 'fail' ? 'waits' : task.status;
        return { ...task, title, status: newStatus };
      }
      return task;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const checkTaskExists = (title: string, excludeId?: string) => {
    return tasks.some(task =>
      task.id !== excludeId &&
      (task.status === 'waits' || task.status === 'inProgress') &&
      task.title === title
    );
  };

  const getTasksByStatus = (status: TaskStatus) => {
    const priorityOrder = { urgent: 0, medium: 1, normal: 2 };
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('appTitle')}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <div className="text-sm text-gray-500 hidden sm:block">
                {t('totalTasks')}: <span className="font-semibold text-gray-800">{tasks.length}</span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">{t('settings')}</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">{t('addTask')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">✨ {t('heroTitle', { appTitle: t('appTitle') })}</h2>
              <p className="text-white/80 text-sm">{t('heroDescription')}</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium">{t('heroSmartSchedule')}</span>
              </div>
            </div>
          </div>
          {aiEnabled && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90">{t('aiEnabled')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {statusConfigs.map(config => (
            <TaskColumn
              key={config.key}
              config={config}
              tasks={getTasksByStatus(config.key)}
              onEdit={handleEditTask}
              onViewResult={handleViewResult}
              onExecute={handleExecuteTask}
            />
          ))}
        </div>
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        onCheckDuplicate={checkTaskExists}
        task={editingTask}
      />

      <TaskResultModal
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          setSelectedResultTask(null);
        }}
        task={selectedResultTask}
      />

      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSettingsOpen(false)}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all ${isSettingsOpen ? 'scale-100' : 'scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('settings')}</h2>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={e => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your DeepSeek API Key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('model')}</label>
              <select
                value={settings.model}
                onChange={e => setSettings(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent color-[#333333]"
              >
                {SUPPORTED_MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${showQuotaWarning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowQuotaWarning(false)}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all ${showQuotaWarning ? 'scale-100' : 'scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t('quotaExceeded')}</h2>
          </div>
          <p className="text-gray-600 mb-6">{t('quotaWarning')}</p>
          <button
            onClick={() => {
              setShowQuotaWarning(false);
              setIsSettingsOpen(true);
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {t('goToSettings')}
          </button>
        </div>
      </div>

      {!settings.apiKey.trim() && remainingCalls > 0 && (
        <div className="fixed bottom-24 right-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 text-sm text-gray-600">
          {t('remainingCalls', { count: remainingCalls.toString() })}
        </div>
      )}
    </div>
  );
}