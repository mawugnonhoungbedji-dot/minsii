
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Target, BookOpen, MapPin, DollarSign, Calendar, Zap, Sparkles, Loader2 } from 'lucide-react';
import {
    UserPreferences,
    PrimaryGoal,
    Urgency,
    AVAILABLE_LEVELS,
    AVAILABLE_SUBJECTS,
    GOAL_LABELS,
    URGENCY_LABELS
} from '../types/preferences';
import { preferencesService } from '../services/preferencesService';

interface OnboardingModalProps {
    onComplete: (preferences: UserPreferences) => void;
    onSkip?: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onSkip }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        studentLevel: '',
        primaryGoal: '' as PrimaryGoal | '',
        subjects: [] as string[],
        location: '',
        maxBudget: 5000,
        preferredSchedule: [] as string[],
        urgency: 'flexible' as Urgency
    });

    const SCHEDULE_OPTIONS = [
        'Lundi Matin', 'Lundi Après-midi', 'Lundi Soir',
        'Mardi Matin', 'Mardi Après-midi', 'Mardi Soir',
        'Mercredi Matin', 'Mercredi Après-midi', 'Mercredi Soir',
        'Jeudi Matin', 'Jeudi Après-midi', 'Jeudi Soir',
        'Vendredi Matin', 'Vendredi Après-midi', 'Vendredi Soir',
        'Samedi', 'Dimanche'
    ];

    const handleSubjectToggle = (subject: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter(s => s !== subject)
                : [...prev.subjects, subject]
        }));
    };

    const handleScheduleToggle = (slot: string) => {
        setFormData(prev => ({
            ...prev,
            preferredSchedule: prev.preferredSchedule.includes(slot)
                ? prev.preferredSchedule.filter(s => s !== slot)
                : [...prev.preferredSchedule, slot]
        }));
    };

    const canProceed = () => {
        if (step === 1) return formData.studentLevel !== '';
        if (step === 2) return formData.primaryGoal !== '' && formData.subjects.length > 0;
        if (step === 3) return formData.location !== '';
        return true;
    };

    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        if (!formData.primaryGoal) return;
        setIsCompleting(true);

        try {
            const preferences = await preferencesService.savePreferences({
                studentLevel: formData.studentLevel,
                primaryGoal: formData.primaryGoal,
                subjects: formData.subjects,
                location: formData.location,
                maxBudget: formData.maxBudget,
                preferredSchedule: formData.preferredSchedule,
                urgency: formData.urgency
            });

            onComplete(preferences);
        } catch (error) {
            console.error('[OnboardingModal] Completion error:', error);
            onComplete(formData as any);
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0f2c]/90 animate-in fade-in duration-500">
            <div className="bg-[#0a0f2c] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative">
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                
                {/* Header */}
                <div className="p-10 pb-6 relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center shadow-xl shadow-orange-400/20">
                            <Sparkles className="w-6 h-6 text-white fill-white" />
                        </div>
                        {onSkip && (
                            <button
                                onClick={onSkip}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Votre Trajectoire de Succès</h2>
                    <p className="text-indigo-100/30 text-[10px] font-bold uppercase tracking-[0.3em]">Établissons votre profil d'apprentissage</p>

                    {/* Progress */}
                    <div className="mt-8 flex gap-3">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-1000 ${
                                    i <= step ? 'bg-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-white/5'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 pt-4 min-h-[420px] relative z-10">
                    {/* Step 1: Profile */}
                    {step === 1 && (
                        <div className="animate-soft-in space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl">
                                    <BookOpen className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Profil de l'Élève</h3>
                                    <p className="text-[10px] font-bold text-indigo-100/20 uppercase tracking-widest">Identification du niveau académique</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-orange-400/40 uppercase tracking-[0.2em] ml-1">Niveau d'Études Actuel</label>
                                <select
                                    value={formData.studentLevel}
                                    onChange={e => setFormData({ ...formData, studentLevel: e.target.value })}
                                    className="w-full px-8 py-5 bg-black/20 border border-white/5 rounded-2xl focus:outline-none focus:border-orange-400/30 text-white font-semibold appearance-none scrollbar-hide"
                                >
                                    <option value="" className="bg-[#0a0f2c]">Sélectionnez une catégorie...</option>
                                    <optgroup label="Primaire" className="bg-[#0a0f2c] text-indigo-400 font-black uppercase text-[10px] tracking-widest py-4">
                                        {AVAILABLE_LEVELS.slice(0, 6).map(level => (
                                            <option key={level} value={level} className="bg-[#0a0f2c] text-white py-2">{level}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Collège" className="bg-[#0a0f2c] text-indigo-400 font-black uppercase text-[10px] tracking-widest py-4">
                                        {AVAILABLE_LEVELS.slice(6, 10).map(level => (
                                            <option key={level} value={level} className="bg-[#0a0f2c] text-white py-2">{level}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Lycée" className="bg-[#0a0f2c] text-indigo-400 font-black uppercase text-[10px] tracking-widest py-4">
                                        {AVAILABLE_LEVELS.slice(10, 17).map(level => (
                                            <option key={level} value={level} className="bg-[#0a0f2c] text-white py-2">{level}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Spécialisé" className="bg-[#0a0f2c] text-indigo-400 font-black uppercase text-[10px] tracking-widest py-4">
                                        {AVAILABLE_LEVELS.slice(17).map(level => (
                                            <option key={level} value={level} className="bg-[#0a0f2c] text-white py-2">{level}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Goals & Subjects */}
                    {step === 2 && (
                        <div className="animate-soft-in space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-500/10 rounded-2xl">
                                    <Target className="w-8 h-8 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Objectifs & Disciplines</h3>
                                    <p className="text-[10px] font-black text-indigo-100/20 uppercase tracking-widest">Ciblage des priorités stratégiques</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Objectif Principal de Réussite</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(Object.entries(GOAL_LABELS) as [PrimaryGoal, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFormData({ ...formData, primaryGoal: key })}
                                            className={`p-5 rounded-2xl border transition-all text-left group ${
                                                formData.primaryGoal === key
                                                ? 'border-orange-400 bg-orange-400/10 text-white'
                                                : 'border-white/5 bg-black/20 text-white/40 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="font-bold text-[11px] uppercase tracking-widest leading-tight">{label}</span>
                                        </button>
                                    ))}
                                </div>

                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Disciplines de Prédilection</label>
                                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto scrollbar-hide p-1">
                                    {AVAILABLE_SUBJECTS.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => handleSubjectToggle(subject)}
                                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                formData.subjects.includes(subject)
                                                ? 'bg-orange-400 text-white border-orange-400 shadow-lg shadow-orange-400/20'
                                                : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Logistics */}
                    {step === 3 && (
                        <div className="animate-soft-in space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl">
                                    <MapPin className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Logistique Élite</h3>
                                    <p className="text-[10px] font-black text-indigo-100/20 uppercase tracking-widest">Optimisation du déploiement</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Zone de Résidence</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Ex: Akpakpa"
                                            className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl focus:outline-none focus:border-orange-400/30 text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Degré d'Urgence</label>
                                        <div className="flex gap-2 h-[52px]">
                                            {(Object.entries(URGENCY_LABELS) as [Urgency, string][]).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setFormData({ ...formData, urgency: key })}
                                                    className={`flex-1 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                                        formData.urgency === key
                                                        ? 'bg-orange-400 text-white border-orange-400'
                                                        : 'bg-white/5 text-white/20 border-white/5'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest">Budget Prévisionnel / Heure</label>
                                        <span className="text-orange-400 font-bold text-lg tracking-tight">{formData.maxBudget.toLocaleString()} FCFA</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="10000"
                                        step="500"
                                        value={formData.maxBudget}
                                        onChange={e => setFormData({ ...formData, maxBudget: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-orange-400"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Disponibilités Tactiques</label>
                                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto scrollbar-hide p-1">
                                        {SCHEDULE_OPTIONS.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleScheduleToggle(slot)}
                                                className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all border ${
                                                    formData.preferredSchedule.includes(slot)
                                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                                    : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer CTAs */}
                <div className="p-10 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1}
                        className="flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-white disabled:opacity-0 transition-all uppercase tracking-[0.3em]"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        RETOUR
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => canProceed() && setStep(step + 1)}
                            disabled={!canProceed()}
                            className="btn-premium px-10 py-4 text-[11px] flex items-center gap-4"
                        >
                            ÉLÉMENT SUIVANT
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={!canProceed() || isCompleting}
                            className="btn-premium px-12 py-4 text-[11px] flex items-center gap-4 bg-orange-400 text-white border-orange-400 shadow-orange-400/20"
                        >
                            {isCompleting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Zap className="w-5 h-5 fill-white" />
                                    INITIALISER SMARTMATCH™
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
