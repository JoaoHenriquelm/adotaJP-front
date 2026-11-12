import React from 'react'
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import type { AnimalPost } from '../types'
import { getImageUrl } from '../api/client'

interface Props {
  isOpen: boolean
  animal: AnimalPost | null
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteModal: React.FC<Props> = ({
  isOpen,
  animal,
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !animal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#ebe2d3] overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebe2d3]">
          <div className="flex items-center gap-2 text-red-600">
            <div className="p-2 bg-red-50 rounded-xl border border-red-100">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#1f0b08]">Excluir Publicação</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#f7efe2] rounded-full transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-3 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3]">
          <img
            src={getImageUrl(animal.imagePath)}
            alt={animal.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[#1f0b08] truncate text-base">{animal.name}</h4>
            <span className="text-xs font-semibold px-2 py-0.5 bg-white text-[#f26b45] rounded-md uppercase">
              {animal.species}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm text-[#6a5c53]">
          <p>
            Tem certeza de que deseja excluir permanentemente a publicação de{' '}
            <strong className="text-[#1f0b08]">{animal.name}</strong>?
          </p>
          <div className="p-3 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Esta ação é irreversível. O cadastro do animal será removido
              definitivamente do sistema e não poderá ser recuperado.
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl border border-[#ebe2d3] text-sm font-semibold text-[#6a5c53] hover:bg-[#f7efe2] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Publicação</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
