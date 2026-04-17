import { useState, useEffect } from "react"
import api, { type Todo, type User } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { todoSchema, type TodoFormData } from "@/lib/schemas"
import { Pencil, Trash2, CheckCircle, Circle, Clock, ChevronDown, ChevronRight, X, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [selectedActive, setSelectedActive] = useState<string[]>([])
  const [selectedCompleted, setSelectedCompleted] = useState<string[]>([])
  
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [todosRes, usersRes] = await Promise.all([
        api.get("/todos"),
        api.get("/users")
      ])
      setTodos(todosRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // --- SORTING LOGIC ---
  const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 }
  
  const sortTodos = (a: Todo, b: Todo) => {
    const pA = priorityMap[a.priority] || 0
    const pB = priorityMap[b.priority] || 0
    return pB - pA // High to Low
  }

  // Derived & Sorted Lists
  const activeTodos = todos
    .filter(t => t.status !== 'completed')
    .sort(sortTodos)

  const completedTodos = todos
    .filter(t => t.status === 'completed')
    .sort(sortTodos)

  // ... (Selection Helpers & Bulk Actions remain unchanged) ...
  const toggleSelectActive = (id: string, checked: boolean) => {
    if (checked) setSelectedActive(prev => [...prev, id])
    else setSelectedActive(prev => prev.filter(tid => tid !== id))
  }

  const toggleSelectCompleted = (id: string, checked: boolean) => {
    if (checked) setSelectedCompleted(prev => [...prev, id])
    else setSelectedCompleted(prev => prev.filter(tid => tid !== id))
  }

  const toggleAllActive = (checked: boolean) => {
    setSelectedActive(checked ? activeTodos.map(t => t.id) : [])
  }

  const toggleAllCompleted = (checked: boolean) => {
    setSelectedCompleted(checked ? completedTodos.map(t => t.id) : [])
  }

  const handleBulkUpdateActive = async (updates: Partial<Todo>) => {
    if (selectedActive.length === 0) return
    try {
      await Promise.all(selectedActive.map(id => api.put(`/todos/${id}`, updates)))
      setTodos(prev => prev.map(t => selectedActive.includes(t.id) ? { ...t, ...updates } : t))
      toast.success(`Updated ${selectedActive.length} tasks`)
      setSelectedActive([]) 
    } catch (error) {
      toast.error("Failed to update tasks")
    }
  }

  const handleBulkRestore = async () => {
    if (selectedCompleted.length === 0) return
    try {
      await Promise.all(selectedCompleted.map(id => api.put(`/todos/${id}`, { status: 'pending' })))
      setTodos(prev => prev.map(t => selectedCompleted.includes(t.id) ? { ...t, status: 'pending' } : t))
      toast.success(`Restored ${selectedCompleted.length} tasks`)
      setSelectedCompleted([])
    } catch (error) {
      toast.error("Failed to restore tasks")
    }
  }

  const handleBulkDeleteCompleted = async () => {
    if (selectedCompleted.length === 0) return
    if (!confirm(`Permanently delete ${selectedCompleted.length} tasks?`)) return

    try {
      await Promise.all(selectedCompleted.map(id => api.delete(`/todos/${id}`)))
      setTodos(prev => prev.filter(t => !selectedCompleted.includes(t.id)))
      toast.success(`Deleted ${selectedCompleted.length} tasks`)
      setSelectedCompleted([])
    } catch (error) {
      toast.error("Failed to delete tasks")
    }
  }

  // --- CRUD ---
  const onSubmit = async (data: TodoFormData) => {
    try {
      if (editingTodo) {
        await api.put(`/todos/${editingTodo.id}`, data)
        setTodos(
          todos.map((t) =>
            t.id === editingTodo.id
              ? { ...t, ...data, updatedAt: new Date().toISOString() }
              : t
          )
        )
        toast.success("Todo updated successfully")
      } else {
        const response = await api.post("/todos", data)
        setTodos([...todos, response.data])
        toast.success("Todo created successfully")
      }
      reset()
      setEditingTodo(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to save todo")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/todos/${id}`)
        setTodos(todos.filter((t) => t.id !== id))
        toast.success("Todo deleted successfully")
      } catch (error) {
        toast.error("Failed to delete todo")
      }
    }
  }

  const toggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === "completed" ? "pending" : "completed"
    try {
      await api.put(`/todos/${todo.id}`, { ...todo, status: newStatus })
      setTodos(todos.map((t) => t.id === todo.id ? { ...t, status: newStatus } : t))
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    reset({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      assignedTo: todo.assignedTo,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingTodo(null)
    reset()
    setIsDialogOpen(true)
  }

  const getAssigneeName = (userId?: string) => {
    if (!userId) return null
    const user = users.find(u => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "Unknown"
  }

  if (loading) return <div className="p-8 text-center" style={{ color: 'var(--text-color)' }}>Loading tasks...</div>

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        {selectedActive.length > 0 && (
          <div className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between bg-primary px-6 text-primary-foreground animate-in slide-in-from-top-full duration-200 shadow-md">
            <div className="flex items-center gap-4">
              <span className="font-medium">{selectedActive.length} active selected</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedActive([])}
                className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select onValueChange={(val: any) => handleBulkUpdateActive({ priority: val })}>
                <SelectTrigger className="w-[130px] border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                  <SelectValue placeholder="Set Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(val: any) => handleBulkUpdateActive({ status: val })}>
                <SelectTrigger className="w-[130px] border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                  <SelectValue placeholder="Set Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => handleBulkUpdateActive({ assignedTo: val === 'unassigned' ? undefined : val })}>
                <SelectTrigger className="w-[150px] border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                  <SelectValue placeholder="Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox 
              checked={activeTodos.length > 0 && selectedActive.length === activeTodos.length}
              onCheckedChange={(checked) => toggleAllActive(!!checked)}
              className="border-black/50" 
            />
            <CardTitle style={{ color: 'var(--header-color)' }}>Todo List</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-shadow duration-300"
              >
                + New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTodo ? "Edit Task" : "Create New Task"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...register("description")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "unassigned"} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} ({user.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Controller
                      name="priority"
                      control={control}
                      defaultValue="medium"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue="pending"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingTodo ? "Update Task" : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {activeTodos.length === 0 && (
              <p className="text-center py-4 italic text-sm opacity-60" style={{ color: 'var(--text-color)' }}>
                No active tasks.
              </p>
            )}
            {activeTodos.map((todo) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                isSelected={selectedActive.includes(todo.id)}
                onSelect={(checked) => toggleSelectActive(todo.id, checked)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={toggleStatus}
                getAssigneeName={getAssigneeName}
              />
            ))}
          </div>

          {completedTodos.length > 0 && (
            <div className="mt-8 border-t border-black/10 pt-4">
              <div className="flex items-center gap-4 mb-2">
                <Checkbox 
                  checked={completedTodos.length > 0 && selectedCompleted.length === completedTodos.length}
                  onCheckedChange={(checked) => toggleAllCompleted(!!checked)}
                  className="border-black/50"
                />
                
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                  className="flex-1 flex justify-between items-center text-muted-foreground hover:text-foreground group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Completed ({completedTodos.length})
                  </span>
                  {isCompletedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>

              {selectedCompleted.length > 0 && (
                <div className="mb-4 flex items-center justify-between bg-muted/50 p-2 rounded-lg border border-black/5 animate-in fade-in duration-200">
                  <span className="text-sm font-medium px-2 text-muted-foreground">
                    {selectedCompleted.length} selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleBulkRestore}
                      className="bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                    >
                      <RotateCcw className="mr-2 h-3.5 w-3.5" /> Restore
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleBulkDeleteCompleted}
                      className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              )}
              
              {isCompletedOpen && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {completedTodos.map((todo) => (
                    <TodoItem 
                      key={todo.id} 
                      todo={todo} 
                      isSelected={selectedCompleted.includes(todo.id)}
                      onSelect={(checked) => toggleSelectCompleted(todo.id, checked)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={toggleStatus}
                      getAssigneeName={getAssigneeName}
                      isCompleted
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onToggleStatus: (todo: Todo) => void
  getAssigneeName: (id?: string) => string | null
  isCompleted?: boolean
}

function TodoItem({ 
  todo, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  getAssigneeName, 
  isCompleted = false 
}: TodoItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg transition-colors group",
      "border border-black/10 bg-black/5 hover:bg-black/10",
      isSelected && "border-primary bg-primary/5"
    )}>
      
      <div className="flex items-center gap-4">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(!!checked)}
          className="border-black/50" 
        />
        <button onClick={() => onToggleStatus(todo)} title="Toggle status">
          {todo.status === "completed" ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : todo.status === "in-progress" ? (
            <Clock className="h-6 w-6 text-yellow-500" />
          ) : (
            <Circle className="h-6 w-6" style={{ color: 'var(--text-color)', opacity: 0.7 }} />
          )}
        </button>
        <div>
          <h3 
            className={cn(
              "font-medium transition-all",
              isCompleted ? "line-through opacity-50" : ""
            )}
            style={{ color: 'var(--text-color)' }}
          >
            {todo.title}
          </h3>
          <p 
            className="text-sm mt-0.5" 
            style={{ color: 'var(--text-color)', opacity: isCompleted ? 0.5 : 0.7 }}
          >
            {todo.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
          {/* Assignee Badge - Render conditional, always takes space if not there to maintain alignment if needed, but here simple rendering */}
          {todo.assignedTo && todo.assignedTo !== "unassigned" && (
            <div className={cn(
              "text-xs px-3 py-1.5 rounded-md font-medium select-none backdrop-blur-sm",
              isCompleted ? "bg-muted text-muted-foreground" : "bg-gray-100/80 text-gray-700"
            )}>
              assigned to : <span className="font-bold">{getAssigneeName(todo.assignedTo)}</span>
            </div>
          )}

          {/* Priority Badge - Always Rendered */}
          <div className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
            todo.priority === 'high' ? "bg-red-50 text-red-600 border-red-200" :
            todo.priority === 'medium' ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
            "bg-green-50 text-green-600 border-green-200",
            isCompleted && "opacity-50 grayscale"
          )}>
            {todo.priority} Priority
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(todo)}>
            <Pencil className="h-4 w-4" style={{ color: 'var(--text-color)' }} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-4 w-4" style={{ color: 'var(--text-color)' }} />
          </Button>
        </div>
      </div>
    </div>
  )
}