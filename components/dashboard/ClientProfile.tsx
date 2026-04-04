import React from 'react';
import { 
    Save, User, Upload, Shield, LogOut, Phone, MapPin, 
    Loader2, Target, GraduationCap 
} from 'lucide-react';
import { authService } from '../../services/authService';

interface ClientProfileProps {
    editProfile: any;
    setEditProfile: (val: any) => void;
    isSaving: boolean;
    isUploading: boolean;
    handleSaveProfile: () => void;
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ 
    editProfile, setEditProfile, isSaving, isUploading, 
    handleSaveProfile, handleAvatarUpload, onBack 
}) => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20 animate-soft-in">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-4 uppercase italic font-serif">Identité Digitale</h2>
                    <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg opacity-80">Gérez votre positionnement et vos préférences sur Minsii Royal.</p>
                </div>
                <button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving} 
                    className="h-14 px-10 bg-[var(--primary)] text-white rounded-[16px] font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#0a0a1a] active:scale-95 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} 
                    Synchroniser
                </button>
            </header>

            <div className="bg-white rounded-[40px] p-8 lg:p-14 border border-[var(--border-main)]/50 shadow-premium space-y-12">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-14 pb-12 lg:pb-14 border-b border-[var(--border-main)]/30">
                    <div className="relative group">
                        <div className="w-40 lg:w-48 h-40 lg:h-48 rounded-[36px] lg:rounded-[44px] bg-[var(--bg-section)] border-4 border-white shadow-xl overflow-hidden group-hover:-rotate-2 transition-transform duration-700 relative">
                            {editProfile.avatar_url ? (
                                <img src={editProfile.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] opacity-20 font-black text-4xl uppercase">IMG</div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-[#0a0a1a]/70 rounded-[36px] lg:rounded-[44px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm border-2 border-white/20 z-10">
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                            {isUploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white mb-2" />}
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] text-center">{isUploading ? 'SYNCHRO...' : 'CHANGER'}</span>
                        </label>
                    </div>
                    
                    <div className="flex-1 space-y-8 w-full text-center md:text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] px-2 opacity-50">Identité Complète</label>
                                <div className="relative group-input">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20 group-focus-within:text-[var(--primary)] transition-colors" />
                                    <input 
                                        type="text" 
                                        value={editProfile.name} 
                                        onChange={e => setEditProfile({...editProfile, name: e.target.value})} 
                                        placeholder="NOM & PRÉNOM"
                                        className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-black tracking-tight focus:bg-white focus:border-[var(--primary)]/10 transition-all outline-none uppercase placeholder:text-[var(--text-muted)]/20" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] px-2 opacity-50">Niveau d'Études</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                                    <input 
                                        type="text" 
                                        value={editProfile.level} 
                                        onChange={e => setEditProfile({...editProfile, level: e.target.value})} 
                                        placeholder="MASTER, LICENCE..."
                                        className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-black tracking-tight focus:bg-white focus:border-[var(--primary)]/10 transition-all outline-none uppercase placeholder:text-[var(--text-muted)]/20" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] px-2 opacity-50">WhatsApp / Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                            <input 
                                type="tel" 
                                value={editProfile.location} 
                                onChange={e => setEditProfile({...editProfile, location: e.target.value})} 
                                placeholder="+229 ..."
                                className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-black tracking-tight focus:bg-white focus:border-[var(--primary)]/10 transition-all outline-none uppercase placeholder:text-[var(--text-muted)]/20" 
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] px-2 opacity-50">Ville de Résidence</label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                            <input 
                                type="text" 
                                value={editProfile.city_village} 
                                onChange={e => setEditProfile({...editProfile, city_village: e.target.value})} 
                                placeholder="COTONOU, ABOMEY-CALAVI..."
                                className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-black tracking-tight focus:bg-white focus:border-[var(--primary)]/10 transition-all outline-none uppercase placeholder:text-[var(--text-muted)]/20" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] px-2 flex items-center gap-2.5 opacity-50">
                        <Target className="w-3.5 h-3.5 text-[var(--primary)]" /> Mes Objectifs Académiques
                    </label>
                    <textarea 
                        rows={6} 
                        value={editProfile.goals} 
                        onChange={e => setEditProfile({...editProfile, goals: e.target.value})} 
                        placeholder="Quels sont vos objectifs majeurs sur Minsii ?"
                        className="w-full bg-[var(--bg-section)] border border-transparent rounded-[24px] py-6 px-8 text-base font-black tracking-tight focus:bg-white focus:border-[var(--primary)]/10 transition-all outline-none resize-none italic text-[var(--text-main)] uppercase placeholder:text-[var(--text-muted)]/20" 
                    />
                </div>

                {/* Footer Actions */}
                <div className="pt-8 lg:pt-12 border-t border-[var(--border-main)]/30 flex flex-col sm:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-500/5 transition-transform hover:rotate-6">
                            <Shield className="w-7 h-7 text-emerald-500" />
                        </div>
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] leading-relaxed opacity-40">
                            Profil blindé par <br /> Minsii Core Intelligence.
                        </p>
                    </div>
                    <button 
                        onClick={async () => { await authService.logout(); onBack(); }} 
                        className="h-12 px-8 border-2 border-rose-100 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center gap-2.5"
                    >
                        <LogOut className="w-4 h-4" /> DÉCONNEXION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
