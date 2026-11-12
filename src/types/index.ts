export type AgeUnit = 'DAYS' | 'MONTHS' | 'YEARS'

export interface PopulatedOwner {
  id: string
  name: string
  email: string
  phone: string
}

export interface AnimalPost {
  id: string
  name: string
  species: string
  age: number
  ageUnit: AgeUnit
  weight: number
  vaccines: string
  illnesses: string
  status: boolean
  isAdopted: boolean
  publishedAt: string
  returnDate: string
  imagePath: string
  owner?: PopulatedOwner
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  birthDate: string
  phone: string
  address: string
  favoriteAnimals: string[]
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: UserProfile
}
