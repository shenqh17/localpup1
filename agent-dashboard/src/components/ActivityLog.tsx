import { Activity, CheckCircle, Clock, AlertCircle, MessageSquare, Server } from 'lucide-react'
import { Activity as ActivityType } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ActivityLogProps {
  activities: ActivityType[]
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const getIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'task-start':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'task-complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'task-fail':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'message':
        return <MessageSquare className="w-4 h-4 text-yellow-400" />
      case 'system':
        return <Server className="w-4 h-4 text-gray-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary-400" />
        <h2 className="text-lg font-semibold">活动日志</h2>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
          >
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(activity.timestamp, {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
