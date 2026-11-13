import React, { useEffect, useState } from 'react'
import { PlusCircle, Loader2, AlertCircle, CheckCircle2, ListFilter, RefreshCw } from 'lucide-react'
import type { AnimalPost } from '../types'
import { animalApi } from '../api/animal.api'
import { getErrorMessage } from '../api/client'
import { AnimalCard } from '../components/AnimalCard'
import { ConfirmModal } from '../components/ConfirmModal'
import { DeleteModal } from '../components/DeleteModal'
import { EditAnimalModal } from '../components/EditAnimalModal'

interface Props {
  onNavigateCreate: () => void
}

export const MyPostsPage: React.FC<Props> = ({ onNavigateCreate }) => {
  const [animals, setAnimals] = useState<AnimalPost[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [animalToEdit, setAnimalToEdit] = useState<AnimalPost | null>(null)
  const [animalToAdopt, setAnimalToAdopt] = useState<AnimalPost | null>(null)
  const [animalToDelete, setAnimalToDelete] = useState<AnimalPost | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchMyPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await animalApi.listMyPosts({ limit: 50 })
      setAnimals(res.data)
    } catch (err) {
      setError(getErrorMessage(err, 'Falha ao carregar suas publicações.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyPosts()
  }, [])

  const handleRenew = async (id: string) => {
    setActionLoading(true)
    setError(null)
    setSuccessMsg(null)
    try {
      await animalApi.confirmAvailability(id)
      setSuccessMsg('Disponibilidade renovada por mais 30 dias com sucesso!')
      await fetchMyPosts()
    } catch (err) {
      setError(getErrorMessage(err, 'Falha ao renovar disponibilidade.'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenAdoptModal = (id: string) => {
    const found = animals.find((a) => a.id === id)
    if (found) {
      setAnimalToAdopt(found)
    }
  }

  const handleConfirmAdopt = async () => {
    if (!animalToAdopt) return
    setActionLoading(true)
    setError(null)
    setSuccessMsg(null)
    try {
      await animalApi.adopt(animalToAdopt.id)
      setSuccessMsg(`Parabéns! ${animalToAdopt.name} foi marcado como adotado.`)
      setAnimalToAdopt(null)
      await fetchMyPosts()
    } catch (err) {
      setError(getErrorMessage(err, 'Falha ao marcar como adotado.'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenDeleteModal = (animal: AnimalPost) => {
    setDeleteError(null)
    setAnimalToDelete(animal)
  }

  const handleConfirmDelete = async () => {
    if (!animalToDelete) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await animalApi.delete(animalToDelete.id)
      setSuccessMsg(`A publicação de "${animalToDelete.name}" foi excluída com sucesso.`)
      setAnimalToDelete(null)
      await fetchMyPosts()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Falha ao excluir a publicação.'))
    } finally {
      setDeleteLoading(false)
    }
  }

  const availableCount = animals.filter((a) => a.status && !a.isAdopted).length
  const pausedCount = animals.filter((a) => !a.status && !a.isAdopted).length
  const adoptedCount = animals.filter((a) => a.isAdopted).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#ebe2d3]">
        <div>
          <h1 className="text-3xl font-black text-[#1f0b08]">Minhas Publicações</h1>
          <p className="text-sm text-[#6a5c53]">
            Gerencie os animais que você colocou para doação e renove a disponibilidade.
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Publicar Novo Animal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#ebe2d3] flex items-center justify-between shadow-xs">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1.5">
              Disponíveis
            </span>
            <p className="text-3xl font-black text-emerald-700">{availableCount}</p>
          </div>
          <span className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ebe2d3] flex items-center justify-between shadow-xs">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 mb-1.5">
              Pausadas (30d)
            </span>
            <p className="text-3xl font-black text-amber-600">{pausedCount}</p>
          </div>
          <span className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100" />
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ebe2d3] flex items-center justify-between shadow-xs">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#96503f]/20 text-[#96503f] mb-1.5">
              Adotados
            </span>
            <p className="text-3xl font-black text-[#96503f]">{adoptedCount}</p>
          </div>
          <span className="w-4 h-4 rounded-full bg-[#96503f] ring-4 ring-[#96503f]/20" />
        </div>
      </div>

      {actionLoading && (
        <div className="p-3 bg-[#f26b45]/10 border border-[#f26b45]/20 rounded-2xl text-[#f26b45] text-xs font-semibold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Processando alteração no servidor...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6a5c53]">
          <Loader2 className="w-8 h-8 text-[#f26b45] animate-spin" />
          <p className="text-sm font-medium">Carregando suas publicações...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-[#ebe2d3] text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f7efe2] text-[#f26b45] flex items-center justify-center mx-auto text-2xl font-bold">
            <ListFilter className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1f0b08]">Nenhum animal cadastrado ainda</h3>
          <p className="text-sm text-[#6a5c53] max-w-md mx-auto">
            Você ainda não publicou nenhum animal para doação. Clique no botão abaixo para
            começar e encontrar um lar acolhedor!
          </p>
          <button
            onClick={onNavigateCreate}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f26b45] text-white font-bold text-sm shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Cadastrar Meu Primeiro Animal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isOwnerView={true}
              onRenew={handleRenew}
              onMarkAdopted={handleOpenAdoptModal}
              onEdit={(target) => {
                setError(null)
                setSuccessMsg(null)
                setAnimalToEdit(target)
              }}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      <EditAnimalModal
        isOpen={!!animalToEdit}
        animal={animalToEdit}
        onSuccess={async (updated) => {
          setAnimalToEdit(null)
          setSuccessMsg(`As informações de "${updated.name}" foram atualizadas com sucesso!`)
          await fetchMyPosts()
        }}
        onClose={() => setAnimalToEdit(null)}
      />

      <ConfirmModal
        isOpen={!!animalToAdopt}
        animal={animalToAdopt}
        loading={actionLoading}
        onConfirm={handleConfirmAdopt}
        onCancel={() => setAnimalToAdopt(null)}
      />

      <DeleteModal
        isOpen={!!animalToDelete}
        animal={animalToDelete}
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) setAnimalToDelete(null)
        }}
      />
    </div>
  )
}
