import React, { useEffect, useState } from 'react'
import { X, MapPin, Search, ExternalLink, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_NEIGHBORHOODS = [
  'Bessa, João Pessoa',
  'Manaíra, João Pessoa',
  'Tambaú, João Pessoa',
  'Mangabeira, João Pessoa',
  'Altiplano, João Pessoa',
  'Bancários, João Pessoa',
  'Epitácio Pessoa, João Pessoa',
  'Cabo Branco, João Pessoa',
  'Cristo Redentor, João Pessoa',
]

export const VeterinaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth()
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated && user?.address) {
        setAddress(user.address)
      } else if (!isAuthenticated) {
        setAddress('')
      }
    }
  }, [isOpen, isAuthenticated, user?.address])

  if (!isOpen) return null

  const handleSearch = (targetAddress?: string) => {
    const finalAddress = (targetAddress || address).trim()
    const query = finalAddress
      ? `clinica veterinaria proximo a ${finalAddress}`
      : 'clinica veterinaria joao pessoa pb'

    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#ebe2d3] overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebe2d3]">
          <div className="flex items-center gap-2 text-[#f26b45]">
            <div className="p-2 bg-[#f26b45]/10 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1f0b08]">Clínicas Veterinárias</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#f7efe2] rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#6a5c53]">
          Encontre atendimento veterinário próximo de você no município de João Pessoa.
          Digite seu bairro ou endereço abaixo:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-[#f26b45]" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Manaíra, Cabo Branco, Bancários..."
              className="w-full pl-11 pr-4 py-3 bg-[#f7efe2] border border-[#ebe2d3] rounded-2xl text-sm text-[#1f0b08] placeholder:text-[#6a5c53]/70 focus:outline-hidden focus:ring-2 focus:ring-[#f26b45] transition-all"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#6a5c53] uppercase tracking-wider">
              Bairros Rápidos em João Pessoa:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_NEIGHBORHOODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setAddress(item)
                    handleSearch(item)
                  }}
                  className="text-xs px-2.5 py-1 bg-[#f7efe2] hover:bg-[#ebe2d3] text-[#1f0b08] rounded-lg transition-colors border border-[#ebe2d3] cursor-pointer"
                >
                  {item.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-semibold transition-all shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Clínicas no Google Maps</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>
        </form>
      </div>
    </div>
  )
}
