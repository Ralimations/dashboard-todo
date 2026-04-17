import { z } from "zod"

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// User Schema
const nameSchema = z
  .string()
  .min(1, "This field is required")
  .regex(/^[A-Za-z\s]+$/, "Name must not contain numbers")

export const userSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
})

export type UserFormData = z.infer<typeof userSchema>

// UPDATE: Added assignedTo to Todo Schema
export const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().optional(),
})

export type TodoFormData = z.infer<typeof todoSchema>

// Project Schema
const projectNameSchema = z
  .string()
  .min(1, "Project name is required")
  .regex(/^[A-Za-z\s]+$/, "Project name must not contain numbers")

export const projectSchema = z.object({
  name: projectNameSchema,
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "archived"]),
})

export type ProjectFormData = z.infer<typeof projectSchema>