// Settings storage keys
const SETTINGS_KEYS = {
  DASHBOARD_TITLE: "dashboard_title",
  BACKGROUND_COLOR: "background_color",
  HEADER_COLOR: "header_color",
  TEXT_COLOR: "text_color",
  FONT_FAMILY: "font_family", // New key
}

// Default values
const DEFAULTS = {
  DASHBOARD_TITLE: "Dashboard",
  BACKGROUND_COLOR: "#f9fafb", // gray-50
  HEADER_COLOR: "#000000", // pure black
  TEXT_COLOR: "#374151", // gray-700
  FONT_FAMILY: "Inter", // Default font
}

// Get setting with default fallback
export const getSetting = (key: string, defaultValue: string): string => {
  if (typeof window === "undefined") return defaultValue
  return localStorage.getItem(key) || defaultValue
}

// Set setting
export const setSetting = (key: string, value: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, value)
  // Dispatch a custom event to notify components within the same window/tab
  window.dispatchEvent(new Event("settings-change"))
}

// Dashboard title
export const getDashboardTitle = (): string => {
  return getSetting(SETTINGS_KEYS.DASHBOARD_TITLE, DEFAULTS.DASHBOARD_TITLE)
}

export const setDashboardTitle = (title: string): void => {
  setSetting(SETTINGS_KEYS.DASHBOARD_TITLE, title)
}

// Background color
export const getBackgroundColor = (): string => {
  return getSetting(SETTINGS_KEYS.BACKGROUND_COLOR, DEFAULTS.BACKGROUND_COLOR)
}

export const setBackgroundColor = (color: string): void => {
  setSetting(SETTINGS_KEYS.BACKGROUND_COLOR, color)
}

// --- NEW FUNCTIONS (Must be present to fix white screen) ---

export const getHeaderColor = (): string => {
  return getSetting(SETTINGS_KEYS.HEADER_COLOR, DEFAULTS.HEADER_COLOR)
}

export const setHeaderColor = (color: string): void => {
  setSetting(SETTINGS_KEYS.HEADER_COLOR, color)
}

export const getTextColor = (): string => {
  return getSetting(SETTINGS_KEYS.TEXT_COLOR, DEFAULTS.TEXT_COLOR)
}

export const setTextColor = (color: string): void => {
  setSetting(SETTINGS_KEYS.TEXT_COLOR, color)
}

// --- Font Settings ---

export const getFontFamily = (): string => {
  return getSetting(SETTINGS_KEYS.FONT_FAMILY, DEFAULTS.FONT_FAMILY)
}

export const setFontFamily = (font: string): void => {
  setSetting(SETTINGS_KEYS.FONT_FAMILY, font)
}

// Reset all settings to defaults
export const resetSettings = (): void => {
  setDashboardTitle(DEFAULTS.DASHBOARD_TITLE)
  setBackgroundColor(DEFAULTS.BACKGROUND_COLOR)
  setHeaderColor(DEFAULTS.HEADER_COLOR)
  setTextColor(DEFAULTS.TEXT_COLOR)
  setFontFamily(DEFAULTS.FONT_FAMILY)
}