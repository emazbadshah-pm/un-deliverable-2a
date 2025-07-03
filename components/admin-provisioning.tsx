"use client"

import { useState } from "react"
import { Search, Filter, Download, MoreHorizontal, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdminProvisioningProps {
  onAddAdmin: () => void
  successMessage?: string
  onClearSuccess?: () => void
  isViewOnly?: boolean
}

interface Admin {
  id: string
  name: string
  email: string
  role: "Full Access" | "View Only"
  provisioningDate: string
  selected?: boolean
}

// Sample admin data matching the images
const initialAdmins: Admin[] = [
  {
    id: "1",
    name: "Isa Jamil",
    email: "isa.j@google.com",
    role: "Full Access",
    provisioningDate: "08/04/2025",
  },
  {
    id: "2",
    name: "Tabriaiz Jashir",
    email: "tabraiz@hotmail.com",
    role: "Full Access",
    provisioningDate: "09/09/2023",
  },
  {
    id: "3",
    name: "Komal Khalid",
    email: "komalkhalid@outlook.com",
    role: "Full Access",
    provisioningDate: "08/06/2022",
  },
  {
    id: "4",
    name: "Fatima Waqas",
    email: "fatima@icloud.com",
    role: "Full Access",
    provisioningDate: "08/01/2025",
  },
  {
    id: "5",
    name: "Muzammil Saleem",
    email: "muzammil997@protonmail.com",
    role: "Full Access",
    provisioningDate: "01/09/2025",
  },
  {
    id: "6",
    name: "Hina Aurangzaib",
    email: "aurangzebhina89@yahoo.com",
    role: "Full Access",
    provisioningDate: "01/05/2022",
  },
  {
    id: "7",
    name: "Rabia Wahid",
    email: "rabia.wahid_99@gmail.com",
    role: "View Only",
    provisioningDate: "06/06/2022",
  },
  {
    id: "8",
    name: "Ibrahim Khaleel",
    email: "i.khalil007@gmail.com",
    role: "View Only",
    provisioningDate: "08/06/2022",
  },
  {
    id: "9",
    name: "Ramsha Jamil",
    email: "ramsha_jamil@yahoo.com",
    role: "View Only",
    provisioningDate: "12/12/2021",
  },
  {
    id: "10",
    name: "Zaamin Shah",
    email: "zaamin_shah@outlook.com",
    role: "Full Access",
    provisioningDate: "11/10/2020",
  },
  {
    id: "11",
    name: "Sarah Ahmed",
    email: "sarah@ummahnavigator.com",
    role: "View Only",
    provisioningDate: "01/01/2025",
  },
]

const EmptyState = ({
  onAddAdmin,
  isViewOnly,
}: {
  onAddAdmin: () => void
  isViewOnly?: boolean
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <UserCog className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admins Provisioned</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      {isViewOnly
        ? "There are currently no administrators provisioned in the system."
        : "Get started by adding your first administrator. Admins will be able to manage users, locations, and other system settings."}
    </p>
    {!isViewOnly && (
      <Button onClick={onAddAdmin} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
        Add First Admin
      </Button>
    )}
  </div>
)

export function AdminProvisioning({
  onAddAdmin,
  successMessage,
  onClearSuccess,
  isViewOnly = false,
}: AdminProvisioningProps) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isExporting, setIsExporting] = useState(false)

  const sortData = (data: Admin[], sortBy: string, sortOrder: "asc" | "desc") => {
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
          aValue = new Date(a.provisioningDate)
          bValue = new Date(b.provisioningDate)
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
      ["User Name", "Email", "Provisioning Date", "Role"],
      ...sortedAndFilteredAdmins.map((admin) => [admin.name, admin.email, admin.provisioningDate, admin.role]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admin_provisioning.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  const handleRoleChange = (adminId: string, newRole: "Full Access" | "View Only") => {
    if (isViewOnly) return // Prevent role changes for view-only users
    setAdmins(admins.map((admin) => (admin.id === adminId ? { ...admin, role: newRole } : admin)))
  }

  const handleRemoveAdmin = (adminId: string) => {
    if (isViewOnly) return // Prevent removal for view-only users
    setAdmins(admins.filter((admin) => admin.id !== adminId))
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedAndFilteredAdmins = sortData(filteredAdmins, sortBy, sortOrder)

  const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
  const endIndex = startIndex + Number.parseInt(rowsPerPage)
  const displayedAdmins = sortedAndFilteredAdmins.slice(startIndex, endIndex)

  const totalPages = Math.ceil(sortedAndFilteredAdmins.length / Number.parseInt(rowsPerPage))
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
    setCurrentPage(1)
  }

  return (
    <div className="bg-white rounded-xl">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-500 text-white px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-medium">{successMessage}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSuccess}
            className="text-white hover:bg-green-600 h-auto p-1"
          >
            ×
          </Button>
        </div>
      )}

      {admins.length === 0 ? (
        <EmptyState onAddAdmin={onAddAdmin} isViewOnly={isViewOnly} />
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
                    <DropdownMenuItem onClick={() => handleSort("email", "desc")}>Email: Z-A</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("date", "desc")}>
                      Provisioning Date: Latest-Oldest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("date", "asc")}>
                      Provisioning Date: Oldest-Latest
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
                  {!isViewOnly && (
                    <TableHead className="w-12">
                      <Checkbox disabled={isViewOnly} />
                    </TableHead>
                  )}
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Provisioning Date</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  {!isViewOnly && <TableHead className="w-12"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-gray-50">
                    {!isViewOnly && (
                      <TableCell className="border-none">
                        <Checkbox disabled={isViewOnly} />
                      </TableCell>
                    )}
                    <TableCell className="font-medium border-none">{admin.name}</TableCell>
                    <TableCell className="text-gray-600 border-none">{admin.email}</TableCell>
                    <TableCell className="text-gray-600 border-none">{admin.provisioningDate}</TableCell>
                    <TableCell className="border-none">{admin.role}</TableCell>
                    {!isViewOnly && (
                      <TableCell className="border-none">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(admin.id, "Full Access")}
                              className="flex items-center justify-between"
                            >
                              Full Access
                              {admin.role === "Full Access" && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(admin.id, "View Only")}
                              className="flex items-center justify-between"
                            >
                              View Only
                              {admin.role === "View Only" && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveAdmin(admin.id)} className="text-red-600">
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
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
                {startIndex + 1}-{Math.min(endIndex, sortedAndFilteredAdmins.length)} of{" "}
                {sortedAndFilteredAdmins.length}
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
  )
}
