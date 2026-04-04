import React from 'react';
import { Star, Layout } from 'lucide-react';
import { Teacher } from '../../types';
import TeacherCard from '../TeacherCard';

interface ClientFavoritesProps {
    favorites: Teacher[];
    handleToggleFavorite: (id: string) => void;
    setActiveTab: (tab: any) => void;
    onTeacherClick: (t: any) => void;
}

const ClientFavorites: React.FC<ClientFavoritesProps> = ({ favorites, handleToggleFavorite, setActiveTab, onTeacherClick }) => {
    return (
        <div className="space-y-12 lg:space-y-16 animate-soft-in">
            <header>
                <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-4 uppercase italic font-serif">Ma Constellation</h2>
                <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg opacity-80">Vos mentors préférés archivés pour un accès rapide et personnalisé.</p>
            </header>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {favorites.map(teacher => (
                        <TeacherCard 
                            key={teacher.id} 
                            teacher={teacher} 
                            isFavorite={true} 
                            onToggleFavorite={() => handleToggleFavorite(teacher.id)} 
                            onClick={() => onTeacherClick(teacher)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[40px] p-16 lg:p-24 text-center border border-[var(--border-main)]/50 shadow-premium space-y-8 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-amber-500/10 transition-colors duration-700" />
                    
                    <div className="w-20 h-20 bg-[var(--bg-section)] rounded-[28px] flex items-center justify-center mx-auto border border-[var(--border-main)]/50 shadow-inner group-hover:scale-110 transition-transform">
                        <Star className="w-8 h-8 text-amber-400 fill-amber-400 group-hover:rotate-12 transition-transform" />
                    </div>
                    
                    <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl lg:text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic font-serif">Ciel Étoilé Vide</h3>
                        <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg max-w-sm mx-auto leading-relaxed opacity-80">
                            Explorez le marché Minsii pour trouver les mentors qui illumineront votre parcours académique.
                        </p>
                    </div>

                    <button 
                        onClick={() => setActiveTab('dashboard')} 
                        className="h-14 px-10 bg-[var(--primary)] text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-blue-500/10 hover:bg-[#0a0a1a] transition-all relative z-10"
                    >
                        EXPLORER LE MARCHÉ
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientFavorites;
