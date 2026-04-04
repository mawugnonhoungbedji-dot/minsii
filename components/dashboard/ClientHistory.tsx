import React from 'react';
import { Clock, Star, ArrowUpRight, Loader2, Calendar } from 'lucide-react';
import { Booking } from '../../services/bookingService';

interface ClientHistoryProps {
    bookings: Booking[];
    isLoading: boolean;
    setShowRatingModal: (id: string) => void;
}

const ClientHistory: React.FC<ClientHistoryProps> = ({ bookings, isLoading, setShowRatingModal }) => {
    return (
        <div className="space-y-12 lg:space-y-16 animate-soft-in">
            <header>
                <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-4 uppercase italic font-serif">Activités Archivées</h2>
                <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg opacity-80">Suivez vos interactions et sessions d'accompagnement avec vos mentors.</p>
            </header>

            <div className="bg-white rounded-[40px] border border-[var(--border-main)]/50 shadow-premium overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="w-12 h-12 text-[#1e1edc] animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="block lg:hidden divide-y divide-[var(--border-main)]/50">
                            {bookings.map((item) => (
                                <div key={item.id} className="p-6 space-y-5 hover:bg-[var(--bg-section)] transition-all group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-[20px] bg-[var(--bg-section)] border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-base shadow-inner group-hover:scale-110 transition-transform">
                                                {item.teacher?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-black text-[var(--text-main)] text-base tracking-tight leading-none group-hover:text-[var(--primary)] transition-colors font-serif italic">{item.teacher?.name || 'Mentor Minsii'}</p>
                                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1.5 opacity-50">{item.subject || 'Spécialiste'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                            item.status === 'accepted' || item.status === 'completed' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5' 
                                            : item.status === 'rejected' || item.status === 'cancelled'
                                            ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-500/5'
                                            : 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/5'
                                        }`}>
                                            {item.status === 'accepted' ? 'Sélectionné' : item.status === 'completed' ? 'Archivé' : item.status === 'pending' ? 'Examen' : item.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] opacity-30">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <button 
                                            onClick={() => setShowRatingModal(item.teacher_id)}
                                            className="h-9 px-5 bg-[var(--primary)] text-white rounded-lg text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 hover:bg-[#0a0a1a] transition-all shadow-xl shadow-blue-500/10"
                                        >
                                            <Star size={12} className="fill-white" /> Évaluer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-main)]/50 bg-[var(--bg-section)]/50">
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Mentor / Discipline</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Chronologie</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Statut</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50 text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-main)]/50">
                                    {bookings.map((item) => (
                                        <tr key={item.id} className="group hover:bg-[var(--bg-section)]/50 transition-all">
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-[20px] bg-white border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                        {item.teacher?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[var(--text-main)] text-base tracking-tight mb-1 group-hover:text-[var(--primary)] transition-colors font-serif italic">{item.teacher?.name || 'Mentor Minsii'}</p>
                                                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">{item.subject || 'Expert Discipline'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight mb-1">{new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                <p className="text-[9px] text-[var(--primary)] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 opacity-60">
                                                    <Clock size={11} />
                                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${
                                                    item.status === 'accepted' || item.status === 'completed' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5' 
                                                    : item.status === 'rejected' || item.status === 'cancelled'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-500/5'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/5'
                                                }`}>
                                                    {item.status === 'accepted' ? 'Sélectionné' : item.status === 'completed' ? 'Session Archivée' : item.status === 'pending' ? 'Examen en cours' : item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <button 
                                                    onClick={() => setShowRatingModal(item.teacher_id)}
                                                    className="inline-flex items-center gap-2.5 h-12 px-6 bg-white border border-[var(--border-main)]/50 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-main)] hover:text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-xl hover:shadow-blue-500/10 group/btn"
                                                >
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover/btn:fill-white group-hover/btn:text-white transition-colors" /> Évaluer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {bookings.length === 0 && (
                            <div className="py-32 text-center opacity-30">
                                <Clock className="w-16 h-16 mx-auto mb-6 text-[#1A1008]" />
                                <p className="text-sm font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Aucun enregistrement détecté.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientHistory;
