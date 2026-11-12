import React from 'react'
import { Heart, Scale, Calendar, Syringe, AlertTriangle, RefreshCw, CheckCheck, User, Trash2, Pencil } from 'lucide-react'
import type { AnimalPost } from '../types'
import { getImageUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { ExpirationBadge } from './ExpirationBadge'

interface Props {
  animal: AnimalPost
  onAdoptClick?: (animal: AnimalPost) => void
  isOwnerView?: boolean
  onRenew?: (id: string) => void
  onMarkAdopted?: (id: string) => void
  onEdit?: (animal: AnimalPost) => void
  onDelete?: (animal: AnimalPost) => void
  onPromptAuth?: () => void
}

export const AnimalCard: React.FC<Props> = ({
  animal,
  onAdoptClick,
  isOwnerView = false,
  onRenew,
  onMarkAdopted,
  onEdit,
  onDelete,
  onPromptAuth,
}) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth()
  const favorited = isFavorite(animal.id)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      if (onPromptAuth) onPromptAuth()
      return
    }
    try {
      await toggleFavorite(animal.id)
    } catch (err) {
      console.error('Falha ao favoritar:', err)
    }
  }

  const formatAge = (age: number, unit: string) => {
    const isPlural = age !== 1
    if (unit === 'YEARS') {
      return `${age} ${isPlural ? 'anos' : 'ano'}`
    }
    if (unit === 'DAYS') {
      return `${age} ${isPlural ? 'dias' : 'dia'}`
    }
    return `${age} ${isPlural ? 'meses' : 'mês'}`
  }

  return (
    <div className="group relative bg-white rounded-3xl border border-[#ebe2d3] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative aspect-4/3 bg-[#ebe2d3] overflow-hidden">
        <img
          src={getImageUrl(animal.imagePath)}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#1f0b08] shadow-xs">
            {animal.species}
          </span>
          {(isOwnerView || animal.isAdopted) && (
            <ExpirationBadge status={animal.status} isAdopted={animal.isAdopted} />
          )}
        </div>

        {!isOwnerView && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-xs transition-all shadow-md cursor-pointer ${
              favorited
                ? 'bg-[#f26b45] text-white scale-110'
                : 'bg-white/80 hover:bg-white text-[#6a5c53] hover:text-[#f26b45]'
            }`}
            title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-label="Favoritar"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {isOwnerView && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(animal)
            }}
            className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/95 hover:bg-[#f7efe2] text-[#1f0b08] hover:text-[#f26b45] shadow-md transition-all cursor-pointer border border-[#ebe2d3] hover:scale-105"
            title="Editar informações da publicação"
            aria-label="Editar publicação"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xl font-bold text-[#1f0b08] truncate">{animal.name}</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#f7efe2] text-[#6a5c53] rounded-lg">
              {formatAge(animal.age, animal.ageUnit)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6a5c53] mb-3">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#f26b45]" />
              {animal.weight} kg
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#3dac91]" />
              Publicado em {new Date(animal.publishedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {animal.vaccines && (
              <p className="flex items-start gap-1.5 text-[#2c836e] bg-[#3dac91]/10 px-2.5 py-1.5 rounded-xl line-clamp-1">
                <Syringe className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Vacinas: {animal.vaccines}</span>
              </p>
            )}

            {animal.illnesses && (
              <p className="flex items-start gap-1.5 text-[#96503f] bg-[#96503f]/10 px-2.5 py-1.5 rounded-xl line-clamp-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Cuidados: {animal.illnesses}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-[#ebe2d3]/60">
          {!isOwnerView ? (
            <div className="space-y-3">
              {animal.owner && (
                <div className="flex items-center gap-1.5 text-xs text-[#6a5c53]">
                  <User className="w-3.5 h-3.5 text-[#f26b45]" />
                  <span>Tutor: {animal.owner.name}</span>
                </div>
              )}

              <button
                onClick={() => onAdoptClick && onAdoptClick(animal)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Quero Adotar
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {!animal.isAdopted && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onRenew && onRenew(animal.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#3dac91]/15 hover:bg-[#3dac91]/25 text-[#2c836e] font-semibold text-xs border border-[#3dac91]/30 transition-colors cursor-pointer"
                    title="Renova o prazo por mais 30 dias"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Renovar (+30d)
                  </button>

                  <button
                    onClick={() => onMarkAdopted && onMarkAdopted(animal.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#96503f]/15 hover:bg-[#96503f]/25 text-[#96503f] font-semibold text-xs border border-[#96503f]/30 transition-colors cursor-pointer"
                    title="Marca o animal como adotado e retira das buscas"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Já foi Adotado
                  </button>
                </div>
              )}

              {animal.isAdopted && (
                <div className="text-center text-xs font-bold text-emerald-800 py-2.5 px-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 shadow-2xs">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Animal adotado com sucesso! Publicação finalizada.</span>
                </div>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(animal)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 font-semibold text-xs border border-red-200 transition-colors cursor-pointer"
                  title="Excluir esta publicação permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir Publicação
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
