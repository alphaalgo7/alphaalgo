"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  FileText,
  Download,
  Trash2,
  Eye,
  Copy,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  LogOut,
  Folder,
  Star,
  MoreVertical,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface ProjectFile {
  id: string
  name: string
  type: "strategy" | "portfolio" | "checklist"
  size: string
  lastModified: string
  createdAt: string
  isStarred: boolean
  stoxxoNumber?: string
  instrument?: string
  planLetters?: string
  status: "active" | "draft" | "archived"
}

interface UserDashboardProps {
  user: User
  onClose: () => void
  onLogout: () => void
}

export default function UserDashboard({ user, onClose, onLogout }: UserDashboardProps) {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastModified")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    // Simulate loading user files
    const mockFiles: ProjectFile[] = [
      {
        id: "1",
        name: "STOXXO1_SENSEX0DTE_PLANA_2024-01-15",
        type: "strategy",
        size: "2.4 KB",
        lastModified: "2024-01-15T10:30:00Z",
        createdAt: "2024-01-15T09:00:00Z",
        isStarred: true,
        stoxxoNumber: "1",
        instrument: "SENSEX0DTE",
        planLetters: "A",
        status: "active",
      },
      {
        id: "2",
        name: "Multi_Leg_Portfolio_PLANAB_2024-01-14",
        type: "portfolio",
        size: "1.8 KB",
        lastModified: "2024-01-14T16:45:00Z",
        createdAt: "2024-01-14T14:20:00Z",
        isStarred: false,
        stoxxoNumber: "2",
        instrument: "NIFTY1DTE",
        planLetters: "AB",
        status: "draft",
      },
      {
        id: "3",
        name: "Strategy_Checklist_PLANC_2024-01-13",
        type: "checklist",
        size: "3.1 KB",
        lastModified: "2024-01-13T11:20:00Z",
        createdAt: "2024-01-13T10:00:00Z",
        isStarred: true,
        stoxxoNumber: "3",
        instrument: "SENSEX1DTE",
        planLetters: "C",
        status: "active",
      },
      {
        id: "4",
        name: "STOXXO4_NIFTY0DTE_PLANBC_2024-01-12",
        type: "strategy",
        size: "4.2 KB",
        lastModified: "2024-01-12T14:15:00Z",
        createdAt: "2024-01-12T13:00:00Z",
        isStarred: false,
        stoxxoNumber: "4",
        instrument: "NIFTY0DTE",
        planLetters: "BC",
        status: "archived",
      },
    ]
    setFiles(mockFiles)
  }, [])

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.instrument?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.stoxxoNumber?.includes(searchTerm)
    const matchesType = filterType === "all" || file.type === filterType
    return matchesSearch && matchesType
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "type":
        return a.type.localeCompare(b.type)
      case "size":
        return Number.parseFloat(a.size) - Number.parseFloat(b.size)
      case "lastModified":
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    }
  })

  const toggleStar = (fileId: string) => {
    setFiles(files.map((file) => (file.id === fileId ? { ...file, isStarred: !file.isStarred } : file)))
  }

  const deleteFile = (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId))
    toast({
      title: "File Deleted",
      description: "The file has been permanently deleted.",
    })
  }

  const duplicateFile = (fileId: string) => {
    const originalFile = files.find((file) => file.id === fileId)
    if (originalFile) {
      const duplicatedFile: ProjectFile = {
        ...originalFile,
        id: Date.now().toString(),
        name: `${originalFile.name}_copy`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: "draft",
      }
      setFiles([duplicatedFile, ...files])
      toast({
        title: "File Duplicated",
        description: "A copy of the file has been created.",
      })
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "strategy":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "portfolio":
        return <Folder className="h-5 w-5 text-purple-600" />
      case "checklist":
        return <FileText className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    totalFiles: files.length,
    activeFiles: files.filter((f) => f.status === "active").length,
    starredFiles: files.filter((f) => f.isStarred).length,
    recentFiles: files.filter((f) => {
      const fileDate = new Date(f.lastModified)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return fileDate > weekAgo
    }).length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Editor</span>
              </Button>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user.name}'s Workspace</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your strategy configurations and files
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Files</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalFiles}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeFiles}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Starred</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.starredFiles}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.recentFiles}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-semibold">Your Files</CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                >
                  <option value="all">All Types</option>
                  <option value="strategy">Strategy</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="checklist">Checklist</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                  <option value="size">Size</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No files found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Start creating strategy configurations to see them here"}
                </p>
                <Button onClick={onClose} className="bg-sky-600 hover:bg-sky-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Configuration
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <Badge variant="secondary" className="text-xs">
                            {file.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => toggleStar(file.id)} className="h-8 w-8 p-0">
                            <Star
                              className={`h-4 w-4 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">{file.name}</h3>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Size: {file.size}</span>
                          <Badge className={getStatusColor(file.status)} variant="secondary">
                            {file.status}
                          </Badge>
                        </div>
                        {file.stoxxoNumber && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            STOXXO {file.stoxxoNumber} • {file.instrument} • Plan {file.planLetters}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(file.lastModified)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => duplicateFile(file.id)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
