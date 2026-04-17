import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getDashboardTitle,
  setDashboardTitle,
  getBackgroundColor,
  setBackgroundColor,
  getHeaderColor,
  setHeaderColor,
  getTextColor,
  setTextColor,
  getFontFamily,
  setFontFamily,
  resetSettings,
} from "@/lib/settings"
import { toast } from "sonner"

export function SettingsPage() {
  const [bgColor, setBgColor] = useState(getBackgroundColor())
  const [headerColor, setHeaderColorState] = useState(getHeaderColor())
  const [textColor, setTextColorState] = useState(getTextColor())
  const [title, setTitle] = useState(getDashboardTitle())
  const [font, setFont] = useState(getFontFamily())

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setDashboardTitle(newTitle)
  }

  // Helper to update CSS variable and local storage
  const updateColorSetting = (
    value: string, 
    setter: (val: string) => void, 
    storageSetter: (val: string) => void, 
    cssVar: string
  ) => {
    setter(value)
    storageSetter(value)
    document.documentElement.style.setProperty(cssVar, value)
  }

  const handleFontChange = (value: string) => {
    setFont(value)
    setFontFamily(value)
    document.documentElement.style.setProperty('--font-sans', `'${value}', sans-serif`)
  }

  const handleReset = () => {
    resetSettings()
    
    // Refresh local state from reset defaults
    setTitle(getDashboardTitle())
    setBgColor(getBackgroundColor())
    setHeaderColorState(getHeaderColor())
    setTextColorState(getTextColor())
    setFont(getFontFamily())

    // Apply reset values to DOM
    document.body.style.backgroundColor = getBackgroundColor()
    const root = document.documentElement;
    root.style.setProperty('--header-color', getHeaderColor());
    root.style.setProperty('--text-color', getTextColor());
    root.style.setProperty('--font-sans', `'${getFontFamily()}', sans-serif`)

    toast.success("Settings reset to defaults")
  }

  useEffect(() => {
    document.body.style.backgroundColor = bgColor
    const root = document.documentElement;
    root.style.setProperty('--header-color', headerColor);
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--font-sans', `'${font}', sans-serif`);
  }, []) // Run once on mount to ensure sync

  return (
    <div className="space-y-6">
      {/* CHANGED: Wrapped the header text in a glass-effect box for better visibility */}
      <div className="w-full rounded-xl border border-white/20 bg-white/50 px-6 py-4 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--header-color)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-color)' }}>Customize your dashboard appearance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--header-color)' }}>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Dashboard Title */}
          <div className="space-y-2">
            <Label htmlFor="dashboard-title" style={{ color: 'var(--header-color)' }}>Dashboard Title</Label>
            <Input
              id="dashboard-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter dashboard title"
              style={{ color: 'var(--text-color)' }}
            />
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <Label htmlFor="font-family" style={{ color: 'var(--header-color)' }}>Font Style</Label>
            <Select value={font} onValueChange={handleFontChange}>
              <SelectTrigger className="w-full md:w-[250px]" style={{ color: 'var(--text-color)' }}>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter (Default)</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Lato">Lato</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-color)' }}>Choose the global font for the application.</p>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="background-color" style={{ color: 'var(--header-color)' }}>Background Color</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="background-color"
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value)
                  setBackgroundColor(e.target.value)
                  document.body.style.backgroundColor = e.target.value
                }}
                className="w-20 h-10 cursor-pointer p-1"
              />
              <Input
                type="text"
                value={bgColor}
                readOnly
                className="flex-1"
                style={{ color: 'var(--text-color)' }}
              />
            </div>
          </div>

          {/* Header Text Color */}
          <div className="space-y-2">
            <Label htmlFor="header-color" style={{ color: 'var(--header-color)' }}>Header Text Color</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="header-color"
                type="color"
                value={headerColor}
                onChange={(e) => updateColorSetting(e.target.value, setHeaderColorState, setHeaderColor, '--header-color')}
                className="w-20 h-10 cursor-pointer p-1"
              />
              <Input
                type="text"
                value={headerColor}
                readOnly
                className="flex-1"
                style={{ color: 'var(--text-color)' }}
              />
            </div>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-color)' }}>Controls the color of titles and headings.</p>
          </div>

          {/* Normal Text Color */}
          <div className="space-y-2">
            <Label htmlFor="text-color" style={{ color: 'var(--header-color)' }}>Normal Text Color</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => updateColorSetting(e.target.value, setTextColorState, setTextColor, '--text-color')}
                className="w-20 h-10 cursor-pointer p-1"
              />
              <Input
                type="text"
                value={textColor}
                readOnly
                className="flex-1"
                style={{ color: 'var(--text-color)' }}
              />
            </div>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-color)' }}>Controls the color of standard text and paragraphs.</p>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={handleReset} style={{ color: 'var(--text-color)' }}>
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}