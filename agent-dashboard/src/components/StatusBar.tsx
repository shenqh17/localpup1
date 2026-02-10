import { Wifi, WifiOff, Cpu, Activity } from 'lucide-react'
import { SystemStatus } from '@/lib/types'

interface StatusBarProps {
  status: SystemStatus
}

export function StatusBar({ status }: StatusBarProps) {
  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'offline':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'busy':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusText = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return '在线'
      case 'offline':
        return '离线'
      case 'busy':
        return '忙碌'
      default:
        return '未知'
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mt-6">
      {/* Model Status */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(status.status)}`}>
        {status.status === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span className="text-sm font-medium">{status.model}</span>
        <span className="text-xs opacity-75">({getStatusText(status.status)})</span>
      </div>

      {/* Free Quota */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-gray-300">
        <Cpu className="w-4 h-4 text-primary-400" />
        <span className="text-sm">免费额度: {status.freeQuota}</span>
      </div>

      {/* Last Heartbeat */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-gray-300">
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="text-sm">
          心跳: {new Date(status.lastHeartbeat).toLocaleTimeString('zh-CN')}
        </span>
      </div>
    </div>
  )
}
