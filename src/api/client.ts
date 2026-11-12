export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:1000'

export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${API_BASE_URL}${cleanPath}`
}

export function getAuthToken(): string | null {
  return localStorage.getItem('adotajp_token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('adotajp_token', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('adotajp_token')
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers = new Headers(options.headers || {})

  if (options.requiresAuth !== false) {
    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {}
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
