"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "@/lib/auth"
import { mockLogin, mockSignup, mockLogout } from "@/lib/auth"

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; user: User }
  | { type: "LOGIN_ERROR" }
  | { type: "LOGOUT" }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS"; user: User }
  | { type: "SIGNUP_ERROR" }

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        user: action.user,
        isLoading: false,
        isAuthenticated: true,
      }
    case "LOGIN_ERROR":
    case "SIGNUP_ERROR":
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case "LOGOUT":
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true, // Start with loading true
    isAuthenticated: false,
  })

  // Load user from localStorage on mount, or create demo user
  useEffect(() => {
    console.log('[Auth] Initializing auth context...')
    
    // Small delay to ensure component is fully mounted
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem("kawtar-tech-store-user")
        console.log('[Auth] Saved user in localStorage:', savedUser ? 'found' : 'not found')
        
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser)
            console.log('[Auth] Parsed user:', user.name)
            dispatch({ type: "LOGIN_SUCCESS", user })
          } catch (error) {
            console.log('[Auth] Error parsing saved user, creating demo user')
            localStorage.removeItem("kawtar-tech-store-user")
            // Create demo user if localStorage is corrupted
            createDemoUser()
          }
        } else {
          console.log('[Auth] No saved user, creating demo user')
          // Create demo user for testing purposes
          createDemoUser()
        }
      } catch (error) {
        console.error('[Auth] Error in auth initialization:', error)
        // Fallback: create demo user
        createDemoUser()
      }
    }

    // Delay initialization slightly to avoid hydration issues
    const timer = setTimeout(initAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  const createDemoUser = () => {
    console.log('[Auth] Creating demo user...')
    try {
      const demoUser = {
        id: "kawtar-user",
        email: "kawtar@kawtar-tech-store.com",
        name: "Kawtar",
        preferences: {
          theme: "light" as const,
          notifications: true,
          newsletter: true
        }
      }
      localStorage.setItem("kawtar-tech-store-user", JSON.stringify(demoUser))
      dispatch({ type: "LOGIN_SUCCESS", user: demoUser })
      console.log('[Auth] Demo user created and logged in:', demoUser.name)
    } catch (error) {
      console.error('[Auth] Failed to create demo user:', error)
      // Even if localStorage fails, at least set the user in state
      const demoUser = {
        id: "kawtar-user",
        email: "kawtar@kawtar-tech-store.com",
        name: "Kawtar",
        preferences: {
          theme: "light" as const,
          notifications: true,
          newsletter: true
        }
      }
      dispatch({ type: "LOGIN_SUCCESS", user: demoUser })
    }
  }

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const user = await mockLogin(email, password)
      localStorage.setItem("kawtar-tech-store-user", JSON.stringify(user))
      dispatch({ type: "LOGIN_SUCCESS", user })
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR" })
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    dispatch({ type: "SIGNUP_START" })
    try {
      const user = await mockSignup(email, password, name)
      localStorage.setItem("kawtar-tech-store-user", JSON.stringify(user))
      dispatch({ type: "SIGNUP_SUCCESS", user })
    } catch (error) {
      dispatch({ type: "SIGNUP_ERROR" })
      throw error
    }
  }

  const logout = async () => {
    await mockLogout()
    localStorage.removeItem("kawtar-tech-store-user")
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
