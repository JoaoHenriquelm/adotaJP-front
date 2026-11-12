import React, { useState } from 'react'
import { Upload, PlusCircle, ArrowLeft, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { animalApi } from '../api/animal.api'
import { SPECIES_OPTIONS } from '../constants/species'

interface Props {
  onSuccess: () => void
  onCancel: () => void
}

export const CreateAnimalPage: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('CACHORRO')
  const [age, setAge] = useState('1')
  const [ageUnit, setAgeUnit] = useState<'DAYS' | 'MONTHS' | 'YEARS'>('YEARS')
  const [weight, setWeight] = useState('5.0')
  const [vaccines, setVaccines] = useState('')
  const [illnesses, setIllnesses] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    if (!imageFile) {
      setError('Por favor, selecione uma foto do animal para a publicação.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('species', species)
      formData.append('age', String(Number(age)))
      formData.append('ageUnit', ageUnit)
      formData.append('weight', String(Number(weight)))
      formData.append('vaccines', vaccines.trim())
      formData.append('illnesses', illnesses.trim())
      formData.append('image', imageFile)

      await animalApi.create(formData)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar publicação do animal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#ebe2d3]">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-2xl bg-white border border-[#ebe2d3] text-[#1f0b08] hover:bg-[#f7efe2] transition-colors cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#1f0b08]">Cadastrar Animal para Doação</h1>
            <p className="text-sm text-[#6a5c53]">
              Preencha os dados e anexe uma foto para encontrar um lar em João Pessoa.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#ebe2d3] shadow-xs">
        <div>
          <label className="block text-sm font-bold text-[#1f0b08] mb-2">
            Foto do Animal (1 foto única)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-48 h-48 bg-[#f7efe2] rounded-3xl border-2 border-dashed border-[#ebe2d3] flex items-center justify-center overflow-hidden relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Prévia do animal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-[#6a5c53]">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-[#f26b45]" />
                  <span className="text-xs font-semibold">Nenhuma foto selecionada</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ebe2d3] hover:bg-[#d8cebe] text-[#1f0b08] font-bold text-sm transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-[#f26b45]" />
                Escolher Foto
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-[#6a5c53]">
                Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1f0b08] mb-1">Nome do Animal *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Bob, Pipoca, Thor..."
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1f0b08] mb-1">
            Espécie (Animais Domésticos Permitidos) *
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm font-semibold text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] cursor-pointer"
          >
            {SPECIES_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
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
              className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1f0b08] mb-1">Unidade da Idade *</label>
            <select
              value={ageUnit}
              onChange={(e) => setAgeUnit(e.target.value as 'DAYS' | 'MONTHS' | 'YEARS')}
              className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm font-semibold text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] cursor-pointer"
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
              className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
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
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1f0b08] mb-1">
            Enfermidades, Deficiências ou Cuidados (opcional)
          </label>
          <textarea
            rows={3}
            value={illnesses}
            onChange={(e) => setIllnesses(e.target.value)}
            placeholder="Ex: Não possui alergias / animal dócil e sociável..."
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebe2d3]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border border-[#ebe2d3] text-sm font-semibold text-[#6a5c53] hover:bg-[#f7efe2] transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Publicando...' : 'Publicar Animal'}
          </button>
        </div>
      </form>
    </div>
  )
}
