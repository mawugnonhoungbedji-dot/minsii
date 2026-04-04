import React from 'react';
import { 
    Plus, Edit2, Trash2, Briefcase, Users, 
    ArrowUpRight, DollarSign, Clock, Layout 
} from 'lucide-react';
import { JobOffer } from '../../services/jobOfferService';

interface DirectorOffersProps {
    offers: JobOffer[];
    setShowOfferModal: (val: boolean) => void;
    setEditingOffer: (offer: any) => void;
    handleDeleteOffer: (id: string) => void;
    EMPTY_OFFER: any;
}

const DirectorOffers: React.FC<DirectorOffersProps> = ({ 
    offers, setShowOfferModal, setEditingOffer, 
    handleDeleteOffer, EMPTY_OFFER 
}) => {
    return (
        <div className="space-y-10 lg:space-y-16 animate-soft-in">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-apple-text tracking-tight mb-2">Ingénierie du Recrutement</h2>
                    <p className="text-gray-500 font-medium text-sm lg:text-base italic">Structurez vos besoins pour attirer les experts pédagogiques.</p>
                </div>
                <button 
                    onClick={() => { setEditingOffer(EMPTY_OFFER); setShowOfferModal(true); }}
                    className="h-14 px-8 bg-apple-blue text-white rounded-2xl font-bold text-[10px] tracking-wider flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-apple-blue/10"
                >
                    <Plus className="w-5 h-5" /> Nouvelle Offre
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {offers.map(offer => (
                    <div key={offer.id} className="apple-card p-10 lg:p-12 group hover:shadow-premium transition-all relative overflow-hidden border-none text-left">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button 
                                onClick={() => { setEditingOffer(offer); setShowOfferModal(true); }} 
                                className="p-3 bg-white border border-black/5 rounded-xl text-gray-400 hover:text-apple-blue hover:border-apple-blue/10 transition-all shadow-sm"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteOffer(offer.id)} 
                                className="p-3 bg-white border border-black/5 rounded-xl text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-tight border ${
                                offer.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-apple-gray text-gray-400 border-transparent'
                            }`}>
                                {offer.status === 'active' ? '● Diffusion Active' : '○ Archive / Brouillon'}
                            </span>
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold text-apple-text tracking-tight leading-tight mb-8 pr-20 group-hover:text-apple-blue transition-colors">
                            {offer.title}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-black/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-gray-400 tracking-wider">Protocole</p>
                                <p className="font-bold text-apple-text text-sm flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-apple-blue" /> {offer.contract_type}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-gray-400 tracking-wider">Budget</p>
                                <p className="font-bold text-apple-text text-sm flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> {offer.salary_range || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-apple-text tracking-tight">
                                <Users className="w-5 h-5 text-gray-400" /> 
                                <span className="bg-apple-blue/5 px-2 py-1 rounded text-apple-blue">{offer.applications_count || 0} Candidatures</span>
                            </div>
                            <button className="text-[9px] font-bold text-apple-blue tracking-wider flex items-center gap-2 group/link hover:opacity-100 opacity-60 transition-all">
                                Examiner le Flux <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}

                {offers.length === 0 && (
                    <div className="col-span-full apple-card p-24 text-center space-y-8 opacity-60 flex flex-col items-center">
                        <Briefcase className="w-20 h-20 text-gray-300" />
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-apple-text tracking-tight">Aucune offre publiée.</p>
                            <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto italic">Commencez à recruter en créant votre première offre de poste.</p>
                        </div>
                        <button 
                            onClick={() => setShowOfferModal(true)} 
                            className="px-10 py-4 bg-apple-blue text-white rounded-2xl font-bold text-xs tracking-wider shadow-xl shadow-apple-blue/10 hover:scale-105 transition-all"
                        >
                            Déployer une Offre
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DirectorOffers;
