import React, { useState } from 'react';
import { Save, Loader2, User, Upload, BookOpen, DollarSign, Award, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { authService, AuthUser } from '../../services/authService';

interface TeacherProfileProps {
    user: AuthUser;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ user }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const tp = (user as any)?.teacherProfile;

    const [profileData, setProfileData] = useState({
        name: user?.profile?.name || '',
        city_village: user?.profile?.city_village || '',
        location: user?.profile?.location || '',
    });
    const [teacherData, setTeacherData] = useState({
        subjects: (tp?.subjects || []).join(', '),
        hourly_rate: String(tp?.hourly_rate ?? ''),
        education: tp?.education || '',
        teaching_philosophy: tp?.teaching_philosophy || '',
        experience_years: String(tp?.experience_years ?? ''),
        phone_number: tp?.phone_number || '',
    });
    const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || '');

    const showSaveMsg = (type: 'success' | 'error', text: string) => {
        setSaveMsg({ type, text });
        setTimeout(() => setSaveMsg(null), 5000);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const res = await authService.uploadAvatar(file);
            if (!res.success || !res.data) throw new Error(res.error || 'Échec upload');
            setAvatarUrl(res.data);
            await authService.updateProfile({ avatar_url: res.data });
            showSaveMsg('success', 'Photo mise à jour !');
        } catch (err: any) {
            showSaveMsg('error', err.message || 'Erreur upload');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const [profileRes, teacherRes] = await Promise.all([
                authService.updateProfile({
                    name: profileData.name,
                    city_village: profileData.city_village,
                    location: profileData.location,
                }),
                authService.updateTeacherProfile({
                    subjects: teacherData.subjects.split(',').map(s => s.trim()).filter(Boolean),
                    hourly_rate: parseFloat(teacherData.hourly_rate) || 0,
                    education: teacherData.education || null,
                    teaching_philosophy: teacherData.teaching_philosophy || null,
                    experience_years: parseInt(teacherData.experience_years) || null,
                    phone_number: teacherData.phone_number || null,
                }),
            ]);
            if (!profileRes.success) throw new Error(profileRes.error || 'Erreur profil');
            if (!teacherRes.success) throw new Error(teacherRes.error || 'Erreur profil enseignant');
            showSaveMsg('success', 'Profil synchronisé !');
        } catch (err: any) {
            showSaveMsg('error', err.message || 'Erreur sauvegarde');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl space-y-12 animate-soft-in">
            {saveMsg && (
                <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[24px] text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-soft-in ${
                    saveMsg.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
                }`}>
                    {saveMsg.type === 'success' ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                    <p className="text-sm font-black uppercase tracking-[0.1em]">{saveMsg.text}</p>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-3 uppercase italic font-serif">Profil Expert</h2>
                    <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg opacity-80">Gérez votre visibilité et vos informations professionnelles.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[var(--text-main)] text-white h-14 px-10 rounded-[16px] flex items-center gap-3 shadow-xl shadow-black/5 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all uppercase text-[10px] font-black tracking-[0.2em]"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Sychronisation...' : 'Enregistrer'}</span>
                </button>
            </header>

            <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-[var(--border-main)]/50 shadow-premium flex flex-col md:flex-row items-center gap-10 lg:gap-14 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative group/avatar">
                    <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-[36px] bg-[var(--bg-section)] border-4 border-white shadow-xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
                        {avatarUrl
                            ? <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                            : <div className="w-full h-full flex items-center justify-center"><User className="w-14 h-14 lg:w-16 lg:h-16 text-[var(--text-muted)] opacity-20" /></div>
                        }
                    </div>
                    <label className="absolute inset-0 bg-[#0a0a1a]/70 rounded-[36px] flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer backdrop-blur-sm border-2 border-white/20">
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                        {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin mb-2" /> : <Upload className="w-6 h-6 text-white mb-2" />}
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Changer</span>
                    </label>
                </div>
                <div className="text-center md:text-left relative z-10 flex-1">
                    <h3 className="text-2xl lg:text-3xl font-black text-[var(--text-main)] tracking-tighter mb-2 font-serif italic uppercase">{profileData.name || 'Mentor Minsii'}</h3>
                    <p className="text-base lg:text-lg font-bold text-[var(--primary)] mb-5 tracking-tight uppercase opacity-60">{teacherData.subjects || 'Spécialité à définir'}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Actif sur Minsii</span>
                        </div>
                        <div className="px-4 py-2 bg-[var(--bg-section)] text-[var(--text-muted)] rounded-full border border-[var(--border-main)]/50 opacity-60 flex items-center gap-2">
                            <MapPin size={10} />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{profileData.city_village || 'Bénin'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-[var(--border-main)]/50 shadow-premium space-y-10 focus-within:shadow-2xl transition-shadow duration-500">
                    <div className="flex items-center gap-3 border-b border-[var(--border-main)]/30 pb-6">
                        <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center text-[var(--primary)]">
                            <Award size={20} />
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight font-serif italic">Parcours & Expertise</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Matières Enseignées</label>
                        <div className="relative">
                            <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                            <input type="text" value={teacherData.subjects}
                                onChange={e => setTeacherData({ ...teacherData, subjects: e.target.value })}
                                placeholder="Mathématiques, Physique, etc."
                                className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Tarif (FCFA/h)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                                <input type="number" value={teacherData.hourly_rate}
                                    onChange={e => setTeacherData({ ...teacherData, hourly_rate: e.target.value })}
                                    className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Expérience (ans)</label>
                            <div className="relative">
                                <Award className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                                <input type="number" value={teacherData.experience_years}
                                    onChange={e => setTeacherData({ ...teacherData, experience_years: e.target.value })}
                                    className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Téléphone de contact</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                            <input type="tel" value={teacherData.phone_number}
                                onChange={e => setTeacherData({ ...teacherData, phone_number: e.target.value })}
                                className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-[var(--border-main)]/50 shadow-premium space-y-10 focus-within:shadow-2xl transition-shadow duration-500">
                    <div className="flex items-center gap-3 border-b border-[var(--border-main)]/30 pb-6">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <MapPin size={20} />
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight font-serif italic">Biographie</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Ville de résidence</label>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20" />
                            <input type="text" value={profileData.city_village}
                                onChange={e => setProfileData({ ...profileData, city_village: e.target.value })}
                                className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 pl-14 pr-6 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Diplômes & Éducation</label>
                        <textarea rows={3} value={teacherData.education}
                            onChange={e => setTeacherData({ ...teacherData, education: e.target.value })}
                            placeholder="Ex: Master en Mathématiques Appliquées..."
                            className="w-full bg-[var(--bg-section)] border border-transparent rounded-[24px] py-5 px-8 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner resize-none leading-relaxed" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Philosophie Pédagogique</label>
                        <textarea rows={4} value={teacherData.teaching_philosophy}
                            onChange={e => setTeacherData({ ...teacherData, teaching_philosophy: e.target.value })}
                            placeholder="Quelle est votre approche avec les élèves ?"
                            className="w-full bg-[var(--bg-section)] border border-transparent rounded-[24px] py-5 px-8 text-sm font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 transition-all shadow-inner resize-none italic leading-relaxed" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
