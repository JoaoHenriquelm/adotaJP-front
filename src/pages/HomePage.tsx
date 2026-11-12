import React, { useEffect, useState } from 'react'
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import type { AnimalPost } from '../types'
import { animalApi } from '../api/animal.api'
import { SPECIES_OPTIONS } from '../constants/species'
import { AnimalCard } from '../components/AnimalCard'
import { AdoptModal } from '../components/AdoptModal'

interface Props {
  onOpenVeterinaryModal: () => void
  onPromptAuth: () => void
}

export const HomePage: React.FC<Props> = ({ onPromptAuth }) => {
  const [animals, setAnimals] = useState<AnimalPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSpecies, setSelectedSpecies] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [selectedAnimalForAdopt, setSelectedAnimalForAdopt] = useState<AnimalPost | null>(null)

  const fetchAnimals = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await animalApi.listAvailable({
        page,
        limit: 9,
        species: selectedSpecies || undefined,
      })
      setAnimals(res.data)
      setTotalPages(res.totalPages)
      setTotalCount(res.total)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os animais no momento.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [page, selectedSpecies])

  const filteredAnimals = animals.filter((animal) => {
    if (!searchTerm.trim()) return true
    return animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-12">
      <section className="bg-white p-5 rounded-3xl border border-[#ebe2d3] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6a5c53]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do animal..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] placeholder:text-[#6a5c53]/70 focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedSpecies}
              onChange={(e) => {
                setSelectedSpecies(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm font-semibold text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] cursor-pointer"
            >
              <option value="">Todas as Espécies</option>
              {SPECIES_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedSpecies || searchTerm) && (
            <button
              onClick={() => {
                setSelectedSpecies('')
                setSearchTerm('')
                setPage(1)
              }}
              className="px-4 py-2.5 rounded-2xl border border-[#ebe2d3] text-xs font-semibold text-[#6a5c53] hover:bg-[#f7efe2] transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-[#6a5c53] pt-1 px-1">
          <span>
            Mostrando <strong>{filteredAnimals.length}</strong> de <strong>{totalCount}</strong>{' '}
            animais disponíveis
          </span>
          {selectedSpecies && (
            <span className="flex items-center gap-1 font-semibold text-[#f26b45]">
              <Filter className="w-3.5 h-3.5" /> Filtrado por: {selectedSpecies}
            </span>
          )}
        </div>
      </section>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6a5c53]">
          <Loader2 className="w-8 h-8 text-[#f26b45] animate-spin" />
          <p className="text-sm font-medium">Buscando animais disponíveis em João Pessoa...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={fetchAnimals}
            className="px-5 py-2.5 rounded-2xl bg-[#f26b45] text-white text-sm font-semibold shadow-md cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredAnimals.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-[#ebe2d3] text-center p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#f7efe2] text-[#f26b45] flex items-center justify-center mx-auto text-2xl font-bold">
            🐾
          </div>
          <h3 className="text-xl font-bold text-[#1f0b08]">Nenhum animal encontrado</h3>
          <p className="text-sm text-[#6a5c53] max-w-md mx-auto">
            Não encontramos nenhum animal cadastrado com esses filtros no momento. Tente buscar
            por outra espécie ou volte mais tarde!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onAdoptClick={(target) => setSelectedAnimalForAdopt(target)}
              onPromptAuth={onPromptAuth}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-2xl border border-[#ebe2d3] bg-white text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2] transition-colors disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-[#6a5c53]">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-2xl border border-[#ebe2d3] bg-white text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2] transition-colors disabled:opacity-40 cursor-pointer"
          >
            Próxima
          </button>
        </div>
      )}

      <AdoptModal
        animal={selectedAnimalForAdopt}
        onClose={() => setSelectedAnimalForAdopt(null)}
      />
    </div>
  )
}
