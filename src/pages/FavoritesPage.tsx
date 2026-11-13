import React, { useEffect, useState } from 'react'
import { Heart, Loader2, AlertCircle } from 'lucide-react'
import type { AnimalPost } from '../types'
import { favoritesApi } from '../api/favorites.api'
import { getErrorMessage } from '../api/client'
import { AnimalCard } from '../components/AnimalCard'
import { AdoptModal } from '../components/AdoptModal'

interface Props {
  onNavigateHome: () => void
}

export const FavoritesPage: React.FC<Props> = ({ onNavigateHome }) => {
  const [animals, setAnimals] = useState<AnimalPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnimalForAdopt, setSelectedAnimalForAdopt] = useState<AnimalPost | null>(null)

  const fetchFavorites = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await favoritesApi.listFavorites({ limit: 50 })
      setAnimals(res.data)
    } catch (err) {
      setError(getErrorMessage(err, 'Falha ao carregar seus favoritos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#ebe2d3]">
        <div className="flex items-center gap-2.5 mb-1">
          <Heart className="w-7 h-7 text-[#f26b45] fill-current" />
          <h1 className="text-3xl font-black text-[#1f0b08]">Meus Favoritos</h1>
        </div>
        <p className="text-sm text-[#6a5c53]">
          Animais que você salvou para acompanhar ou entrar em contato com o tutor.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6a5c53]">
          <Loader2 className="w-8 h-8 text-[#f26b45] animate-spin" />
          <p className="text-sm font-medium">Buscando seus favoritos...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-[#ebe2d3] text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f7efe2] text-[#f26b45] flex items-center justify-center mx-auto text-2xl font-bold">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1f0b08]">Nenhum favorito ainda</h3>
          <p className="text-sm text-[#6a5c53] max-w-md mx-auto">
            Você ainda não favoritou nenhum animal. Navegue pelo catálogo e clique no coração
            para salvar os pets que tocarem seu coração!
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3 rounded-2xl bg-[#f26b45] text-white font-bold text-sm shadow-md cursor-pointer"
          >
            Ver Animais Disponíveis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onAdoptClick={(target) => setSelectedAnimalForAdopt(target)}
            />
          ))}
        </div>
      )}

      <AdoptModal
        animal={selectedAnimalForAdopt}
        onClose={() => setSelectedAnimalForAdopt(null)}
      />
    </div>
  )
}
