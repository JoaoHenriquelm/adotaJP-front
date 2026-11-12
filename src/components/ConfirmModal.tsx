import React from 'react'
import { X, CheckCheck, Loader2, AlertCircle } from 'lucide-react'
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

export const ConfirmModal: React.FC<Props> = ({
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
          <div className="flex items-center gap-2 text-[#3dac91]">
            <div className="p-2 bg-[#3dac91]/15 rounded-xl">
              <CheckCheck className="w-5 h-5 text-[#2c836e]" />
            </div>
            <h3 className="text-xl font-bold text-[#1f0b08]">Confirmar Adoção</h3>
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

        <div className="space-y-2 text-sm text-[#6a5c53]">
          <p>
            Tem certeza de que deseja marcar <strong>{animal.name}</strong> como adotado?
          </p>
          <p className="text-xs bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
            ⚠️ <strong>Atenção:</strong> A publicação será retirada das buscas públicas de animais
            disponíveis e passará a constar como adotada na sua lista de publicações.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#3dac91] hover:bg-[#32927a] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Atualizando...</span>
              </>
            ) : (
              <>
                <CheckCheck className="w-4 h-4" />
                <span>Sim, Marcar como Adotado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
