"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  Users,
  MapPin,
  FolderTree,
  MessageSquare,
  UserCog,
  Search,
  Filter,
  Download,
  Menu,
  X,
  LogOut,
  Construction,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AdminProvisioning } from "./admin-provisioning"
import { AddAdminForm } from "./add-admin-form"

interface DashboardProps {
  user: { name: string; email: string; role: "Full Access" | "View Only" }
  onLogout: () => void
}

const navigationItems = [
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Users, label: "Registered Users", id: "users" },
  { icon: MapPin, label: "Location Management", id: "locations" },
  { icon: FolderTree, label: "Category Management", id: "categories" },
  { icon: MessageSquare, label: "Feedback", id: "feedback" },
  { icon: UserCog, label: "Admin Provisioning", id: "admin" },
]

const userData = [
  { name: "Isa Jamil", email: "isa.j@google.com", registrationDate: "08/04/2025" },
  { name: "Tabriaiz Jashir", email: "tabraiz@hotmail.com", registrationDate: "09/09/2023" },
  { name: "Komal Khalid", email: "komalkhalid@outlook.com", registrationDate: "08/06/2022" },
  { name: "Fatima Waqas", email: "fatima@icloud.com", registrationDate: "08/01/2025" },
  { name: "Muzammil Saleem", email: "muzammil997@protonmail.com", registrationDate: "01/09/2025" },
  { name: "Hina Aurangzaib", email: "aurangzebhina89@yahoo.com", registrationDate: "01/05/2022" },
  { name: "Rabia Wahid", email: "rabia.wahid_99@gmail.com", registrationDate: "06/06/2022" },
  { name: "Ibrahim Khaleel", email: "i.khalil007@gmail.com", registrationDate: "08/06/2022" },
  { name: "Ramsha Jamil", email: "ramsha_jamil@yahoo.com", registrationDate: "12/12/2021" },
  { name: "Zamin Shah", email: "zamin_shah@outlook.com", registrationDate: "11/10/2020" },
]

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionButton,
}: {
  icon: any
  title: string
  description: string
  actionButton?: React.ReactNode
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
    {actionButton}
  </div>
)

const UnderDevelopment = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
      <Construction className="w-8 h-8 text-orange-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-center max-w-md">Under Development</p>
  </div>
)

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [showAddAdminForm, setShowAddAdminForm] = useState(false)

  const [sortBy, setSortBy] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [adminSuccessMessage, setAdminSuccessMessage] = useState("")
  const [adminErrorMessage, setAdminErrorMessage] = useState("")

  const isViewOnly = user.role === "View Only"

  const sortData = (data: typeof userData, sortBy: string, sortOrder: "asc" | "desc") => {
    if (!sortBy) return data

    return [...data].sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "email":
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case "date":
          aValue = new Date(a.registrationDate)
          bValue = new Date(b.registrationDate)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }

  const handleSort = (field: string, order: "asc" | "desc") => {
    setSortBy(field)
    setSortOrder(order)
  }

  const handleExport = async () => {
    if (isViewOnly) return // Prevent export for view-only users

    setIsExporting(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csvContent = [
      ["User Name", "Email", "Registration Date"],
      ...sortedAndFilteredUsers.map((user) => [user.name, user.email, user.registrationDate]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "registered_users.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedAndFilteredUsers = sortData(filteredUsers, sortBy, sortOrder)

  const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
  const endIndex = startIndex + Number.parseInt(rowsPerPage)
  const displayedUsers = sortedAndFilteredUsers.slice(startIndex, endIndex)

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / Number.parseInt(rowsPerPage))
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "analytics":
        return { title: "Analytics", description: "View comprehensive analytics and insights" }
      case "users":
        return { title: "Registered Users", description: "View the list of all the registered user of Ummah Navigator" }
      case "locations":
        return { title: "Location Management", description: "Manage and organize location data" }
      case "categories":
        return { title: "Category Management", description: "Manage and organize categories" }
      case "feedback":
        return { title: "Feedback", description: "View and manage user feedback" }
      case "admin":
        return {
          title: "Admin Provisioning",
          description: isViewOnly
            ? "View list of provisioned admins"
            : "Create, edit, remove and view list of provisioned admins",
        }
      default:
        return { title: "", description: "" }
    }
  }

  const pageInfo = getPageTitle()

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
      fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"}
      w-64
    `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:justify-center border-none">
            {!isSidebarCollapsed && (
              <h1 className="text-2xl font-bold text-gray-900">
                Ummah<span className="text-[#d98c4a]">Navigator</span>
              </h1>
            )}
            {isSidebarCollapsed && <div className="text-2xl font-bold text-[#d98c4a]">{""}</div>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Collapse Toggle Button - Desktop Only */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-100 border-none">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-600 hover:bg-gray-100 h-8 w-8 p-0"
            >
              {isSidebarCollapsed ? <ChevronRight className="shadow-sm rounded-full w-6 h-6 mx-2 my-0" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const navButton = (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsSidebarOpen(false)
                    }}
                    className={`w-full font-medium transition-colors ${
                      isSidebarCollapsed ? "justify-center h-12 px-3" : "justify-start text-left h-12 px-4"
                    } rounded-xl ${
                      activeTab === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isSidebarCollapsed ? "" : "mr-3"}`} />
                    {!isSidebarCollapsed && item.label}
                  </Button>
                )

                return (
                  <li key={item.id}>
                    {isSidebarCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      navButton
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-6 pb-8">
            {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10 bg-purple-600">
                    <AvatarFallback className="text-white font-medium bg-[rgba(159,134,252,1)]">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mb-6">
                  <Badge
                    variant={isViewOnly ? "secondary" : "default"}
                    className={`flex items-center space-x-1 w-fit ${
                      isViewOnly
                        ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                    }`}
                  >
                    {isViewOnly && <Eye className="h-3 w-3" />}
                    <span className="text-xs font-medium">{user.role}</span>
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start text-gray-700 hover:bg-gray-100 h-10 px-4 rounded-xl"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-10 w-10 bg-purple-600 cursor-pointer">
                      <AvatarFallback className="text-white font-medium bg-[rgba(159,134,252,1)]">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={onLogout}
                      className="text-gray-700 hover:bg-gray-100 h-10 w-10 p-0 rounded-xl"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-4 py-4 lg:px-6 border-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{pageInfo.title}</h1>
                  <p className="text-sm text-gray-600 mt-1">{pageInfo.description}</p>
                </div>
              </div>
              {activeTab === "users" && !isViewOnly && (
                <Button className="bg-[#24735c] hover:bg-[#1e5d4a] text-white hidden sm:flex rounded-xl">
                  View Analytics
                </Button>
              )}
              {activeTab === "admin" && !showAddAdminForm && !isViewOnly && (
                <Button
                  onClick={() => setShowAddAdminForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white hidden sm:flex rounded-xl"
                >
                  Add User
                </Button>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6 text-black bg-white">
            {activeTab === "analytics" && <UnderDevelopment title="Analytics" />}

            {activeTab === "users" && (
              <div className="bg-white rounded-xl">
                {userData.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No Registered Users"
                    description="There are currently no registered users in the Ummah Navigator system. Users will appear here once they start registering for the application."
                  />
                ) : (
                  <>
                    {/* Table controls */}
                    <div className="p-4 border-b border-gray-200 border-none">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="justify-start bg-transparent rounded-xl">
                                <Filter className="mr-2 h-4 w-4" />
                                Sort
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              <DropdownMenuItem onClick={() => handleSort("name", "asc")}>Name: A-Z</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort("name", "desc")}>Name: Z-A</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort("email", "asc")}>Email: A-Z</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort("email", "desc")}>
                                Email: Z-A
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort("date", "desc")}>
                                Registration Date: Latest-Oldest
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort("date", "asc")}>
                                Registration Date: Oldest-Latest
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {!isViewOnly && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start bg-transparent rounded-xl"
                              onClick={handleExport}
                              disabled={isExporting}
                            >
                              {isExporting ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                                  Exporting...
                                </div>
                              ) : (
                                <>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">User Name</TableHead>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableHead className="font-semibold">Registration Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedUsers.map((user, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                              <TableCell className="font-medium border-none">{user.name}</TableCell>
                              <TableCell className="text-gray-600">{user.email}</TableCell>
                              <TableCell className="text-gray-600">{user.registrationDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-gray-200 space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <Select value={rowsPerPage} onValueChange={handleRowsPerPageChange}>
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {startIndex + 1}-{Math.min(endIndex, sortedAndFilteredUsers.length)} of{" "}
                          {sortedAndFilteredUsers.length}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasPreviousPage}
                            onClick={handlePreviousPage}
                            className="rounded-xl bg-transparent"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasNextPage}
                            onClick={handleNextPage}
                            className="rounded-xl bg-transparent"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "locations" && <UnderDevelopment title="Location Management" />}

            {activeTab === "categories" && <UnderDevelopment title="Category Management" />}

            {activeTab === "feedback" && <UnderDevelopment title="Feedback" />}

            {activeTab === "admin" && !showAddAdminForm && (
              <AdminProvisioning
                onAddAdmin={() => setShowAddAdminForm(true)}
                successMessage={adminSuccessMessage}
                onClearSuccess={() => setAdminSuccessMessage("")}
                isViewOnly={isViewOnly}
              />
            )}
            {activeTab === "admin" && showAddAdminForm && !isViewOnly && (
              <>
                {adminErrorMessage && (
                  <div className="mb-4 bg-red-500 text-white px-4 py-3 rounded-lg flex items-center justify-between">
                    <span className="font-medium">{adminErrorMessage}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdminErrorMessage("")}
                      className="text-white hover:bg-red-600 h-auto p-1"
                    >
                      ×
                    </Button>
                  </div>
                )}
                <AddAdminForm
                  onBack={() => setShowAddAdminForm(false)}
                  onSuccess={(message) => {
                    setAdminSuccessMessage(message)
                    setAdminErrorMessage("")
                  }}
                  onError={(message) => {
                    setAdminErrorMessage(message)
                    setAdminSuccessMessage("")
                  }}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
