export type Locale = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    appTitle: 'Love in Tasks',
    appSubtitle: 'Night Execution · Morning Result',
    totalTasks: 'Total',
    addTask: 'Add Task',
    settings: 'Settings',
    model: 'Model',
    aiEnabled: 'AI Enabled',

    // Hero
    heroTitle: '{appTitle} - Night Smart Execution',
    heroDescription: 'No need to wait after creating tasks. AI Agent executes automatically at night, and you can view results and status in the early morning. Make the most of late-night low-traffic hours and enjoy more favorable model service prices.',
    heroSmartSchedule: 'Smart Scheduling',

    // Status
    statusWaits: 'Waiting',
    statusInProgress: 'In Progress',
    statusExecuteNow: 'Execute Now',
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
    save: 'Save',
    edit: 'Edit',
    editTaskTitle: 'Edit Task',
    taskNameRequired: 'Please enter task name',
    taskAlreadyExists: 'Task already exists, please create another task',

    // Mock data
    task1: 'Data Analysis Task',
    task2: 'Report Generation',
    task3: 'System Monitor Check',
    task4: 'User Feedback Handling',
    task5: 'Log Cleanup',
    task6: 'Database Backup',
    task7: 'API Call Failed',
    task8: 'File Upload Timeout',
    task9: 'Server Deployment',
    task10: 'Security Audit',
  },
  zh: {
    // Header
    appTitle: '爱在事务',
    appSubtitle: '夜间执行 · 清晨收获',
    totalTasks: '总任务',
    addTask: '新增任务',
    settings: '设置',
    model: '模型',
    aiEnabled: 'AI 已启用',

    // Hero
    heroTitle: '{appTitle} - 夜间智能执行',
    heroDescription: '创建任务后无需等待，AI Agent 在夜间自动执行，次日清晨即可查看结果和状态。充分利用深夜低峰时段，享受更优惠的模型服务价格。',
    heroSmartSchedule: '智能调度',

    // Status
    statusWaits: '等待',
    statusInProgress: '进行中',
    statusExecuteNow: '立即执行',
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
    save: '保存',
    edit: '编辑',
    editTaskTitle: '编辑任务',
    taskNameRequired: '请输入任务名称',
    taskAlreadyExists: '任务已存在，请创建其他任务',

    // Mock data
    task1: '数据分析任务',
    task2: '报表生成',
    task3: '系统监控检查',
    task4: '用户反馈处理',
    task5: '日志清理',
    task6: '数据库备份',
    task7: '接口调用失败',
    task8: '文件上传超时',
    task9: '服务器部署',
    task10: '安全审计',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
