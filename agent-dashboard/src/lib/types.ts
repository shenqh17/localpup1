export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  progress: number
  startTime: Date
  endTime?: Date
  project: string
  type: 'development' | 'testing' | 'research' | 'communication'
}

export interface Activity {
  id: string
  timestamp: Date
  type: 'task-start' | 'task-complete' | 'task-fail' | 'message' | 'system'
  message: string
  taskId?: string
}

export interface Stats {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  inProgressTasks: number
  uptime: string
  tokensUsed: number
  apiCalls: number
}

export interface SystemStatus {
  model: string
  status: 'online' | 'offline' | 'busy'
  lastHeartbeat: Date
  freeQuota: string
}
