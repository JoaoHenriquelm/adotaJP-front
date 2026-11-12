import { apiRequest } from './client'
import type { AuthResponse, UserProfile } from '../types'

export interface RegisterDTO {
  name: string
  email: string
  cpf: string
  birthDate: string
  phone: string
  address: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface UpdateProfileDTO {
  phone?: string
  address?: string
}

export const authApi = {
  async register(data: RegisterDTO): Promise<UserProfile> {
    return apiRequest<UserProfile>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    })
  },

  async login(data: LoginDTO): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    })
  },

  async getMe(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/users/me', {
      method: 'GET',
    })
  },

  async updateMe(data: UpdateProfileDTO): Promise<UserProfile> {
    return apiRequest<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}
