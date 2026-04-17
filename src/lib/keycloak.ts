// MOCK KEYCLOAK IMPLEMENTATION
// This file replaces the real keycloak-js to allow the app to run
// in "Frontend Only" mode without a backend connection.

const mockKeycloak = {
  init: () => {
    console.log("[Mock Keycloak] Init called - skipping backend connection")
    return Promise.resolve(true)
  },
  login: () => {
    console.log("[Mock Keycloak] Login called")
    return Promise.resolve()
  },
  logout: () => {
    console.log("[Mock Keycloak] Logout called")
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/login"
    return Promise.resolve()
  },
  authenticated: true,
  token: "mock-token-12345",
  updateToken: () => Promise.resolve(true),
  isTokenExpired: () => false,
  tokenParsed: {
    preferred_username: "Guest User",
    email: "guest@example.com",
    name: "Guest Admin",
    given_name: "Guest",
    family_name: "Admin",
    realm_access: {
      roles: ["admin", "user"]
    }
  }
}

// Export mock functions matching the original interface
export const initKeycloak = () => Promise.resolve(true)
export const login = () => Promise.resolve()
export const logout = () => {
  localStorage.removeItem("isAuthenticated")
  window.location.href = "/login"
}
export const getToken = () => "mock-token-12345"
export const isAuthenticated = () => true
export const getUserInfo = () => mockKeycloak.tokenParsed
export const refreshToken = () => Promise.resolve(true)

// Default export
export default mockKeycloak