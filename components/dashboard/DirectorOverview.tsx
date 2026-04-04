import React from 'react';
import { 
    Layout, Briefcase, Users, TrendingUp, CheckCircle, 
    ArrowUpRight, Building2, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DirectorOverviewProps {
    director: any;
    stats: {
        activeOffers: number;
        pendingApplications: number;
        validationRate: string;
    };
    setActiveTab: (tab: any) => void;
}

const DirectorOverview: React.FC<DirectorOverviewProps> = ({ director, stats, setActiveTab }) => {
    return (
        <div className="space-y-10 lg:space-y-16 animate-soft-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] bg-apple-gray p-8 lg:p-16 border border-black/5 group">
                <div className="absolute top-0 right-0 w-64 lg:w-96 h-64 lg:h-96 bg-apple-blue/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-apple-blue/10 transition-all duration-1000" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="w-32 lg:w-48 h-32 lg:h-48 rounded-3xl bg-white p-3 lg:p-4 shadow-premium border border-black/5 relative transition-transform duration-700 group-hover:rotate-3">
                        {director?.avatar_url ? (
                            <img src={director.avatar_url} className="w-full h-full rounded-2xl object-cover" alt="Institution Logo" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-apple-gray rounded-2xl">
                                <Building2 className="w-12 lg:w-20 text-apple-blue/20" />
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-apple-blue rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                            <Zap className="w-4 lg:w-5 h-4 lg:h-5" />
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-4">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-black/5 gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accrédité Minsii Core</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-bold text-apple-text tracking-tight leading-[0.9]">
                            {director?.establishment_name || 'Ma Direction'}.
                        </h2>
                        <p className="text-gray-500 font-medium text-lg lg:max-w-xl italic opacity-70">
                            "Catalyser l'excellence éducative par le recrutement d'élites pédagogiques."
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <button 
                                onClick={() => setActiveTab('offers')}
                                className="px-8 py-4 bg-apple-blue text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-apple-blue/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                Gérer les Offres
                            </button>
                            <button 
                                onClick={() => setActiveTab('candidates')}
                                className="px-8 py-4 bg-white text-apple-text border border-black/5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-premium hover:bg-apple-gray transition-all"
                            >
                                Examiner les Talents
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                {[
                    { label: 'Offres Actives', value: stats.activeOffers, icon: Briefcase, color: 'text-apple-blue', trend: '+2 ce mois', tab: 'offers' },
                    { label: 'Candidats à l\'étude', value: stats.pendingApplications, icon: Users, color: 'text-amber-500', trend: 'Audit requis', tab: 'candidates' },
                    { label: 'Taux de Validation', value: stats.validationRate, icon: CheckCircle, color: 'text-emerald-500', trend: 'Excellence', tab: 'dashboard' },
                ].map((stat, i) => (
                    <motion.button 
                        key={i} 
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(stat.tab)}
                        className="apple-card p-10 text-left relative group overflow-hidden border-none"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-apple-gray flex items-center justify-center mb-8 group-hover:bg-white transition-all duration-500`}>
                            <stat.icon className={`w-6 h-6 ${stat.color} transition-colors`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-5xl font-bold tracking-tight text-apple-text leading-none">{stat.value}</h3>
                                <span className="text-[9px] font-bold text-apple-blue bg-apple-blue/5 px-3 py-1.5 rounded-xl tracking-widest border border-apple-blue/10">
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default DirectorOverview;
