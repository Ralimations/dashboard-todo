export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

// UPDATE: Add 'assignedTo' field
export interface Todo {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo?: string // Stores the User ID
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "archived"
  createdAt: string
}

// Mock Users Data
export const initialUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Admin",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "User",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.j@example.com",
    role: "Manager",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.w@example.com",
    role: "User",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    role: "Developer",
    createdAt: "2024-02-15",
  },
]

// Mock Todos Data (Updated with assignments)
export const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new feature",
    status: "in-progress",
    priority: "high",
    assignedTo: "1", // Assigned to John Doe
    createdAt: "2024-03-01",
    updatedAt: "2024-03-05",
  },
  {
    id: "2",
    title: "Review code pull requests",
    description: "Review and approve pending pull requests from team",
    status: "pending",
    priority: "medium",
    assignedTo: "3", // Assigned to Michael Johnson
    createdAt: "2024-03-02",
    updatedAt: "2024-03-02",
  },
  {
    id: "3",
    title: "Update user interface",
    description: "Implement new design system components",
    status: "completed",
    priority: "high",
    createdAt: "2024-02-28",
    updatedAt: "2024-03-03",
  },
  {
    id: "4",
    title: "Fix authentication bug",
    description: "Resolve issue with token expiration",
    status: "pending",
    priority: "high",
    assignedTo: "2", // Assigned to Jane Smith
    createdAt: "2024-03-04",
    updatedAt: "2024-03-04",
  },
  {
    id: "5",
    title: "Schedule team meeting",
    description: "Organize sprint planning meeting",
    status: "completed",
    priority: "low",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-02",
  },
]

// Mock Projects Data
export const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of company website",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Build iOS and Android mobile applications",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integrate third-party payment API",
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: "4",
    name: "Legacy System Migration",
    description: "Migrate old database to new system",
    status: "archived",
    createdAt: "2023-12-01",
  },
]