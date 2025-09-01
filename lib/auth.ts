export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock user data for demonstration
const mockUsers: Record<string, { email: string; password: string; name: string }> = {
  user1: {
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
  },
  user2: {
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
  },
}

export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userEntry = Object.entries(mockUsers).find(([_, userData]) => userData.email === email)

  if (!userEntry || userEntry[1].password !== password) {
    throw new Error("Invalid email or password")
  }

  const [userId, userData] = userEntry

  return {
    id: userId,
    email: userData.email,
    name: userData.name,
    createdAt: new Date(),
  }
}

export const mockSignup = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = Object.values(mockUsers).find((userData) => userData.email === email)
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // Create new user
  const newUserId = `user${Object.keys(mockUsers).length + 1}`
  mockUsers[newUserId] = { email, password, name }

  return {
    id: newUserId,
    email,
    name,
    createdAt: new Date(),
  }
}

export const mockLogout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
}
