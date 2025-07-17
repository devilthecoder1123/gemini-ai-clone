import React from 'react';
import { useAppStore } from '../../store/appStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useAppStore();

  return (
    <div className={darkMode ? 'dark' : ''}>
      {children}
    </div>
  );
};