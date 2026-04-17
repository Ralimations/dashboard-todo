import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ShieldCheck, UserCircle } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/")
    }
  }, [navigate])

  const handleLogin = () => {
    console.log("Logging in as Guest...")
    localStorage.setItem("isAuthenticated", "true")
    navigate("/")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* OVERLAY (Optional: Adds a dark tint so text is readable) */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CONTENT (z-index ensures it sits on top of the video) */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="w-full shadow-2xl bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Frontend Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-500">
              The backend connection has been disabled. You are running in <strong>Guest Mode</strong>.
            </p>
            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-100">
              Note: All data is stored temporarily in memory. Changes will be lost if you refresh.
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} className="w-full h-11 text-base gap-2">
              <UserCircle className="h-5 w-5" />
              Enter Dashboard as Guest
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}