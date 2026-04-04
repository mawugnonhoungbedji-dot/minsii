import React from 'react';
import { MessageSquare, Menu, X, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
  setView?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, setView }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string) => {
    if (setView) setView(view);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Nos Mentors', view: 'marketplace' },
    { label: 'Devenir Mentor', view: 'become-mentor' },
    { label: 'Concept', view: 'how-it-works' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-out',
          'w-auto min-w-[300px] md:min-w-[580px] h-14 px-2 flex items-center justify-between',
          isScrolled 
            ? 'top-4 glass-pill border-white/40 shadow-2xl scale-95' 
            : 'top-6 glass-pill border-white/20'
        )}
      >
        {/* Adjusted Logo Section */}
        <div className="flex items-center gap-2 pl-4 cursor-pointer group" onClick={() => handleNavClick('home')}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-transform group-hover:rotate-12" style={{ backgroundColor: 'var(--primary)' }}>
            <span className="text-white font-serif italic font-black text-sm">m.</span>
          </div>
          <span className="text-lg font-black text-[var(--text-main)] tracking-tighter uppercase hidden sm:block">Minsii</span>
        </div>

        {/* Desktop Menu - Fine Pill style */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className="px-4 py-1.5 rounded-full text-[11px] font-medium text-[var(--text-main)]/60 hover:bg-white/40 hover:text-[var(--primary)] transition-all active:scale-95"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Actions - Standardized Buttons */}
        <div className="flex items-center gap-1 pr-2">
          {user ? (
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="bg-[var(--primary)] text-white px-5 py-2 rounded-full text-[11px] font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
            >
              Dashboard
            </button>
          ) : (
            <button 
              onClick={() => handleNavClick('login')}
              className="bg-[var(--primary)] text-white px-5 py-2 rounded-full text-[11px] font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
            >
              Connexion
            </button>
          )}
          
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/20 ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={18} className="text-[var(--text-main)]" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Premium Pill Slide */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#FDFAF7] p-8 flex flex-col animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold text-xl">M</div>
              <span className="text-2xl font-black tracking-tighter text-[var(--text-main)] uppercase">MINSII</span>
            </div>
            <button className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className="text-4xl font-bold text-[var(--text-main)] text-left hover:translate-x-4 transition-transform tracking-tight"
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="mt-auto">
            <a 
              href="https://wa.me/22900000000" 
              className="w-full h-20 bg-[#25D366] rounded-[2.5rem] flex items-center justify-center gap-4 text-white font-bold text-lg shadow-2xl shadow-emerald-500/10"
            >
              <MessageSquare size={28} />
              Support Elite
            </a>
          </div>
        </div>
      )}
    </>
  );
};
