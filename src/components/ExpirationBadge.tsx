import React from 'react'
import { CheckCircle2, Clock, CheckCheck } from 'lucide-react'

interface Props {
  status: boolean
  isAdopted: boolean
  daysRemaining?: number
}

export const ExpirationBadge: React.FC<Props> = ({ status, isAdopted }) => {
  if (isAdopted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#96503f] text-white shadow-md border border-white/30">
        <CheckCheck className="w-3.5 h-3.5 text-white" />
        Adotado
      </span>
    )
  }

  if (status) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md border border-white/30">
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        Disponível
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-amber-950 shadow-md border border-white/40">
      <Clock className="w-3.5 h-3.5 text-amber-950" />
      Pausada (30 dias)
    </span>
  )
}
