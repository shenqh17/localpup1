import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hotel, Video, Eye, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  // 模拟统计数据
  const stats = [
    {
      title: "Total Hotels",
      value: "48",
      description: "+5 from last month",
      icon: Hotel,
      trend: "up"
    },
    {
      title: "Videos",
      value: "12",
      description: "+2 from last month",
      icon: Video,
      trend: "up"
    },
    {
      title: "Total Views",
      value: "12.5K",
      description: "+18% from last month",
      icon: Eye,
      trend: "up"
    },
    {
      title: "Avg. Rating",
      value: "4.7",
      description: "+0.2 from last month",
      icon: TrendingUp,
      trend: "up"
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome to LocalPup Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/dashboard/hotels" className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="font-medium">Manage Hotels</div>
              <div className="text-sm text-slate-500">Add, edit, or remove hotel listings</div>
            </a>
            <a href="/dashboard/videos" className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="font-medium">Manage Videos</div>
              <div className="text-sm text-slate-500">Add or update video content</div>
            </a>
            <a href="/dashboard/scraper" className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="font-medium">Run Scraper</div>
              <div className="text-sm text-slate-500">Update hotel data from booking platforms</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Scrape</span>
              <span className="text-sm text-slate-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">System Version</span>
              <span className="text-sm text-slate-500">v1.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}