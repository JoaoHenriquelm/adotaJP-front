import React, { useState } from "react"
import {
  PawPrint,
  Heart,
  PlusCircle,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ListFilter
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

interface Props {
  currentTab: string
  onSelectTab: (tab: string) => void
  onOpenVeterinaryModal: () => void
  onOpenAuthModal: () => void
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenVeterinaryModal,
  onOpenAuthModal
}) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleNav = (tab: string) => {
    onSelectTab(tab)
    setMobileMenuOpen(false)
    setUserDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-[#f7efe2]/95 backdrop-blur-md border-b border-[#ebe2d3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#f26b45] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#1f0b08] block leading-none">
                Adota<span className="text-[#f26b45]">JP</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#6a5c53]">
                João Pessoa · PB
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-[#ebe2d3]">
            <button
              onClick={() => handleNav("home")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === "home"
                  ? "bg-[#f26b45] text-white shadow-xs"
                  : "text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#ebe2d3]/50"
              }`}
            >
              Animais Disponíveis
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNav("favorites")}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    currentTab === "favorites"
                      ? "bg-[#f26b45] text-white shadow-xs"
                      : "text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#ebe2d3]/50"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Favoritos
                </button>

                <button
                  onClick={() => handleNav("my-posts")}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    currentTab === "my-posts"
                      ? "bg-[#f26b45] text-white shadow-xs"
                      : "text-[#6a5c53] hover:text-[#1f0b08] hover:bg-[#ebe2d3]/50"
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  Minhas Postagens
                </button>
              </>
            )}

            <button
              onClick={onOpenVeterinaryModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#2c836e] hover:bg-[#3dac91]/15 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#3dac91]" />
              Clínicas Veterinárias
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuthModal()
                } else {
                  handleNav("create-animal")
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f26b45] hover:bg-[#e0562e] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Quero Doar Animal
            </button>

            {!isAuthenticated ? (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#ebe2d3] text-[#1f0b08] font-bold text-sm border border-[#ebe2d3] shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#f26b45]" />
                Entrar / Cadastrar
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white hover:bg-[#ebe2d3] border border-[#ebe2d3] text-sm font-semibold text-[#1f0b08] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#f26b45]/15 text-[#f26b45] flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#ebe2d3] p-2 space-y-1 z-50">
                    <div className="px-3 py-2 border-b border-[#ebe2d3]">
                      <p className="text-xs font-bold text-[#1f0b08] truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-[#6a5c53] truncate">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => handleNav("profile")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#1f0b08] hover:bg-[#f7efe2] transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#f26b45]" />
                      Meu Perfil
                    </button>

                    <button
                      onClick={() => handleNav("my-posts")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#1f0b08] hover:bg-[#f7efe2] transition-colors cursor-pointer"
                    >
                      <ListFilter className="w-4 h-4 text-[#3dac91]" />
                      Minhas Postagens
                    </button>

                    <button
                      onClick={() => handleNav("favorites")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#1f0b08] hover:bg-[#f7efe2] transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-[#f26b45]" />
                      Meus Favoritos
                    </button>

                    <button
                      onClick={() => {
                        logout()
                        setUserDropdownOpen(false)
                        handleNav("home")
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-[#ebe2d3]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white border border-[#ebe2d3] text-[#1f0b08] cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ebe2d3] px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNav("home")}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2]"
          >
            Animais Disponíveis
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenVeterinaryModal()
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#2c836e] bg-[#3dac91]/10 flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4 text-[#3dac91]" />
            Clínicas Veterinárias em João Pessoa
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav("favorites")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2] flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#f26b45]" />
                Meus Favoritos
              </button>

              <button
                onClick={() => handleNav("my-posts")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2] flex items-center gap-2"
              >
                <ListFilter className="w-4 h-4 text-[#3dac91]" />
                Minhas Postagens
              </button>

              <button
                onClick={() => handleNav("create-animal")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#f26b45] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Quero Doar Animal
              </button>

              <button
                onClick={() => handleNav("profile")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1f0b08] hover:bg-[#f7efe2] flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#f26b45]" />
                Meu Perfil
              </button>

              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenAuthModal()
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#f26b45] text-white font-bold text-sm shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Entrar ou Cadastrar
            </button>
          )}
        </div>
      )}
    </header>
  )
}
