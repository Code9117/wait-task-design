export type Locale = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    appTitle: 'Smart Task Manager',
    appSubtitle: 'AI Auto Sort · Real-time Status Flow',
    totalTasks: 'Total',
    addTask: 'Add Task',

    // Status
    statusWaits: 'Waiting',
    statusFail: 'Failed',
    statusDone: 'Done',

    // Priority
    priorityUrgent: 'Urgent',
    priorityMedium: 'Medium',
    priorityNormal: 'Normal',

    // Modal
    modalTitle: 'Add Task',
    taskName: 'Task Name',
    taskNamePlaceholder: 'Enter task name...',
    selectStatus: 'Select Status',
    aiSortHint: 'Priority will be auto-assigned by AI (Urgent / Medium / Normal)',
    aiSortLabel: 'AI Auto Sort:',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Mock data
    task1: 'Data Analysis Task',
    task2: 'Report Generation',
    task3: 'System Monitor Check',
    task4: 'User Feedback Handling',
    task5: 'Log Cleanup',
    task6: 'Database Backup',
    task7: 'API Call Failed',
    task8: 'File Upload Timeout',
  },
  zh: {
    // Header
    appTitle: '智能任务管理',
    appSubtitle: 'AI 自动排序 · 实时状态流转',
    totalTasks: '总任务',
    addTask: '新增任务',

    // Status
    statusWaits: '等待',
    statusFail: '失败',
    statusDone: '成功',

    // Priority
    priorityUrgent: '急',
    priorityMedium: '中',
    priorityNormal: '一般',

    // Modal
    modalTitle: '新增任务',
    taskName: '任务名称',
    taskNamePlaceholder: '请输入任务名称...',
    selectStatus: '选择状态',
    aiSortHint: '优先级将由 AI 根据任务内容自动分配（急/中/一般）',
    aiSortLabel: 'AI 自动排序:',
    cancel: '取消',
    confirm: '确认添加',

    // Mock data
    task1: '数据分析任务',
    task2: '报表生成',
    task3: '系统监控检查',
    task4: '用户反馈处理',
    task5: '日志清理',
    task6: '数据库备份',
    task7: '接口调用失败',
    task8: '文件上传超时',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
