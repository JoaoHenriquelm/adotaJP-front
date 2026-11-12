import React, { createContext, useContext, useEffect, useState } from 'react'
import type { UserProfile } from '../types'
import { authApi, type LoginDTO, type RegisterDTO } from '../api/auth.api'
import { favoritesApi } from '../api/favorites.api'
import { getAuthToken, removeAuthToken, setAuthToken } from '../api/client'

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginDTO) => Promise<void>
  register: (data: RegisterDTO) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isFavorite: (animalPostId: string) => boolean
  toggleFavorite: (animalPostId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(getAuthToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshUser = async () => {
    try {
      if (getAuthToken()) {
        const profile = await authApi.getMe()
        setUser(profile)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.warn('Sessão expirada ou inválida:', err)
      removeAuthToken()
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await refreshUser()
      }
      setIsLoading(false)
    }
    initAuth()
  }, [token])

  const login = async (data: LoginDTO) => {
    const res = await authApi.login(data)
    setAuthToken(res.accessToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  const register = async (data: RegisterDTO) => {
    await authApi.register(data)
    await login({ email: data.email, password: data.password })
  }

  const logout = () => {
    removeAuthToken()
    setToken(null)
    setUser(null)
  }

  const isFavorite = (animalPostId: string): boolean => {
    if (!user || !user.favoriteAnimals) return false
    return user.favoriteAnimals.includes(animalPostId)
  }

  const toggleFavorite = async (animalPostId: string): Promise<void> => {
    if (!user) {
      throw new Error('Você precisa estar logado para favoritar um animal.')
    }

    const currentlyFavorite = isFavorite(animalPostId)

    const updatedFavorites = currentlyFavorite
      ? user.favoriteAnimals.filter((id) => id !== animalPostId)
      : [...user.favoriteAnimals, animalPostId]

    setUser({ ...user, favoriteAnimals: updatedFavorites })

    try {
      if (currentlyFavorite) {
        await favoritesApi.removeFavorite(animalPostId)
      } else {
        await favoritesApi.addFavorite(animalPostId)
      }
    } catch (err) {
      setUser(user)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
