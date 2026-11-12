import { apiRequest } from './client'
import type { AnimalPost, PaginatedResult } from '../types'

export const favoritesApi = {
  async listFavorites(query: { page?: number; limit?: number } = {}): Promise<PaginatedResult<AnimalPost>> {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))

    const queryString = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<PaginatedResult<AnimalPost>>(`/users/me/favorites${queryString}`, {
      method: 'GET',
    })
  },

  async addFavorite(animalPostId: string): Promise<void> {
    await apiRequest(`/users/me/favorites/${animalPostId}`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },

  async removeFavorite(animalPostId: string): Promise<void> {
    await apiRequest(`/users/me/favorites/${animalPostId}`, {
      method: 'DELETE',
    })
  },
}
