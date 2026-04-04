import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { teacherService } from '../services/teacherService';
import BrandedLoader from './BrandedLoader';
import {
  Star, MapPin, Calendar, Award, Trophy,
  CheckCircle2, Share2, ArrowLeft,
  GraduationCap, BookOpen, ShieldCheck, Briefcase,
  TrendingUp, BadgeCheck, MessageSquare, Phone, MessageCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';
import { supabase } from '../services/supabaseClient';

interface TeacherProfilePublicProps {
  teacherId: string;
  onBack: () => void;
  onContact: () => void;
}

const TeacherProfilePublic: React.FC<TeacherProfilePublicProps> = ({ teacherId, onBack, onContact }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'methode' | 'avis'>('profil');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await teacherService.getTeacherById(teacherId);
        if (res.success && res.data) {
          setTeacher(res.data);
        } else {
          console.warn('[TeacherProfilePublic] Profile not found or error:', res.error);
          setTeacher(null);
        }
      } catch (error: any) {
        console.error('[TeacherProfilePublic] Critical fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?prof=${teacherId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = async () => {
    if (!teacher) return;
    await analyticsService.recordContact(teacher.id, teacher.name, 'whatsapp', user?.profile?.name || 'Visiteur');
  };

  const handleCall = async () => {
    if (!teacher) return;
    await analyticsService.recordContact(teacher.id, teacher.name, 'call', user?.profile?.name || 'Visiteur');
  };

  if (isLoading) return <BrandedLoader message="Chargement du profil..." />;

  if (!teacher) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6 animate-soft-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--primary-light)' }}>
            <GraduationCap className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
            Mentor introuvable
          </h2>
          <p className="mb-8 text-sm leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
            Ce profil n'est plus disponible. Explorez notre catalogue pour trouver votre mentor idéal.
          </p>
          <button onClick={onBack} className="btn-minsii px-8 py-3">
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const verifiedDate = "12 Fév 2025";
  const isVerified = teacher.badges?.some(b =>
    b.toLowerCase().includes('vérifié') || b.toLowerCase().includes('certifié')
  );

  const userName = user?.profile?.name || "un parent";
  const rawPhone = (teacher.phoneNumber || "").replace(/[^0-9]/g, '');
  const finalPhone = rawPhone.startsWith('229') ? rawPhone : `229${rawPhone}`;

  const names = (teacher.name || "").split(' ');
  const displayName = names.length > 1 ? names[names.length - 1] : teacher.name;
  const message = `Bonjour M. ${displayName}, je suis ${userName}. J'ai vu votre profil sur Minsii et je suis intéressé par des cours de ${teacher.subject} à ${teacher.location}. Êtes-vous disponible ?`;
  const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="page-container">

      {/* ── Sticky Navigation Bar ── */}
      <div className="sticky top-0 z-50 bg-white/95 border-b border-black/5 animate-soft-in">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux mentors
          </button>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider border transition-all ${
              copied ? 'text-green-700' : ''
            }`}
            style={copied
              ? { backgroundColor: 'var(--accent-light)', borderColor: '#6EE7B7', color: 'var(--accent)' }
              : { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }
            }
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Lien copié !' : 'Partager'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">

        {/* ── Hero Card ── */}
        <div className="minsii-card mb-8 animate-soft-in" style={{ padding: '2.5rem' }}>
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-lg"
                style={{ border: '4px solid var(--bg-section)' }}>
                <img
                  src={teacher.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=EEF2FF&color=2B2BEF&size=160`}
                  className="w-full h-full object-cover"
                  alt={teacher.name}
                />
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border-4"
                  style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--bg-card)' }}>
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {teacher.name}
                </h1>
                {isVerified && (
                  <span className="verified-badge">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Vérifié · {verifiedDate}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-[10px] font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
                  <BookOpen className="w-4 h-4" /> {teacher.subject}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {teacher.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> {teacher.experience}
                </span>
              </div>

              {/* Note */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" style={{ color: 'var(--secondary)' }} />
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>{teacher.rating}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/ 5.0</span>
                </div>

                <div style={{ borderLeft: 'var(--border-main)', paddingLeft: '2rem' }}>
                  <span className="price-tag">{teacher.hourlyRate?.toLocaleString('fr-FR')}</span>{' '}
                  <span className="price-tag-unit">FCFA / heure</span>
                </div>
              </div>
            </div>

            {/* CTA Réservation - desktop */}
            <div className="hidden md:block shrink-0 w-64">
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--primary-light)', border: 'var(--border-main)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-main)' }}>Réserver ce mentor</p>
                <p className="text-[10px] font-semibold mb-4 italic" style={{ color: 'var(--text-muted)' }}>Contact direct via WhatsApp</p>
                
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md mb-3"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>

                <a
                  href={`tel:${teacher.phoneNumber}`}
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold border transition-all mb-4"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                >
                  <Phone className="w-4 h-4" /> Appeler
                </a>

                <button onClick={onContact} className="btn-outline w-full py-2.5 text-xs">
                  <MessageSquare className="w-4 h-4" /> Envoyer un message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs de navigation ── */}
        <div className="flex gap-1 mb-10 p-1.5 rounded-2xl max-w-sm bg-gray-50 border border-black/5">
          {([['profil', 'Profil'], ['methode', 'Méthode'], ['avis', 'Avis']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 py-3 px-4 rounded-xl text-[10px] font-bold tracking-wider transition-all"
              style={activeTab === id
                ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">

            {activeTab === 'profil' && (
              <>
                {/* Biographie */}
                <div className="minsii-card" style={{ padding: '2rem' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'var(--primary-light)' }}>
                      <Award className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    </div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                      Parcours
                    </h2>
                  </div>
                  <p className="leading-relaxed text-base whitespace-pre-line" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
                    {teacher.bio}
                  </p>
                </div>

                {/* Niveaux */}
                <div className="minsii-card" style={{ padding: '2rem' }}>
                  <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                    Niveaux enseignés
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {teacher.levels?.map((level, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'methode' && (
              <div className="minsii-card" style={{ padding: '2rem' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary-light)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                    Vision Pédagogique
                  </h2>
                </div>
                <blockquote className="text-lg italic leading-relaxed pl-5"
                  style={{ borderLeft: `3px solid var(--primary)`, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  "{teacher.methodology || "Une approche centrée sur l'élève pour débloquer son plein potentiel académique."}"
                </blockquote>
              </div>
            )}

            {activeTab === 'avis' && (
              <div className="minsii-card text-center py-16" style={{ padding: '4rem 2rem' }}>
                <Star className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--secondary)' }} />
                <p style={{ color: 'var(--text-muted)' }}>Les avis seront bientôt disponibles.</p>
              </div>
            )}
          </div>

          {/* Sidebar droite */}
          <div className="space-y-5">
            {/* CTA mobile */}
            <div className="md:hidden minsii-card" style={{ padding: '1.5rem' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Réserver ce mentor</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Contact direct via WhatsApp</p>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md mb-3"
                style={{ backgroundColor: '#10B981' }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>

              <a
                href={`tel:${teacher.phoneNumber}`}
                onClick={handleCall}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold border transition-all mb-4"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              >
                <Phone className="w-4 h-4" /> Appeler
              </a>

              <button onClick={onContact} className="btn-outline w-full py-2.5 text-sm">
                <MessageSquare className="w-4 h-4" /> Envoyer un message
              </button>
            </div>

            {/* Disponibilité */}
            <div className="minsii-card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-main)' }}>Disponibilité</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Disponible cette semaine</span>
              </div>
            </div>

            {/* Garantie */}
            <div className="minsii-card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-main)' }}>Garantie Minsii</h3>
              </div>
              <div className="space-y-2">
                {['Satisfaction 100% garantie', 'Remboursement si non satisfait', 'Support 7j/7'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            {teacher.badges?.length > 0 && (
              <div className="minsii-card" style={{ padding: '1.5rem' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Distinctions</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.badges.map(badge => (
                    <span key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--text-main)' }}>
                      <Trophy className="w-3 h-3" style={{ color: 'var(--secondary)' }} />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePublic;
