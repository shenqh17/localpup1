"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Play, RotateCcw, Clock, CheckCircle, XCircle, Loader2, Terminal } from "lucide-react"

// 模拟日志数据
const mockLogs = [
  { time: "2024-02-09 10:15:32", level: "info", message: "Starting scraper for Booking.com..." },
  { time: "2024-02-09 10:15:33", level: "info", message: "Connecting to database..." },
  { time: "2024-02-09 10:15:34", level: "success", message: "Database connection established" },
  { time: "2024-02-09 10:15:35", level: "info", message: "Fetching hotel list from Booking.com API..." },
  { time: "2024-02-09 10:15:38", level: "success", message: "Found 48 hotels in Hangzhou" },
  { time: "2024-02-09 10:15:40", level: "info", message: "Processing hotel: Four Seasons Hotel Hangzhou" },
  { time: "2024-02-09 10:15:42", level: "success", message: "Updated hotel: Four Seasons Hotel Hangzhou (Rating: 4.9)" },
  { time: "2024-02-09 10:15:45", level: "info", message: "Processing hotel: Park Hyatt Hangzhou" },
  { time: "2024-02-09 10:15:47", level: "success", message: "Updated hotel: Park Hyatt Hangzhou (Rating: 4.8)" },
  { time: "2024-02-09 10:15:50", level: "info", message: "Processing hotel: Amanfayun" },
  { time: "2024-02-09 10:15:52", level: "success", message: "Updated hotel: Amanfayun (Rating: 4.9)" },
  { time: "2024-02-09 10:16:00", level: "info", message: "Scraping images for hotels..." },
  { time: "2024-02-09 10:16:15", level: "success", message: "Downloaded 156 images from Booking.com" },
  { time: "2024-02-09 10:16:16", level: "success", message: "Scraper completed successfully" },
]

export default function ScraperPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("booking")

  const handleStartScraper = () => {
    setIsRunning(true)
    setProgress(0)
    setLogs([])
    
    // 模拟进度
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)
      
      // 添加日志
      if (currentProgress % 20 === 0) {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] Processing batch ${currentProgress / 20}...`])
      }
      
      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsRunning(false)
        setLogs(prev => [...prev, `[${new Date().toISOString()}] Scraper completed successfully!`])
      }
    }, 500)
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-600"
      case "success": return "text-green-600"
      case "warning": return "text-amber-600"
      default: return "text-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Scraper</h1>
        <p className="text-slate-500 mt-1">Run and monitor data collection from booking platforms</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="booking">Booking.com</TabsTrigger>
          <TabsTrigger value="ctrip">Ctrip 携程</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Booking.com Scraper</CardTitle>
                  <CardDescription>Fetch hotel data from Booking.com</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last run: 2 hours ago
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">48</div>
                  <div className="text-sm text-slate-500">Hotels Found</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-slate-500">Images Downloaded</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">4.7</div>
                  <div className="text-sm text-slate-500">Avg Rating</div>
                </div>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleStartScraper} 
                  disabled={isRunning}
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Scraper
                    </>
                  )}
                </Button>
                <Button variant="outline" disabled={isRunning}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm h-80 overflow-y-auto">
                {mockLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`ml-2 ${getLogColor(log.level)}`}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="text-slate-300 ml-2">{log.message}</span>
                  </div>
                ))}
                {logs.map((log, index) => (
                  <div key={`live-${index}`} className="mb-1">
                    <span className="text-slate-300">{log}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ctrip" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ctrip 携程 Scraper</CardTitle>
                  <CardDescription>Fetch hotel data from Ctrip (携程)</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last run: 5 hours ago
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">52</div>
                  <div className="text-sm text-slate-500">Hotels Found</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">203</div>
                  <div className="text-sm text-slate-500">Images Downloaded</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold">4.6</div>
                  <div className="text-sm text-slate-500">Avg Rating</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Scraper
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}