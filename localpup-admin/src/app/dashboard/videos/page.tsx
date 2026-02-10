"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Play, Trash2, Youtube } from "lucide-react"

// 模拟视频数据
const videosData = [
  {
    id: "1",
    title: "Four Seasons Hangzhou - Luxury Resort Tour",
    titleZh: "杭州西子湖四季酒店 - 豪华度假村之旅",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    category: "hotel",
    duration: "5:32",
    featured: true,
    active: true
  },
  {
    id: "2",
    title: "Amanfayun - Hidden Gem in Hangzhou",
    titleZh: "法云安缦 - 杭州的隐藏瑰宝",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    category: "hotel",
    duration: "4:18",
    featured: true,
    active: true
  },
  {
    id: "3",
    title: "West Lake at Sunset",
    titleZh: "西湖日落",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    category: "attraction",
    duration: "3:45",
    featured: false,
    active: true
  },
  {
    id: "4",
    title: "Park Hyatt Hangzhou Room Tour",
    titleZh: "杭州柏悦酒店客房之旅",
    platform: "tiktok",
    videoId: "123456789",
    category: "hotel",
    duration: "6:12",
    featured: false,
    active: true
  }
]

export default function VideosPage() {
  const [videos, setVideos] = useState(videosData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: "",
    titleZh: "",
    platform: "youtube",
    videoId: "",
    category: "hotel"
  })

  const handleAddVideo = () => {
    const video = {
      id: String(videos.length + 1),
      ...newVideo,
      duration: "0:00",
      featured: false,
      active: true
    }
    setVideos([...videos, video])
    setIsDialogOpen(false)
    setNewVideo({ title: "", titleZh: "", platform: "youtube", videoId: "", category: "hotel" })
  }

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-slate-500 mt-1">Manage video content and embeds</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a YouTube or TikTok video to the gallery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (English)</Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Video title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleZh">Title (Chinese)</Label>
                <Input
                  id="titleZh"
                  value={newVideo.titleZh}
                  onChange={(e) => setNewVideo({ ...newVideo, titleZh: e.target.value })}
                  placeholder="Video title in Chinese"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={newVideo.platform}
                    onValueChange={(value) => setNewVideo({ ...newVideo, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newVideo.category}
                    onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="attraction">Attraction</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoId">Video ID</Label>
                <Input
                  id="videoId"
                  value={newVideo.videoId}
                  onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
                  placeholder={newVideo.platform === "youtube" ? "YouTube video ID" : "TikTok video ID"}
                />
                <p className="text-sm text-slate-500">
                  {newVideo.platform === "youtube" 
                    ? "e.g., dQw4w9WgXcQ from youtube.com/watch?v=dQw4w9WgXcQ"
                    : "e.g., 123456789 from tiktok.com/@user/video/123456789"
                  }
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddVideo}>Add Video</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
          <CardDescription>{videos.length} videos in gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="font-medium">{video.title}</div>
                    <div className="text-sm text-slate-500">{video.titleZh}</div>
                    {video.featured && (
                      <Badge variant="secondary" className="mt-1">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {video.platform === "youtube" ? (
                        <Youtube className="w-4 h-4 text-red-600" />
                      ) : (
                        <span className="text-sm">TikTok</span>
                      )}
                      <span className="capitalize">{video.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{video.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={video.active ? "default" : "secondary"}>
                      {video.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`https://${video.platform === 'youtube' ? 'youtube.com/watch?v=' : 'tiktok.com/@user/video/'}${video.videoId}`} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}