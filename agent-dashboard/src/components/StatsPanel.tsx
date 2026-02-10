import { CheckCircle, Clock, AlertCircle, Zap, Server, TrendingUp } from 'lucide-react'
import { Stats } from '@/lib/types'

interface StatsPanelProps {
  stats: Stats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    {
      label: '总任务',
      value: stats.totalTasks,
      icon: Zap,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
    },
    {
      label: '已完成',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '进行中',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '失败',
      value: stats.failedTasks,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Token 用量',
      value: `${(stats.tokensUsed / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: '运行时间',
      value: stats.uptime,
      icon: Server,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-dark-600 transition-colors"
        >
          <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
