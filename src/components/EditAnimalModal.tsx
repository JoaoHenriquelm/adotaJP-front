import React, { useEffect, useState } from 'react'
import { X, Pencil, Upload, Loader2, AlertCircle, Lock, Calendar, User } from 'lucide-react'
import type { AgeUnit, AnimalPost } from '../types'
import { animalApi } from '../api/animal.api'
import { getImageUrl } from '../api/client'
import { SPECIES_OPTIONS } from '../constants/species'
import { useAuth } from '../context/AuthContext'

interface Props {
  isOpen: boolean
  animal: AnimalPost | null
  onSuccess: (updated: AnimalPost) => void
  onClose: () => void
}

export const EditAnimalModal: React.FC<Props> = ({
  isOpen,
  animal,
  onSuccess,
  onClose,
}) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('CACHORRO')
  const [age, setAge] = useState('1')
  const [ageUnit, setAgeUnit] = useState<AgeUnit>('YEARS')
  const [weight, setWeight] = useState('1.0')
  const [vaccines, setVaccines] = useState('')
  const [illnesses, setIllnesses] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (animal && isOpen) {
      setName(animal.name)
      setSpecies(animal.species)
      setAge(String(animal.age))
      setAgeUnit(animal.ageUnit)
      setWeight(String(animal.weight))
      setVaccines(animal.vaccines || '')
      setIllnesses(animal.illnesses || '')
      setImageFile(null)
      setImagePreview(getImageUrl(animal.imagePath))
      setError(null)
    }
  }, [animal, isOpen])

  if (!isOpen || !animal) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let updated: AnimalPost

      if (imageFile) {
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('species', species)
        formData.append('age', String(Number(age)))
        formData.append('ageUnit', ageUnit)
        formData.append('weight', String(Number(weight)))
        formData.append('vaccines', vaccines.trim())
        formData.append('illnesses', illnesses.trim())
        formData.append('image', imageFile)

        updated = await animalApi.update(animal.id, formData)
      } else {
        updated = await animalApi.update(animal.id, {
          name: name.trim(),
          species,
          age: Number(age),
          ageUnit,
          weight: Number(weight),
          vaccines: vaccines.trim(),
          illnesses: illnesses.trim(),
        })
      }

      onSuccess(updated)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha ao atualizar as informações da publicação.',
      )
    } finally {
      setLoading(false)
    }
  }

  const authorName = animal.owner?.name || user?.name || 'Você (Proprietário)'
  const publishedDateFormatted = new Date(animal.publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebe2d3] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebe2d3] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#f26b45]/15 rounded-xl">
              <Pencil className="w-5 h-5 text-[#f26b45]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1f0b08]">Editar Publicação</h3>
              <p className="text-xs text-[#6a5c53]">
                Atualize os dados de <strong>{animal.name}</strong> (RF12)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#f7efe2] rounded-full transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="p-3.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6a5c53]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#f26b45] shrink-0" />
              <div>
                <span className="block font-semibold text-[#1f0b08] flex items-center gap-1">
                  Autoria (Tutor) <Lock className="w-3 h-3 text-[#6a5c53]" />
                </span>
                <span className="truncate block">{authorName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3dac91] shrink-0" />
              <div>
                <span className="block font-semibold text-[#1f0b08] flex items-center gap-1">
                  Data de Publicação <Lock className="w-3 h-3 text-[#6a5c53]" />
                </span>
                <span>{publishedDateFormatted} (Imutável)</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6a5c53] mb-2">
              Foto do Animal
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3] overflow-hidden shrink-0">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={name || animal.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ebe2d3] hover:bg-[#d8cebe] text-[#1f0b08] font-bold text-xs transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#f26b45]" />
                  Trocar Foto (Opcional)
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-[#6a5c53]">
                  Mantenha a foto atual ou selecione uma nova (JPG, PNG, WEBP até 5MB).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1f0b08] mb-1">
                Nome do Animal *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1f0b08] mb-1">
                Espécie *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm font-semibold text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] cursor-pointer"
              >
                {SPECIES_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1f0b08] mb-1">Idade *</label>
              <input
                type="number"
                min="0"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1f0b08] mb-1">
                Unidade da Idade *
              </label>
              <select
                value={ageUnit}
                onChange={(e) => setAgeUnit(e.target.value as AgeUnit)}
                className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm font-semibold text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] cursor-pointer"
              >
                <option value="YEARS">Anos</option>
                <option value="MONTHS">Meses</option>
                <option value="DAYS">Dias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1f0b08] mb-1">Peso (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1f0b08] mb-1">
              Vacinas Aplicadas (opcional)
            </label>
            <input
              type="text"
              value={vaccines}
              onChange={(e) => setVaccines(e.target.value)}
              placeholder="Ex: V10, Antirrábica em dia, Castrado..."
              className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1f0b08] mb-1">
              Enfermidades, Deficiências ou Cuidados (opcional)
            </label>
            <textarea
              rows={2}
              value={illnesses}
              onChange={(e) => setIllnesses(e.target.value)}
              placeholder="Ex: Não possui alergias / animal dócil e sociável..."
              className="w-full px-4 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebe2d3]">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-[#ebe2d3] text-sm font-semibold text-[#6a5c53] hover:bg-[#f7efe2] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
