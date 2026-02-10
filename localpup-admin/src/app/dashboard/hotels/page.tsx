"use client"

import { useState } from "react"
import Link from "next/link"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Star, Eye, Pencil, Trash2 } from "lucide-react"

// 模拟酒店数据
const hotelsData = [
  {
    id: "1",
    name: "Four Seasons Hotel Hangzhou",
    location: "West Lake",
    rating: 4.9,
    reviewCount: 2847,
    price: 2800,
    status: "active",
    featured: true,
    images: 15
  },
  {
    id: "2",
    name: "Park Hyatt Hangzhou",
    location: "CBD",
    rating: 4.8,
    reviewCount: 1923,
    price: 1800,
    status: "active",
    featured: true,
    images: 12
  },
  {
    id: "3",
    name: "Amanfayun",
    location: "Lingyin Temple Area",
    rating: 4.9,
    reviewCount: 892,
    price: 6500,
    status: "active",
    featured: true,
    images: 20
  },
  {
    id: "4",
    name: "Grand Hyatt Hangzhou",
    location: "West Lake",
    rating: 4.7,
    reviewCount: 3421,
    price: 1200,
    status: "active",
    featured: false,
    images: 10
  },
  {
    id: "5",
    name: "InterContinental Hangzhou",
    location: "CBD",
    rating: 4.6,
    reviewCount: 2156,
    price: 950,
    status: "active",
    featured: false,
    images: 8
  }
]

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hotels] = useState(hotelsData)

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotels</h1>
          <p className="text-slate-500 mt-1">Manage hotel listings and information</p>
        </div>
        <Link href="/dashboard/hotels/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Hotels</CardTitle>
              <CardDescription>{hotels.length} hotels in total</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell>
                    <div className="font-medium">{hotel.name}</div>
                    {hotel.featured && (
                      <Badge variant="secondary" className="mt-1">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>{hotel.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                      <span className="text-slate-500 text-sm">({hotel.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>¥{hotel.price}</TableCell>
                  <TableCell>
                    <Badge variant={hotel.status === "active" ? "default" : "secondary"}>
                      {hotel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{hotel.images}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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