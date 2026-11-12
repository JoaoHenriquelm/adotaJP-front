import React, { useState } from 'react'
import { User, Phone, MapPin, Mail, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth.api'
import { formatPhone } from '../utils/masks'

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await authApi.updateMe({ phone: phone.trim(), address: address.trim() })
      await refreshUser()
      setSuccess('Dados de contato atualizados com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="pb-6 border-b border-[#ebe2d3]">
        <div className="flex items-center gap-2.5 mb-1">
          <User className="w-7 h-7 text-[#f26b45]" />
          <h1 className="text-3xl font-black text-[#1f0b08]">Meu Perfil</h1>
        </div>
        <p className="text-sm text-[#6a5c53]">
          Mantenha seus meios de contato atualizados para que interessados na adoção possam falar com você.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebe2d3] shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#6a5c53]">
          Dados Pessoais Cadastrados
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3]">
            <span className="text-xs font-semibold text-[#6a5c53] block mb-1">Nome Completo</span>
            <span className="font-bold text-[#1f0b08]">{user?.name}</span>
          </div>

          <div className="p-4 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3]">
            <span className="text-xs font-semibold text-[#6a5c53] flex items-center gap-1 mb-1">
              <Mail className="w-3.5 h-3.5 text-[#f26b45]" /> E-mail
            </span>
            <span className="font-bold text-[#1f0b08] truncate block">{user?.email}</span>
          </div>

          <div className="p-4 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3]">
            <span className="text-xs font-semibold text-[#6a5c53] flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#3dac91]" /> Membro Desde
            </span>
            <span className="font-bold text-[#1f0b08]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>

          <div className="p-4 bg-[#f7efe2] rounded-2xl border border-[#ebe2d3]">
            <span className="text-xs font-semibold text-[#6a5c53] flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#f26b45]" /> Data de Nascimento
            </span>
            <span className="font-bold text-[#1f0b08]">
              {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebe2d3] shadow-xs space-y-5"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#6a5c53]">
          Atualizar Meios de Contato
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#1f0b08] mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#f26b45]" /> Celular / WhatsApp
          </label>
          <input
            type="text"
            required
            maxLength={15}
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(83) 99999-1111"
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
          />
          <p className="text-xs text-[#6a5c53] mt-1">
            Este número será exibido diretamente para quem clicar em "Quero Adotar".
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1f0b08] mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#f26b45]" /> Endereço / Bairro (João Pessoa)
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Manaíra, João Pessoa - PB"
            className="w-full px-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}
