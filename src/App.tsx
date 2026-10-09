import { useState, useCallback } from 'react';
import { Leaf, ScanLine, MessageCircle, BarChart3, History, Info, Menu, X, MapPin } from 'lucide-react';
import HomePage from '@/components/pages/HomePage';
import ScannerPage from '@/components/pages/ScannerPage';
import ChatPage from '@/components/pages/ChatPage';
import DashboardPage from '@/components/pages/DashboardPage';
import HistoryPage from '@/components/pages/HistoryPage';
import AboutPage from '@/components/pages/AboutPage';
import FacilitiesPage from '@/components/pages/FacilitiesPage';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about' | 'facilities';

const NAV_ITEMS: { id: Page; label: string; icon: typeof Leaf }[] = [
  { id: 'home', label: 'Home', icon: Leaf },
  { id: 'scanner', label: 'Waste Scanner', icon: ScanLine },
  { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
  { id: 'facilities', label: 'Disposal Centres', icon: MapPin },
  { id: 'dashboard', label: 'Eco Dashboard', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
  { id: 'about', label: 'About', icon: Info },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800 hidden sm:block">
                Smart Recycling
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    page === item.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-emerald-100 animate-slide-up">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    page === item.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'scanner' && <ScannerPage onNavigate={navigate} />}
        {page === 'chat' && <ChatPage />}
        {page === 'facilities' && <FacilitiesPage onNavigate={navigate} />}
        {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {page === 'history' && <HistoryPage onNavigate={navigate} />}
        {page === 'about' && <AboutPage onNavigate={navigate} />}
      </main>

      <footer className="border-t border-emerald-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Smart Recycling Assistant — SINAR Hackathon</span>
            </div>
            <p className="text-xs text-gray-400">
              Built for a sustainable future. Environmental estimates are based on general assumptions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
