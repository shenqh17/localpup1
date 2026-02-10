import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Task } from '@/lib/types'

interface TaskPanelProps {
  tasks: Task[]
}

export function TaskPanel({ tasks }: TaskPanelProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold">当前任务</h2>
        </div>
        <span className="text-sm text-gray-500">{tasks.length} 个任务</span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-100 truncate">{task.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {task.status === 'completed' ? '已完成' :
                     task.status === 'in-progress' ? '进行中' :
                     task.status === 'failed' ? '失败' : '待开始'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getStatusColor(task.status)}`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-dark-600 rounded">{task.project}</span>
                  <span>{task.type === 'development' ? '开发' : 
                         task.type === 'testing' ? '测试' : 
                         task.type === 'research' ? '研究' : '沟通'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
