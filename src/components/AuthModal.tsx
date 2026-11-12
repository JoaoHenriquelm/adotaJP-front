import React, { useState } from 'react'
import { X, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatCpf, formatPhone } from '../utils/masks'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email: loginEmail, password: loginPassword })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({
        name,
        email,
        cpf,
        birthDate,
        phone,
        address,
        password,
      })
      setSuccess('Cadastro realizado com sucesso!')
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#ebe2d3] overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebe2d3]">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('login')
                setError(null)
              }}
              className={`pb-1 text-base font-bold transition-colors cursor-pointer border-b-2 ${
                mode === 'login'
                  ? 'border-[#f26b45] text-[#f26b45]'
                  : 'border-transparent text-[#6a5c53] hover:text-[#1f0b08]'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setMode('register')
                setError(null)
              }}
              className={`pb-1 text-base font-bold transition-colors cursor-pointer border-b-2 ${
                mode === 'register'
                  ? 'border-[#f26b45] text-[#f26b45]'
                  : 'border-transparent text-[#6a5c53] hover:text-[#1f0b08]'
              }`}
            >
              Cadastrar
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#f7efe2] rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6a5c53] mb-1">E-mail</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-3.5 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Senha</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Entrando...' : 'Entrar no AdotaJP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maria Silva"
                className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#6a5c53] mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@exemplo.com"
                  className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6a5c53] mb-1">CPF</label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Nascimento</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Celular / WhatsApp</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(83) 99999-1111"
                  className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Endereço / Bairro (João Pessoa)</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Manaíra, João Pessoa - PB"
                className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a5c53] mb-1">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2 bg-[#f7efe2] border border-[#ebe2d3] rounded-xl text-sm text-[#1f0b08] focus:outline-hidden focus:ring-2 focus:ring-[#f26b45]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
