// Configurações para mobile
export const MOBILE_CONFIG = {
  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Cores
  colors: {
    primary: '#2563eb', // blue-600
    secondary: '#7c3aed', // purple-600
    success: '#059669', // green-600
    warning: '#d97706', // amber-600
    danger: '#dc2626', // red-600
    light: '#f8fafc', // slate-50
    dark: '#1e293b', // slate-800
  },
  
  // Tamanhos de fonte
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  
  // Espaçamentos
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },
  
  // Bordas
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  // Animações
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  
  // Configurações específicas
  features: {
    pullToRefresh: true,
    swipeGestures: true,
    hapticFeedback: true,
    offlineSupport: true,
    pushNotifications: true,
  },
};

// Utilitários para mobile
export const mobileUtils = {
  // Verificar se é mobile
  isMobile(): boolean {
    return window.innerWidth < MOBILE_CONFIG.breakpoints.lg;
  },
  
  // Verificar se é tablet
  isTablet(): boolean {
    const width = window.innerWidth;
    return width >= MOBILE_CONFIG.breakpoints.md && width < MOBILE_CONFIG.breakpoints.lg;
  },
  
  // Verificar se é desktop
  isDesktop(): boolean {
    return window.innerWidth >= MOBILE_CONFIG.breakpoints.lg;
  },
  
  // Formatar data para mobile
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    // Menos de 1 minuto
    if (diff < 60000) return 'Agora';
    
    // Menos de 1 hora
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Há ${minutes} min`;
    }
    
    // Hoje
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Ontem
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    
    // Esta semana
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (d > weekAgo) {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days[d.getDay()];
    }
    
    // Mais antigo
    return d.toLocaleDateString();
  },
  
  // Formatar número
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },
  
  // Copiar para clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Erro ao copiar:', err);
      return false;
    }
  },
  
  // Vibrar (haptic feedback)
  vibrate(pattern: number | number[] = 50): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },
  
  // Verificar conexão
  isOnline(): boolean {
    return navigator.onLine;
  },
  
  // Salvar no localStorage com prefixo
  saveLocal(key: string, value: any): void {
    localStorage.setItem(`txopela_${key}`, JSON.stringify(value));
  },
  
  // Carregar do localStorage
  loadLocal<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(`txopela_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  },
  
  // Remover do localStorage
  removeLocal(key: string): void {
    localStorage.removeItem(`txopela_${key}`);
  },
};

// Hook para detectar tamanho da tela
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < MOBILE_CONFIG.breakpoints.lg,
    isTablet: window.innerWidth >= MOBILE_CONFIG.breakpoints.md && 
              window.innerWidth < MOBILE_CONFIG.breakpoints.lg,
    isDesktop: window.innerWidth >= MOBILE_CONFIG.breakpoints.lg,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < MOBILE_CONFIG.breakpoints.lg,
        isTablet: window.innerWidth >= MOBILE_CONFIG.breakpoints.md && 
                  window.innerWidth < MOBILE_CONFIG.breakpoints.lg,
        isDesktop: window.innerWidth >= MOBILE_CONFIG.breakpoints.lg,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Import React para o hook
import { useState, useEffect } from 'react';