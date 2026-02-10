'use client'

import { useState, useEffect } from 'react'
import { TaskPanel } from './TaskPanel'
import { ActivityLog } from './ActivityLog'
import { StatsPanel } from './StatsPanel'
import { StatusBar } from './StatusBar'
import { Task, Activity, Stats, SystemStatus } from '@/lib/types'

// 模拟数据生成器
function generateMockTasks(): Task[] {
  return [
    {
      id: '1',
      title: '开发 LocalPup 景点模块',
      description: '创建景点列表页和详情页',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 1800000),
      project: 'LocalPup',
      type: 'development',
    },
    {
      id: '2',
      title: '开发 LocalPup 餐厅模块',
      description: '创建餐厅列表页和详情页',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 1800000),
      endTime: new Date(Date.now() - 600000),
      project: 'LocalPup',
      type: 'development',
    },
    {
      id: '3',
      title: '开发实时工作进度视窗',
      description: '创建 Agent Dashboard 项目',
      status: 'in-progress',
      progress: 65,
      startTime: new Date(Date.now() - 300000),
      project: 'Agent Dashboard',
      type: 'development',
    },
    {
      id: '4',
      title: '整理 AI Agent 热点新闻',
      description: '搜索并汇总今日 AI 行业动态',
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      project: 'Daily News',
      type: 'research',
    },
  ]
}

function generateMockActivities(): Activity[] {
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      type: 'task-complete',
      message: '完成 LocalPup 景点模块开发',
      taskId: '1',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1800000),
      type: 'task-complete',
      message: '完成 LocalPup 餐厅模块开发',
      taskId: '2',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 300000),
      type: 'task-start',
      message: '开始开发 Agent Dashboard',
      taskId: '3',
    },
    {
      id: '4',
      timestamp: new Date(),
      type: 'system',
      message: '系统运行正常 - Minimax M2.1',
    },
  ]
}

function generateMockStats(): Stats {
  return {
    totalTasks: 156,
    completedTasks: 142,
    failedTasks: 3,
    inProgressTasks: 11,
    uptime: '3h 47m',
    tokensUsed: 65234,
    apiCalls: 89,
  }
}

function generateSystemStatus(): SystemStatus {
  return {
    model: 'Minimax M2.1',
    status: 'online',
    lastHeartbeat: new Date(),
    freeQuota: '100/100 (5h)',
  }
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    // 初始化数据
    setTasks(generateMockTasks())
    setActivities(generateMockActivities())
    setStats(generateMockStats())
    setSystemStatus(generateSystemStatus())

    // 每秒更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Agent Dashboard</h1>
            <p className="text-gray-400 mt-1">实时工作进度视窗</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono text-primary-400">
              {currentTime.toLocaleTimeString('zh-CN')}
            </p>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      {systemStatus && <StatusBar status={systemStatus} />}

      {/* Stats Panel */}
      {stats && <StatsPanel stats={stats} />}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Task Panel */}
        <TaskPanel tasks={tasks} />

        {/* Activity Log */}
        <ActivityLog activities={activities} />
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Agent Dashboard v0.1.0 | Local Mode | OpenClaw 2026.2.6</p>
      </footer>
    </div>
  )
}
