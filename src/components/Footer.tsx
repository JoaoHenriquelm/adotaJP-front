import React from 'react'
import { PawPrint, Globe, GraduationCap } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1f0b08] text-[#f7efe2] pt-14 pb-10 border-t border-[#6a5c53]/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#6a5c53]/40">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#f26b45] text-white flex items-center justify-center">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Adota<span className="text-[#f26b45]">JP</span>
              </span>
            </div>
            <p className="text-sm text-[#ebe2d3]/80 leading-relaxed">
              Plataforma comunitária dedicada a conectar lares e animais para adoção responsável
              em João Pessoa - PB. Juntos contra o abandono e em prol do bem-estar animal.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f26b45]">
              <GraduationCap className="w-4 h-4" />
              <span>Projeto Acadêmico</span>
            </div>
            <p className="text-xs text-[#ebe2d3]/80 leading-relaxed">
              <strong>Atividades Extensionistas III:</strong> Tecnologia Aplicada à Inclusão Digital<br />
              <strong>Instituição:</strong> Centro Universitário Internacional UNINTER<br />
              <strong>Curso:</strong> Bacharelado em Engenharia de Software<br />
              <strong>Aluno:</strong> João Henrique Leite Marsicano (RU: 4755564)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#3dac91]">
              <Globe className="w-4 h-4" />
              <span>Objetivo de Sustentabilidade</span>
            </div>
            <p className="text-xs text-[#ebe2d3]/80 leading-relaxed">
              Alinhado ao <strong>ODS 15 (Vida Terrestre)</strong> da Agenda 2030 da ONU,
              promovendo a guarda responsável, vacinação e mapeamento de assistência veterinária
              acessível na capital paraibana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
