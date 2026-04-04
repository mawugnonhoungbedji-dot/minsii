import React from 'react';
import { 
    Save, Building2, Upload, Shield, LogOut, Phone, MapPin, 
    Loader2, Target, Globe, Mail 
} from 'lucide-react';
import { authService } from '../../services/authService';

interface DirectorProfileProps {
    director: any;
    setDirector: (val: any) => void;
    isSaving: boolean;
    isUploading: boolean;
    handleUpdateDirectorProfile: (e: React.FormEvent) => void;
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
}

const DirectorProfile: React.FC<DirectorProfileProps> = ({ 
    director, setDirector, isSaving, isUploading, 
    handleUpdateDirectorProfile, handleAvatarUpload, onBack 
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 lg:space-y-16 animate-soft-in">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-apple-text tracking-tight mb-2">Identité Digitale</h2>
                    <p className="text-gray-500 font-medium text-sm lg:text-base italic">Gérez le positionnement stratégique de votre institution sur Minsii.</p>
                </div>
                <button 
                    onClick={handleUpdateDirectorProfile} 
                    disabled={isSaving} 
                    className="h-14 px-10 bg-apple-blue text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-apple-blue/10 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-5 h-5" />} 
                    Sauvegarder l'Audit
                </button>
            </header>

            <div className="apple-card p-8 lg:p-12 space-y-12">
                {/* Institution Logo Section */}
                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-14 pb-10 lg:pb-12 border-b border-black/5">
                    <div className="relative group">
                        <div className="w-40 lg:w-48 h-40 lg:h-48 rounded-[2.5rem] lg:rounded-[3.5rem] bg-apple-gray border-4 border-white shadow-premium overflow-hidden group-hover:rotate-3 transition-transform duration-700">
                            {director?.avatar_url ? (
                                <img src={director.avatar_url} className="w-full h-full object-cover" alt="Institution Logo" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-4xl uppercase">LOGO</div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/60 rounded-[2.5rem] lg:rounded-[3.5rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                            {isUploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white mb-2" />}
                            <span className="text-[9px] font-bold text-white uppercase tracking-widest text-center">{isUploading ? 'ENVOI...' : 'CHANGER'}</span>
                        </label>
                    </div>
                    
                    <div className="flex-1 space-y-8 w-full text-center md:text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nom de l'Institution</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={director?.establishment_name || ''} 
                                        onChange={e => setDirector({...director, establishment_name: e.target.value})} 
                                        placeholder="Ex: Complexe Scolaire Minsii"
                                        className="w-full bg-apple-gray border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-apple-blue/10 transition-all outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Catégorie</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select 
                                        value={director?.establishment_type || 'Lycée'} 
                                        onChange={e => setDirector({...director, establishment_type: e.target.value})} 
                                        className="w-full bg-apple-gray border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-apple-blue/10 transition-all outline-none appearance-none"
                                    >
                                        <option>Lycée</option>
                                        <option>Collège</option>
                                        <option>Complexe Scolaire</option>
                                        <option>Université</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Contact Radio (Téléphone)</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="tel" 
                                value={director?.phone_number || ''} 
                                onChange={e => setDirector({...director, phone_number: e.target.value})} 
                                placeholder="+229 ..."
                                className="w-full bg-apple-gray border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-apple-blue/10 transition-all outline-none" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Localisation Centrale</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                value={director?.location || ''} 
                                onChange={e => setDirector({...director, location: e.target.value})} 
                                placeholder="Cotonou, Bénin"
                                className="w-full bg-apple-gray border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-apple-blue/10 transition-all outline-none" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                        <Target className="w-3 h-3 text-apple-blue" /> Manifeste Éducatif
                    </label>
                    <textarea 
                        rows={5} 
                        value={director?.description || ''} 
                        onChange={e => setDirector({...director, description: e.target.value})} 
                        placeholder="Décrivez la vision de votre établissement..."
                        className="w-full bg-apple-gray border border-transparent rounded-xl py-4 px-5 text-sm font-medium focus:bg-white focus:border-apple-blue/10 transition-all outline-none resize-none italic" 
                    />
                </div>

                {/* Footer Actions */}
                <div className="pt-8 lg:pt-10 border-t border-black/5 flex flex-col sm:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-500/5">
                            <Shield className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Données protégées par <br /> Minsii Core Security.
                        </p>
                    </div>
                    <button 
                        onClick={async () => { await authService.logout(); onBack(); }} 
                        className="flex items-center gap-3 text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em] hover:text-rose-600 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> DÉCONNEXION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectorProfile;
