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

export const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

export function getErrorMessage(err: unknown, fallbackMessage: string): string {
  if (err instanceof Error && err.message) {
    const normalized = err.message.toLowerCase()
    if (
      normalized.includes('failed to fetch') ||
      normalized.includes('networkerror') ||
      normalized.includes('load failed') ||
      normalized.includes('network request failed')
    ) {
      return NETWORK_ERROR_MESSAGE
    }
    return err.message
  }
  return fallbackMessage
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

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE)
  }

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {}
    throw new Error(getErrorMessage(new Error(errorMessage), errorMessage))
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
