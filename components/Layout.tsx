import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  currentView?: string;
  setView: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, setView, currentView }) => {
  const isAuthPage = currentView === 'login' || currentView === 'signup';
  const isDashboard = currentView?.toLowerCase().startsWith('dashboard');
  const hideLayout = isAuthPage || isDashboard;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {!hideLayout && (
        <Navbar
          setView={setView}
          user={user}
          onLogout={onLogout}
        />
      )}

      <main className={cn("flex-grow w-full relative z-10", !hideLayout && "page-container")}>
        {children}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
