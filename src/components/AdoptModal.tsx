import React from 'react'
import { X, Phone, Mail, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react'
import type { AnimalPost } from '../types'
import { getImageUrl } from '../api/client'

interface Props {
  animal: AnimalPost | null
  onClose: () => void
}

export const AdoptModal: React.FC<Props> = ({ animal, onClose }) => {
  if (!animal) return null

  const rawPhone = animal.owner?.phone ? animal.owner.phone.replace(/\D/g, '') : ''
  const whatsappUrl = rawPhone
    ? `https://wa.me/55${rawPhone}?text=${encodeURIComponent(
        `Olá! Vi o animal ${animal.name} (${animal.species}) no AdotaJP e gostaria de saber mais sobre a adoção responsável.`,
      )}`
    : '#'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#ffffff] rounded-3xl shadow-2xl border border-[#ebe2d3] overflow-hidden">
        <div className="relative h-48 bg-[#ebe2d3] overflow-hidden">
          <img
            src={getImageUrl(animal.imagePath)}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#f26b45] bg-[#ffffff] px-2.5 py-0.5 rounded-full">
                {animal.species}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">{animal.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#f7efe2] p-4 rounded-2xl border border-[#ebe2d3] flex items-start gap-3">
            <HeartHandshake className="w-6 h-6 text-[#f26b45] shrink-0 mt-0.5" />
            <div className="text-sm text-[#1f0b08]">
              <p className="font-semibold text-base mb-1">Adoção Direta & Gratuita</p>
              <p className="text-[#6a5c53]">
                O <strong>AdotaJP</strong> conecta você diretamente ao tutor. Combine a visita,
                conheça o animal e faça uma adoção responsável sem taxas!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#6a5c53]">
              Dados de Contato do Tutor
            </h4>

            <div className="bg-white p-4 rounded-2xl border border-[#ebe2d3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6a5c53]">Responsável:</span>
                <span className="text-sm font-semibold text-[#1f0b08]">
                  {animal.owner?.name || 'Tutor Cadastrado'}
                </span>
              </div>

              {animal.owner?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6a5c53] flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#f26b45]" /> Telefone:
                  </span>
                  <span className="text-sm font-semibold text-[#1f0b08]">
                    {animal.owner.phone}
                  </span>
                </div>
              )}

              {animal.owner?.email && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6a5c53] flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#f26b45]" /> E-mail:
                  </span>
                  <a
                    href={`mailto:${animal.owner.email}`}
                    className="text-sm font-semibold text-[#f26b45] hover:underline"
                  >
                    {animal.owner.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {rawPhone ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
              >
                <MessageCircle className="w-5 h-5" />
                Conversar no WhatsApp
              </a>
            ) : (
              <a
                href={`mailto:${animal.owner?.email || ''}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#f26b45] hover:bg-[#e0562e] text-white font-semibold transition-all shadow-md cursor-pointer text-center"
              >
                <Mail className="w-5 h-5" />
                Enviar E-mail
              </a>
            )}

            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl border border-[#ebe2d3] text-[#6a5c53] hover:bg-[#f7efe2] font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6a5c53]">
            <ShieldCheck className="w-4 h-4 text-[#3dac91]" />
            Adote com responsabilidade. Adoção é um compromisso para toda a vida.
          </div>
        </div>
      </div>
    </div>
  )
}
