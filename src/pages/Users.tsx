import { useState, useEffect } from "react"
import api, { type User, type Todo } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type UserFormData } from "@/lib/schemas"
import { Pencil, Trash2, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"role" | "tasks">("role")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, todosRes] = await Promise.all([
        api.get("/users"),
        api.get("/todos")
      ])
      setUsers(usersRes.data)
      setTodos(todosRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const getTaskCount = (userId: string) => {
    return todos.filter(todo => todo.assignedTo === userId).length
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "role") {
      return sortOrder === "asc" 
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role)
    } else {
      const countA = getTaskCount(a.id)
      const countB = getTaskCount(b.id)
      return sortOrder === "asc" ? countA - countB : countB - countA
    }
  })

  const toggleSort = (key: "role" | "tasks") => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc") // Default to descending for new sort (especially tasks)
    }
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, data)
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...data, updatedAt: new Date().toISOString() }
              : u
          )
        )
        toast.success("User updated successfully")
      } else {
        const response = await api.post("/users", data)
        setUsers([...users, response.data])
        toast.success("User created successfully")
      }
      reset()
      setEditingUser(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("Failed to save user")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`)
        setUsers(users.filter((u) => u.id !== id))
        toast.success("User deleted successfully")
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user")
      }
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    reset()
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle style={{ color: 'var(--header-color)' }}>Users</CardTitle>
            <Select 
              value={sortBy} 
              onValueChange={(val: "role" | "tasks") => {
                setSortBy(val)
                setSortOrder("desc")
              }}
            >
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Sort by Role</SelectItem>
                <SelectItem value="tasks">Sort by Task Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-shadow duration-300"
              >
                + New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" {...register("role")} placeholder="e.g. Admin, User" />
                </div>
                <Button type="submit" className="w-full">
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: 'var(--header-color)' }}>Name</TableHead>
                <TableHead style={{ color: 'var(--header-color)' }}>Email</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort("role")}
                    className="flex items-center gap-1 hover:bg-transparent px-0 font-medium"
                    style={{ color: 'var(--header-color)' }}
                  >
                    Role
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort("tasks")}
                    className="flex items-center gap-1 hover:bg-transparent px-0 font-medium"
                    style={{ color: 'var(--header-color)' }}
                  >
                    Assigned Tasks
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right" style={{ color: 'var(--header-color)' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading Skeletons for Table Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium" style={{ color: 'var(--text-color)' }}>{user.firstName} {user.lastName}</TableCell>
                    <TableCell style={{ color: 'var(--text-color)' }}>{user.email}</TableCell>
                    <TableCell style={{ color: 'var(--text-color)' }}>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span 
                          className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          {getTaskCount(user.id)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                          <Pencil className="h-4 w-4" style={{ color: 'var(--text-color)' }} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" style={{ color: 'var(--text-color)' }} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}