'use client'

import { useState, useEffect } from 'react'
import { 
  Terminal, 
  Activity, 
  Cpu, 
  Clock, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Server,
  Database,
  Globe,
  Code2,
  Bot,
  Zap
} from 'lucide-react'

interface AgentStatus {
  id: string
  name: string
  role: string
  status: 'running' | 'completed' | 'idle' | 'error'
  task: string
  progress: number
  lastUpdate: string
}

interface LogEntry {
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  agent?: string
}

interface ProjectStats {
  totalHotels: number
  targetHotels: number
  completedTasks: number
  totalTasks: number
  uptime: string
  lastDeployment: string
}

export default function AgentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: 'A1',
      name: '数据工厂-Alpha',
      role: '酒店数据生成',
      status: 'running',
      task: '生成61-100号酒店数据',
      progress: 65,
      lastUpdate: '2分钟前'
    },
    {
      id: 'B1',
      name: '全栈工程师-Beta',
      role: '网站开发',
      status: 'idle',
      task: '等待数据完成',
      progress: 80,
      lastUpdate: '5分钟前'
    },
    {
      id: 'CMD',
      name: '贾维斯',
      role: '总指挥',
      status: 'running',
      task: '监控协调所有Agent',
      progress: 100,
      lastUpdate: '刚刚'
    }
  ])
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '10:35:22', type: 'info', message: '系统启动', agent: '贾维斯' },
    { timestamp: '10:35:45', type: 'success', message: '已加载60家酒店数据', agent: '数据工厂' },
    { timestamp: '10:36:12', type: 'info', message: '开始生成61-100号酒店', agent: '数据工厂' },
    { timestamp: '10:40:08', type: 'success', message: '成功添加10家酒店(61-65, 81-85)', agent: '贾维斯' },
    { timestamp: '10:40:15', type: 'success', message: '代码已提交到GitHub', agent: '贾维斯' },
    { timestamp: '10:41:30', type: 'info', message: '正在生成工作视窗...', agent: '全栈工程师' },
  ])
  
  const [stats, setStats] = useState<ProjectStats>({
    totalHotels: 70,
    targetHotels: 100,
    completedTasks: 12,
    totalTasks: 20,
    uptime: '2小时15分',
    lastDeployment: '10:40'
  })

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 模拟实时日志更新
  useEffect(() => {
    const logTimer = setInterval(() => {
      const newLog: LogEntry = {
        timestamp: currentTime.toLocaleTimeString('zh-CN', { hour12: false }),
        type: Math.random() > 0.7 ? 'success' : 'info',
        message: ['处理数据中...', '验证数据完整性', '更新进度', '同步到GitHub'][Math.floor(Math.random() * 4)],
        agent: ['数据工厂', '贾维斯', '全栈工程师'][Math.floor(Math.random() * 3)]
      }
      setLogs(prev => [newLog, ...prev].slice(0, 50))
    }, 5000)
    return () => clearInterval(logTimer)
  }, [currentTime])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-500 bg-blue-50 border-blue-200'
      case 'completed': return 'text-green-500 bg-green-50 border-green-200'
      case 'error': return 'text-red-500 bg-red-50 border-red-200'
      default: return 'text-slate-500 bg-slate-50 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="w-4 h-4 animate-spin" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-amber-600'
      case 'error': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
      {/* 顶部标题栏 */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              贾维斯指挥中心
            </h1>
            <p className="text-slate-400 text-sm">LocalPup 项目实时监控</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{currentTime.toLocaleTimeString('zh-CN')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 rounded-lg border border-green-800 text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>运行中</span>
          </div>
        </div>
      </header>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">酒店数据</span>
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.totalHotels}</span>
            <span className="text-slate-500">/ {stats.targetHotels}</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.totalHotels / stats.targetHotels) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">任务进度</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.completedTasks}</span>
            <span className="text-slate-500">/ {stats.totalTasks}</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">运行时间</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.uptime}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">系统稳定运行中</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">最后部署</span>
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.lastDeployment}</span>
          </div>
          <p className="mt-2 text-xs text-green-400">✓ 部署成功</p>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent状态 */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Agent 工作状态
          </h2>
          
          <div className="space-y-3">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(agent.status)}`}>
                      {getStatusIcon(agent.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
                      {agent.status === 'running' ? '运行中' : agent.status === 'completed' ? '已完成' : agent.status === 'error' ? '错误' : '空闲'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{agent.lastUpdate}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-slate-300 mb-2">{agent.task}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-400 w-12 text-right">{agent.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 系统资源 */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4" />
              系统资源
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">CPU</span>
                  <span className="text-xs text-blue-400">45%</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">内存</span>
                  <span className="text-xs text-purple-400">62%</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">API额度</span>
                  <span className="text-xs text-green-400">78%</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 实时日志 */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            实时日志
          </h2>
          
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-500 ml-2">agent-terminal.log</span>
            </div>
            
            <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-slate-500 text-xs whitespace-nowrap">{log.timestamp}</span>
                  <div className="flex-1">
                    <span className="text-slate-400 text-xs">[{log.agent}]</span>
                    <span className={`ml-2 ${getLogColor(log.type)}`}>{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="mt-4 bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">快捷操作</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                <Zap className="w-4 h-4" />
                立即部署
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                <Code2 className="w-4 h-4" />
                查看代码
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                <Globe className="w-4 h-4" />
                访问网站
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <footer className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>LocalPup 项目 · 贾维斯指挥中心 · 实时监控系统</p>
        <p className="mt-1">当前版本: v0.1.0 · 最后更新: {currentTime.toLocaleTimeString('zh-CN')}</p>
      </footer>
    </div>
  )
}
