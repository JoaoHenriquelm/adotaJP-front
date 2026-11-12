import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { MyPostsPage } from './pages/MyPostsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { CreateAnimalPage } from './pages/CreateAnimalPage'
import { ProfilePage } from './pages/ProfilePage'
import { VeterinaryModal } from './components/VeterinaryModal'
import { AuthModal } from './components/AuthModal'

function MainContent() {
  const { isAuthenticated } = useAuth()
  const [currentTab, setCurrentTab] = useState<string>('home')
  const [veterinaryModalOpen, setVeterinaryModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleSelectTab = (tab: string) => {
    if ((tab === 'my-posts' || tab === 'favorites' || tab === 'create-animal' || tab === 'profile') && !isAuthenticated) {
      setAuthModalOpen(true)
      return
    }
    setCurrentTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7efe2] text-[#1f0b08] selection:bg-[#f26b45] selection:text-white">
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenVeterinaryModal={() => setVeterinaryModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentTab === 'home' && (
          <HomePage
            onOpenVeterinaryModal={() => setVeterinaryModalOpen(true)}
            onPromptAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'my-posts' && (
          <MyPostsPage onNavigateCreate={() => setCurrentTab('create-animal')} />
        )}

        {currentTab === 'favorites' && (
          <FavoritesPage onNavigateHome={() => setCurrentTab('home')} />
        )}

        {currentTab === 'create-animal' && (
          <CreateAnimalPage
            onSuccess={() => {
              setCurrentTab('my-posts')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'profile' && <ProfilePage />}
      </main>

      <Footer />

      <VeterinaryModal
        isOpen={veterinaryModalOpen}
        onClose={() => setVeterinaryModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}
