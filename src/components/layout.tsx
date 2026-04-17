import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  LogOut, 
  Menu, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppBreadcrumbs } from "@/components/breadcrumbs"
import { getDashboardTitle, getBackgroundColor } from "@/lib/settings"
import { cn } from "@/lib/utils"

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [dashboardTitle, setDashboardTitle] = useState(getDashboardTitle())
  const [backgroundColor, setBackgroundColor] = useState(getBackgroundColor())

  const showSidebar = sidebarOpen || isHovered

  useEffect(() => {
    const updateSettings = () => {
      setDashboardTitle(getDashboardTitle())
      // Fix: Ensure background color is also updated on event
      setBackgroundColor(getBackgroundColor())
    }
    updateSettings()
    
    // Listen for custom event within same window (for immediate updates)
    window.addEventListener("settings-change", updateSettings)
    // Listen for storage event (for cross-tab updates)
    window.addEventListener("storage", updateSettings)
    
    return () => {
      window.removeEventListener("settings-change", updateSettings)
      window.removeEventListener("storage", updateSettings)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ListTodo, label: "Todo", path: "/todos" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      {/* Fix: Added style prop to dynamically change background color with opacity */}
      <div 
        className="absolute inset-0 z-0 transition-colors duration-300"
        style={{ 
          backgroundColor: backgroundColor,
          opacity: 0.7 // High opacity to make the background color effective but keep video context if needed
        }}
      />

      {/* --- SIDEBAR MECHANISM --- */}
      {!sidebarOpen && (
        <div 
          className="fixed left-0 top-0 bottom-0 w-6 z-50 cursor-pointer hover:bg-white/5 transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          title="Hover to show menu"
        />
      )}

      <aside
        onMouseEnter={() => !sidebarOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed top-0 left-0 h-full border-r border-white/10 flex flex-col z-50",
          "bg-white/50 backdrop-blur-md transition-transform duration-300 ease-in-out w-64",
          showSidebar ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-16">
          <h1 className="text-xl font-semibold text-gray-900">{dashboardTitle}</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
                  isActive(item.path)
                    ? "bg-black/80 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "text-gray-800 hover:bg-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Layout Spacer */}
      <div 
        className={cn(
          "shrink-0 transition-all duration-300 ease-in-out relative z-10",
          showSidebar ? "w-64" : "w-0" 
        )} 
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-white/50 backdrop-blur-md shrink-0 transition-all duration-300">
          <div className="flex items-center gap-4">
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex hover:bg-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "md:hidden hover:bg-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300",
                !sidebarOpen ? "hidden" : "flex"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-gray-900 text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-sm">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          <div className="flex flex-col gap-6">
            <div className="w-fit px-4 py-2 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 transition-all duration-300 ease-in-out hover:bg-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <AppBreadcrumbs />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                // CHANGED: Reduced duration for faster switching
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
            
          </div>
        </main>
      </div>
    </div>
  )
}