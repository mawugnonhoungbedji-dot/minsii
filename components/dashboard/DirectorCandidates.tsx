import React from 'react';
import { 
    CheckCircle, XCircle, MessageSquare, Loader2, 
    ArrowUpRight, Clock, MapPin, User, Search 
} from 'lucide-react';
import { JobApplication } from '../../services/jobOfferService';

interface DirectorCandidatesProps {
    applications: JobApplication[];
    handleUpdateApplication: (appId: string, status: 'accepted' | 'rejected') => void;
    handleContactCandidate: (id: string, name: string) => void;
}

const DirectorCandidates: React.FC<DirectorCandidatesProps> = ({ 
    applications, handleUpdateApplication, handleContactCandidate 
}) => {
    return (
        <div className="space-y-10 lg:space-y-16 animate-soft-in">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-apple-text tracking-tight mb-2">Centre d'Examen</h2>
                    <p className="text-gray-500 font-medium text-sm lg:text-base italic">Analysez et sélectionnez les experts pédagogiques pour votre équipe.</p>
                </div>
            </header>

            <div className="apple-card overflow-hidden p-0 border-none shadow-soft hover:shadow-premium transition-all duration-500">
                {/* Mobile View: Cards */}
                <div className="block lg:hidden divide-y divide-black/5">
                    {applications.map((app) => (
                        <div key={app.id} className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-apple-gray flex items-center justify-center font-black text-apple-blue text-lg border border-black/5 shadow-sm uppercase">
                                        {app.teacher_name?.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-apple-text text-base leading-tight mb-1">{app.teacher_name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-apple-blue uppercase tracking-widest">{app.teacher_experience_years || 0} Ans XP</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{(app as any).teacher_city_village || 'Cotonou'}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                    app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                    {app.status === 'pending' ? 'À L\'ÉTUDE' : app.status === 'accepted' ? 'VALIDÉ' : 'REJETÉ'}
                                </span>
                            </div>
                            
                            <div className="space-y-1 py-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Offre Cible</p>
                                <p className="font-bold text-apple-text text-sm">{app.offer_title}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                {app.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateApplication(app.id, 'accepted')} 
                                            className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all outline-none"
                                        >
                                            Valider
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateApplication(app.id, 'rejected')} 
                                            className="flex-1 py-3 bg-white text-rose-500 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 active:scale-95 transition-all outline-none"
                                        >
                                            Rejeter
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={() => handleContactCandidate(app.teacher_id, app.teacher_name || 'Enseignant')}
                                    className="p-3 bg-apple-blue text-white rounded-xl shadow-lg shadow-apple-blue/10 active:scale-95 transition-all outline-none"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/5">
                                <th className="px-10 py-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Candidat / Expert</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Offre Cible</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Statut Audit</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Décision / Liaison</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {applications.map(app => (
                                <tr key={app.id} className="group hover:bg-apple-gray/30 transition-all duration-500">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-apple-blue font-black text-2xl shadow-sm uppercase group-hover:scale-105 transition-transform">
                                                {app.teacher_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-apple-text mb-1 group-hover:text-apple-blue transition-colors tracking-tight">{app.teacher_name}</p>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <span className="text-apple-blue/60">{app.teacher_experience_years} ANS EXPERTISE</span>
                                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                                    <span>{(app as any).teacher_city_village || (app as any).teacher_location || 'Cotonou'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <p className="font-bold text-apple-text text-sm">{app.offer_title}</p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1.5">APP-REF : {app.id.slice(0,8).toUpperCase()}</p>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                            app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {app.status === 'pending' ? 'À L\'ÉTUDE' : app.status === 'accepted' ? 'VALIDÉ' : 'REJETÉ'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleUpdateApplication(app.id, 'accepted')} title="Accepter" className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/10 hover:scale-110 active:scale-95 transition-all"><CheckCircle className="w-5 h-5" /></button>
                                                    <button onClick={() => handleUpdateApplication(app.id, 'rejected')} title="Refuser" className="p-3 bg-white border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all"><XCircle className="w-5 h-5" /></button>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => handleContactCandidate(app.teacher_id, app.teacher_name || 'Enseignant')}
                                                className="p-3 bg-apple-blue text-white rounded-xl shadow-lg shadow-apple-blue/10 hover:scale-110 active:scale-95 transition-all"
                                                title="Contacter sur Radio Minsii"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {applications.length === 0 && (
                    <div className="py-24 text-center opacity-40 space-y-6">
                    <User className="w-16 h-16 mx-auto text-gray-300" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Flux de Candidatures Vide</p>
                            <p className="text-xs font-medium text-gray-400 italic">"Explorez vos offres actives pour dynamiser votre recrutement."</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DirectorCandidates;
