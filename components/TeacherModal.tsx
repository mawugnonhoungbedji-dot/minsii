
import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Clock, GraduationCap, Phone, CheckCircle, BrainCircuit, Loader2, Sparkles, MessageCircle, FileCheck, ExternalLink, Calendar, Lightbulb, TrendingUp } from 'lucide-react';
import { Teacher } from '../types';
import { getLearningPlan } from '../services/matchingService';
import { authService } from '../services/authService';
import { reviewService, Review } from '../services/reviewService';
import { analyticsService } from '../services/analyticsService';
import ReviewSection from './ReviewSection';

interface TeacherModalProps {
  teacher: Teacher;
  onClose: () => void;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ teacher, onClose }) => {
  const [learningPlan, setLearningPlan] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [showDiploma, setShowDiploma] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const teacherReviews = await reviewService.getReviewsForTeacher(teacher.id);
    setReviews(teacherReviews);
  };

  useEffect(() => {
    authService.getCurrentUser().then(setUser).catch(console.error);
    fetchReviews();
  }, [teacher.id]);

  const userName = user?.profile?.name || "un parent";
  const rawPhone = teacher.phoneNumber.replace(/[^0-9]/g, '');
  const finalPhone = rawPhone.startsWith('229') ? rawPhone : `229${rawPhone}`;

  const message = `Bonjour M. ${teacher.name.split(' ')[1]}, je suis ${userName}. J'ai vu votre profil sur Minsii et je suis intéressé par des cours de ${teacher.subject} à ${teacher.location}. Êtes-vous disponible ?`;
  const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

  const generatePlan = async () => {
    setIsLoadingPlan(true);
    await analyticsService.recordContact(teacher.id, teacher.name, 'view', user?.profile?.name || 'Visiteur');
    try {
      const plan = await getLearningPlan(teacher.subject, "Réussir mon examen de fin d'année avec mention");
      setLearningPlan(plan || "Désolé, nous n'avons pas pu générer le plan pour le moment.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleWhatsApp = async () => {
    await analyticsService.recordContact(teacher.id, teacher.name, 'whatsapp', user?.profile?.name || 'Visiteur');
  };

  const handleCall = async () => {
    await analyticsService.recordContact(teacher.id, teacher.name, 'call', user?.profile?.name || 'Visiteur');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0f2c]/80 animate-in fade-in duration-300">
      <div className="bg-[#0a0f2c] w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Identity Center */}
        <div className="w-full md:w-[35%] bg-white/5 p-10 overflow-y-auto border-r border-white/5 scrollbar-hide">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-8">
              <div className="breathing-ring rounded-[2.5rem]">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-36 h-36 rounded-[2.5rem] object-cover ring-4 ring-white/10 shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white p-2 rounded-[1.2rem] border-4 border-[#0a0f2c] shadow-xl">
                <CheckCircle className="w-5 h-5 fill-current" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{teacher.name}</h2>
            <p className="text-orange-400 font-semibold uppercase tracking-[0.2em] text-[10px] mb-6">{teacher.subject}</p>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-bold text-white text-lg">{teacher.rating}</span>
              <span className="text-indigo-100/30 text-[10px] font-bold uppercase tracking-widest">({teacher.reviewsCount} avis)</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="p-3 bg-indigo-500/10 rounded-2xl">
                <MapPin className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-indigo-100/20 uppercase tracking-[0.2em] mb-1">Localisation</p>
                <p className="text-sm font-semibold text-white">{teacher.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="p-3 bg-orange-500/10 rounded-2xl">
                <GraduationCap className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-indigo-100/20 uppercase tracking-[0.2em] mb-1">Expertise</p>
                <p className="text-sm font-bold text-white leading-tight">{teacher.education}</p>
                {teacher.diplomaUrl && (
                  <button
                    onClick={() => setShowDiploma(!showDiploma)}
                    className="mt-3 text-[10px] flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest hover:text-emerald-300 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Vérifier le diplôme
                  </button>
                )}
                {showDiploma && teacher.diplomaUrl && (
                  <div className="mt-4 relative group cursor-zoom-in rounded-2xl overflow-hidden" onClick={() => window.open(teacher.diplomaUrl, '_blank')}>
                    <img src={teacher.diplomaUrl} className="w-full h-24 object-cover opacity-60 hover:opacity-100 transition-opacity" alt="diplome" />
                    <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-100 pointer-events-none">
                      <ExternalLink className="text-white w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold text-indigo-100/20 uppercase tracking-[0.2em] mb-3">Disponibilités</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.availability.map(slot => (
                    <span key={slot} className="bg-white/5 text-white/60 px-3 py-1.5 rounded-xl text-[10px] font-semibold border border-white/5 uppercase tracking-tighter">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Excellence Center */}
        <div className="w-full md:w-[65%] p-10 md:p-16 overflow-y-auto scrollbar-hide">
          <div className="animate-soft-in space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[10px] font-black text-indigo-100/20 uppercase tracking-[0.4em]">À PROPOS DE L'EXPERT</p>
              </div>
              <p className="text-indigo-100/60 leading-relaxed text-xl font-medium italic border-l-4 border-orange-400/20 pl-8 py-2">
                "{teacher.bio}"
              </p>
            </section>

            <section>
              <p className="text-[10px] font-black text-indigo-100/20 uppercase tracking-[0.4em] mb-6">NIVEAUX D'ÉLITE</p>
              <div className="flex flex-wrap gap-3">
                {teacher.levels.map(level => (
                  <span key={level} className="bg-white/5 text-white px-6 py-3 rounded-[1.2rem] text-[11px] font-black border border-white/5 uppercase tracking-widest shadow-xl">
                    {level}
                  </span>
                ))}
              </div>
            </section>

            {teacher.methodology && (
              <section>
                <p className="text-[10px] font-black text-indigo-100/20 uppercase tracking-[0.4em] mb-6">VISION PÉDAGOGIQUE</p>
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-orange-400/40" />
                  <p className="text-white text-lg font-bold leading-relaxed">
                    {teacher.methodology}
                  </p>
                </div>
              </section>
            )}

            <section>
                <ReviewSection reviews={reviews} teacherId={teacher.id} currentUser={user} onReviewSubmitted={fetchReviews} variant="dark" />
            </section>

            {/* AI Roadmap Center */}
            <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="w-32 h-32 text-orange-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="bg-orange-400 p-4 rounded-2xl shadow-xl shadow-orange-400/20">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white tracking-tight">Strategic Roadmap</h4>
                    <p className="text-indigo-100/30 text-[10px] font-bold uppercase tracking-[0.2em]">Propulsé par SmartMatch AI</p>
                  </div>
                </div>
                
                <p className="text-indigo-100/60 mb-10 leading-relaxed font-medium text-lg">
                  Découvrez la stratégie de réussite conçue par notre IA spécifiquement pour le profil de <strong className="text-white">{teacher.name.split(' ')[1]}</strong>.
                </p>

                {learningPlan ? (
                  <div className="bg-black/40 rounded-[2rem] p-8 shadow-inner border border-white/5 animate-soft-in">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Plan d'Excellence Généré</span>
                      <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
                    </div>
                    <div className="text-indigo-100/80 prose prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {learningPlan}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={generatePlan}
                    disabled={isLoadingPlan}
                    className="btn-premium w-full py-6 text-sm"
                  >
                    {isLoadingPlan ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 fill-white" />
                        Générer ma Roadmap d'Excellence
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Final CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 pt-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="flex-1 bg-emerald-500 text-white h-16 rounded-[1.2rem] font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl group"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                Conciergerie WhatsApp
              </a>
              <a
                href={`tel:${teacher.phoneNumber}`}
                onClick={handleCall}
                className="flex-1 bg-white text-[#06091F] h-16 rounded-[1.2rem] font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-orange-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
              >
                <Phone className="w-4 h-4" />
                Appel Direct
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherModal;
