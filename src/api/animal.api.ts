import { apiRequest } from './client'
import type { AnimalPost, PaginatedResult } from '../types'

export interface ListAnimalQuery {
  page?: number
  limit?: number
  species?: string
}

export const animalApi = {
  async listAvailable(query: ListAnimalQuery = {}): Promise<PaginatedResult<AnimalPost>> {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))
    if (query.species) params.set('species', query.species)

    const queryString = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<PaginatedResult<AnimalPost>>(`/animal-posts${queryString}`, {
      method: 'GET',
      requiresAuth: false,
    })
  },

  async getById(id: string): Promise<AnimalPost> {
    return apiRequest<AnimalPost>(`/animal-posts/${id}`, {
      method: 'GET',
      requiresAuth: false,
    })
  },

  async create(formData: FormData): Promise<AnimalPost> {
    return apiRequest<AnimalPost>('/animal-posts', {
      method: 'POST',
      body: formData,
    })
  },

  async update(id: string, data: FormData | Partial<AnimalPost>): Promise<AnimalPost> {
    return apiRequest<AnimalPost>(`/animal-posts/${id}`, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  },

  async confirmAvailability(id: string): Promise<AnimalPost> {
    return apiRequest<AnimalPost>(`/animal-posts/${id}/confirm-availability`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
  },

  async adopt(id: string): Promise<AnimalPost> {
    return apiRequest<AnimalPost>(`/animal-posts/${id}/adopt`, {
      method: 'PATCH',
      body: JSON.stringify({ isAdopted: true }),
    })
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/animal-posts/${id}`, {
      method: 'DELETE',
    })
  },

  async listMyPosts(query: { page?: number; limit?: number } = {}): Promise<PaginatedResult<AnimalPost>> {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))

    const queryString = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<PaginatedResult<AnimalPost>>(`/users/me/animal-posts${queryString}`, {
      method: 'GET',
    })
  },
}
