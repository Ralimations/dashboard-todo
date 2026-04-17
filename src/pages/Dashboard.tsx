import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api, { type Todo } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function DashboardPage() {
  const navigate = useNavigate()
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalTodos, setTotalTodos] = useState(0)
  const [completedTodos, setCompletedTodos] = useState(0) // New state for completed count
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // CHANGED: Fetch full 'todos' list to calculate completed status
        const [usersRes, todosRes] = await Promise.all([
          api.get('/users/count'),
          api.get('/todos'), 
        ])

        setTotalUsers(usersRes.data.count)
        
        const todos = todosRes.data as Todo[]
        setTotalTodos(todos.length)
        // Calculate completed tasks
        setCompletedTodos(todos.filter(t => t.status === 'completed').length)

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Users Card */}
        <Card 
          className="shadow-md cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.99] group"
          onClick={() => navigate("/users")}
        >
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors duration-300"
              style={{ color: 'var(--header-color)' }}
            >
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div 
                  className="text-4xl font-bold group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300"
                  style={{ color: 'var(--text-color)' }}
                >
                  {totalUsers}
                </div>
                <p 
                  className="text-xs mt-1 opacity-70"
                  style={{ color: 'var(--text-color)' }}
                >
                  Active registered users
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Todos Card */}
        <Card 
          className="shadow-md cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.99] group"
          onClick={() => navigate("/todos")}
        >
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors duration-300"
              style={{ color: 'var(--header-color)' }}
            >
              Total Todo Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div 
                  className="text-4xl font-bold group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300"
                  style={{ color: 'var(--text-color)' }}
                >
                  {totalTodos}
                </div>
                <div className="flex flex-col mt-1">
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Tasks in the system
                  </p>
                  {/* NEW: Tiny text showing completion progress */}
                  <p 
                    className="text-[10px] mt-0.5 opacity-60 font-medium"
                    style={{ color: 'var(--text-color)' }}
                  >
                    completed {completedTodos} out of {totalTodos} tasks
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}