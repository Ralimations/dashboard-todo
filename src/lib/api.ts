import axios from "axios"
import { initialUsers, initialTodos, initialProjects, type User, type Todo, type Project } from "@/data/mockData"

// 1. Define Types (Preserved)
export type { User, Todo, Project }

// 2. In-Memory Database (Resets on page refresh)
let dbUsers = [...initialUsers]
let dbTodos = [...initialTodos]
let dbProjects = [...initialProjects]

// Helper to simulate network delay
// CHANGED: Reduced delay to 0ms for instant feedback
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 3. Create Axios Instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Virtual base URL
  headers: {
    "Content-Type": "application/json",
  },
})

// 4. Add Interceptor to Mock Responses
api.interceptors.request.use(
  async (config) => {
    // console.log(`[Frontend API] ${config.method?.toUpperCase()} ${config.url}`)
    
    // CHANGED: Removed the await delay for instant interactions
    // await delay(300) 

    // Custom Adapter to return mock data
    config.adapter = async (config) => {
      const { url, method, data } = config
      const body = data ? JSON.parse(data) : {}
      let responseData: any = {}
      const status = 200

      // --- USERS ROUTES ---
      if (url?.includes("/users")) {
        if (url.endsWith("/count")) {
          responseData = { count: dbUsers.length }
        } else if (method === "get") {
          responseData = dbUsers
        } else if (method === "post") {
          const newUser = { ...body, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString().split("T")[0] }
          dbUsers.push(newUser)
          responseData = newUser
        } else if (method === "put") {
          const id = url.split('/').pop()
          dbUsers = dbUsers.map(u => u.id === id ? { ...u, ...body } : u)
          responseData = body
        } else if (method === "delete") {
          const id = url.split('/').pop()
          dbUsers = dbUsers.filter(u => u.id !== id)
          responseData = { success: true }
        }
      }

      // --- TODOS ROUTES ---
      else if (url?.includes("/todos")) {
        if (url.endsWith("/count")) {
          responseData = { count: dbTodos.length }
        } else if (method === "get") {
          responseData = dbTodos
        } else if (method === "post") {
          const newTodo = { ...body, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          dbTodos.push(newTodo)
          responseData = newTodo
        } else if (method === "put") {
          const id = url.split('/').pop()
          const updated = { ...body, updatedAt: new Date().toISOString() }
          dbTodos = dbTodos.map(t => t.id === id ? { ...t, ...updated } : t)
          responseData = updated
        } else if (method === "delete") {
          const id = url.split('/').pop()
          dbTodos = dbTodos.filter(t => t.id !== id)
          responseData = { success: true }
        }
      }

      // --- PROJECTS ROUTES ---
      else if (url?.includes("/projects")) {
        if (url.endsWith("/count")) {
          responseData = { count: dbProjects.length }
        } else if (method === "get") {
          responseData = dbProjects
        } else if (method === "post") {
          const newProject = { ...body, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString().split("T")[0] }
          dbProjects.push(newProject)
          responseData = newProject
        } else if (method === "put") {
          const id = url.split('/').pop()
          dbProjects = dbProjects.map(p => p.id === id ? { ...p, ...body } : p)
          responseData = body
        } else if (method === "delete") {
          const id = url.split('/').pop()
          dbProjects = dbProjects.filter(p => p.id !== id)
          responseData = { success: true }
        }
      }

      return {
        data: responseData,
        status,
        statusText: "OK",
        headers: {},
        config,
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api