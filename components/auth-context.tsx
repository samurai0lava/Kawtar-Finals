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
    isLoading: false,
    isAuthenticated: false,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("techstore-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOGIN_SUCCESS", user })
      } catch (error) {
        localStorage.removeItem("techstore-user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const user = await mockLogin(email, password)
      localStorage.setItem("techstore-user", JSON.stringify(user))
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
      localStorage.setItem("techstore-user", JSON.stringify(user))
      dispatch({ type: "SIGNUP_SUCCESS", user })
    } catch (error) {
      dispatch({ type: "SIGNUP_ERROR" })
      throw error
    }
  }

  const logout = async () => {
    await mockLogout()
    localStorage.removeItem("techstore-user")
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
