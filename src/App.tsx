import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout"
import { DashboardPage } from "@/pages/Dashboard"
import { TodosPage } from "@/pages/Todos"
import { UsersPage } from "@/pages/Users"
import { SettingsPage } from "@/pages/Settings"
import { LoginPage } from "@/pages/Login"
import { Toaster } from "@/components/ui/toaster"
import { 
  getBackgroundColor, 
  getHeaderColor, 
  getTextColor,
  getFontFamily
} from "@/lib/settings"

// A simple wrapper to protect routes based on local storage
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // Check our simple local flag
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export function App() {
  useEffect(() => {
    // Apply all visual settings on load
    try {
      const root = document.documentElement;
      document.body.style.backgroundColor = getBackgroundColor();
      
      // Apply saved colors or defaults
      root.style.setProperty('--header-color', getHeaderColor());
      root.style.setProperty('--text-color', getTextColor());
      
      // Apply saved font
      root.style.setProperty('--font-sans', `'${getFontFamily()}', sans-serif`);
      
    } catch (error) {
      console.error("Error applying settings:", error)
    }
    console.log("App running in Guest/Frontend Mode")
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="todos" element={<TodosPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App