
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { ISettings } from '@/models/Setting';
import type { ICategory } from '@/models/Category';

interface SettingsContextType {
  settings: ISettings;
  categories: ICategory[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ 
    children, 
    settings, 
    categories 
}: { 
    children: ReactNode, 
    settings: ISettings, 
    categories: ICategory[] 
}) => {
  return (
    <SettingsContext.Provider value={{ settings, categories }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
