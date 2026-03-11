import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, businessService } from '../services/api';

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBusiness: (data: Partial<Business>) => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('business_token');
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await businessService.getProfile();
      setBusiness(data);
    } catch (error) {
      localStorage.removeItem('business_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await businessService.login(email, password);
    localStorage.setItem('business_token', data.token);
    setBusiness(data.business);
  };

  const logout = () => {
    localStorage.removeItem('business_token');
    setBusiness(null);
  };

  const updateBusiness = async (data: Partial<Business>) => {
    const response = await businessService.updateProfile(data);
    setBusiness(response.data);
  };

  return (
    <BusinessContext.Provider value={{ business, loading, login, logout, updateBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within BusinessProvider');
  return context;
};
