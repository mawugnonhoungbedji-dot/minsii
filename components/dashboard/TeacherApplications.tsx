import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, ArrowUpRight } from 'lucide-react';
import { jobOfferService, JobApplication } from '../../services/jobOfferService';
import { AuthUser } from '../../services/authService';

interface TeacherApplicationsProps {
    user: AuthUser;
}

const TeacherApplications: React.FC<TeacherApplicationsProps> = () => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const res = await jobOfferService.getMyApplications();
            if (res.success && res.data) {
                setApplications(res.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    return (
        <div className="space-y-12 animate-soft-in">
            <header>
                <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-4 uppercase italic font-serif">Candidatures</h2>
                <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg opacity-80">Suivez l'état de vos propositions d'intervention auprès des établissements.</p>
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
                            {applications.map((app) => (
                                <div key={app.id} className="p-6 space-y-5 hover:bg-[var(--bg-section)] transition-all group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-black text-[var(--text-main)] text-base tracking-tight leading-tight mb-1 font-serif italic uppercase">{app.offer_title}</p>
                                            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">REF-{app.id.slice(0, 8).toUpperCase()}</p>
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                            app.status === 'pending' 
                                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                            : app.status === 'accepted'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {app.status === 'pending' ? 'En cours' : app.status === 'accepted' ? 'Sélectionné' : 'Rejeté'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-section)] flex items-center justify-center font-black text-[var(--primary)] text-[10px] border border-[var(--border-main)]/50 shadow-sm group-hover:scale-110 transition-transform">
                                            {app.establishment_name?.charAt(0) || 'L'}
                                        </div>
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tight opacity-60">{app.establishment_name || 'Institut Minsii'}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30">{new Date(app.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        <button className="h-9 px-4 bg-white border border-[var(--border-main)]/30 rounded-lg text-[8px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-1.5 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all shadow-sm">
                                            Détails <ArrowUpRight className="w-3 h-3" />
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
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Candidature / Offre</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Établissement</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Date d'envoi</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50">Statut</th>
                                        <th className="px-8 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-main)]/50">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="group hover:bg-[var(--bg-section)]/50 transition-all">
                                            <td className="px-8 py-8">
                                                <p className="font-black text-[var(--text-main)] text-base lg:text-lg tracking-tight mb-1 group-hover:text-[var(--primary)] transition-colors font-serif italic uppercase">{app.offer_title}</p>
                                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">ID: {app.id.slice(0, 12).toUpperCase()}</p>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-xs shadow-sm group-hover:scale-110 transition-transform">
                                                        {app.establishment_name?.charAt(0) || 'L'}
                                                    </div>
                                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tight opacity-50 group-hover:translate-x-1 transition-transform">{app.establishment_name || 'Institut Minsii'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30">{new Date(app.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border ${
                                                    app.status === 'pending' 
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/5' 
                                                    : app.status === 'accepted'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-500/5'
                                                }`}>
                                                    {app.status === 'pending' ? 'En cours d\'examen' : app.status === 'accepted' ? 'Retenue' : 'Refusée'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <button className="w-10 h-10 bg-white border border-[var(--border-main)]/30 rounded-xl text-[var(--text-muted)] opacity-30 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:opacity-100 hover:shadow-xl transition-all flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 group/btn">
                                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {applications.length === 0 && (
                            <div className="py-32 text-center opacity-30">
                                <Briefcase className="w-16 h-16 mx-auto mb-6 text-[#1A1008]" />
                                <p className="text-sm font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Aucune candidature active.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TeacherApplications;
