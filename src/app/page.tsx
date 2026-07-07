'use client';

import { useState } from 'react';
import { Task, statusConfigs, getPriorityByAI, TaskStatus } from '@/types/task';
import { mockTasks } from '@/data/mockTasks';
import { useI18n } from '@/i18n/I18nProvider';
import TaskColumn from '@/components/TaskColumn';
import AddTaskModal from '@/components/AddTaskModal';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function Home() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (title: string, status: TaskStatus) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status,
      priority: getPriorityByAI(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, title } : task
    ));
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('appTitle')}</h1>
              <p className="text-sm text-gray-500">{t('appSubtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <div className="text-sm text-gray-500 hidden sm:block">
                {t('totalTasks')}: <span className="font-semibold text-gray-800">{tasks.length}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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
        <div className="flex flex-col md:flex-row gap-6">
          {statusConfigs.map(config => (
            <TaskColumn
              key={config.key}
              config={config}
              tasks={getTasksByStatus(config.key)}
              onEdit={handleEditTask}
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
    </div>
  );
}
