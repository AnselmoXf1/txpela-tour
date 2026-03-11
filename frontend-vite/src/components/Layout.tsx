import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, MessageCircle, User, Shield, LogOut, Search, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Expor função global para acesso ao admin via console
  React.useEffect(() => {
    // @ts-ignore
    window.txopelaAdmin = () => {
      if (!user) {
        console.log('%c🔒 Você precisa fazer login primeiro!', 'color: #F97316; font-size: 16px; font-weight: bold;');
        navigate('/login');
        return;
      }
      
      if (!user.is_staff) {
        console.log('%c❌ Acesso negado! Você não é administrador.', 'color: #EF4444; font-size: 16px; font-weight: bold;');
        console.log('%c💡 Dica: Faça logout e login novamente com as credenciais admin.', 'color: #6B7280; font-size: 14px;');
        console.log('%c   Username: admin', 'color: #6B7280; font-size: 14px;');
        console.log('%c   Password: admin123', 'color: #6B7280; font-size: 14px;');
        return;
      }
      
      console.log('%c✅ Acesso concedido! Redirecionando para o painel admin...', 'color: #10B981; font-size: 16px; font-weight: bold;');
      navigate('/admin');
    };

    // Mensagem de boas-vindas no console (apenas para admins)
    if (user?.is_staff) {
      console.log('%c🏖️ Txopela Tour - Admin Console', 'color: #0EA5E9; font-size: 20px; font-weight: bold;');
      console.log('%cPara acessar o painel admin, digite: %ctxopelaAdmin()', 'color: #6B7280; font-size: 14px;', 'color: #F97316; font-size: 14px; font-weight: bold; background: #FEF3C7; padding: 2px 6px; border-radius: 4px;');
    }

    return () => {
      // @ts-ignore
      delete window.txopelaAdmin;
    };
  }, [user, navigate]);

  const navLinks = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Explorar', path: '/explore', icon: Map },
    { name: 'Chat', path: '#', icon: MessageCircle, action: () => setIsChatOpen(!isChatOpen) },
    { name: 'Perfil', path: user ? '/profile' : '/login', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="text-xl md:text-2xl font-heading font-bold tracking-wide transition-transform active:scale-95 cursor-pointer select-none"
          >
            <span className="text-ocean">Txopela</span>
            <span className="text-sun">Tour</span>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => navigate('/explore')}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {user && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-3 space-y-2">
                <button 
                  onClick={() => {
                    navigate('/explore');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
                >
                  <Search size={20} className="text-gray-600" />
                  <span className="text-gray-700">Buscar</span>
                </button>
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition text-red-600"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0 md:ml-0 lg:ml-64">
        {children}
      </main>

      {/* Bottom Navigation - Mobile & Tablet Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = link.path !== '#' && isActive(link.path);
            
            return (
              <button
                key={link.name}
                onClick={() => {
                  if (link.action) {
                    link.action();
                  } else {
                    navigate(link.path);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                  active ? 'text-ocean' : 'text-gray-500'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-ocean rounded-b-full"
                  />
                )}
                <Icon size={24} className={active ? 'text-ocean' : 'text-gray-500'} />
                <span className={`text-xs mt-1 font-medium ${active ? 'text-ocean' : 'text-gray-500'}`}>
                  {link.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar - Large Screens Only */}
      <aside className="hidden lg:block fixed left-0 top-14 md:top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
        <div className="p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = link.path !== '#' && isActive(link.path);
            
            return (
              <button
                key={link.name}
                onClick={() => {
                  if (link.action) {
                    link.action();
                  } else {
                    navigate(link.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-ocean text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={24} />
                <span className="font-medium">{link.name}</span>
              </button>
            );
          })}
          
          {user && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="px-2">
                <div className="flex items-center gap-3 mb-3 p-2">
                  <div className="w-10 h-10 bg-ocean rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Chat Bot */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-[calc(100%-2rem)] sm:w-96 max-w-md"
          >
            <ChatBot onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
