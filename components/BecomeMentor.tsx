import React, { useState } from 'react';
import { BadgeCheck, Trophy, Target, Heart, ArrowRight, Loader2, CheckCircle2, Star, Users, TrendingUp } from 'lucide-react';
import { teacherService } from '../services/teacherService';

const WHY_MINSII = [
  {
    icon: <Trophy className="w-6 h-6" style={{ color: 'var(--primary)' }} />,
    title: "Visibilité Maximum",
    desc: "Mis en relation avec des centaines de parents dans votre zone géographique dès le premier jour.",
    bg: 'var(--primary-light)'
  },
  {
    icon: <Target className="w-6 h-6" style={{ color: 'var(--secondary)' }} />,
    title: "Liberté Totale",
    desc: "Fixez vos propres tarifs et gérez votre emploi du temps selon vos disponibilités.",
    bg: 'var(--secondary-light)'
  },
  {
    icon: <Heart className="w-6 h-6" style={{ color: 'var(--accent)' }} />,
    title: "Outils de Succès",
    desc: "Tableau de bord complet pour suivre vos séances, vos gains et la progression de vos élèves.",
    bg: 'var(--accent-light)'
  },
];

const STATS = [
  { value: '500+', label: 'Mentors actifs' },
  { value: '10k+', label: 'Élèves aidés' },
  { value: '98%', label: 'Satisfaction' },
];

const BecomeMentor: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Mathématiques',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { success, error: apiError } = await teacherService.applyToBeMentor({
        full_name: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        bio: formData.bio
      });
      if (success) setSubmitted(true);
      else setError(apiError || "Une erreur est survenue lors de l'envoi.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── État de succès ── */
  if (submitted) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 animate-soft-in">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md"
            style={{ backgroundColor: 'var(--accent-light)' }}>
            <BadgeCheck className="w-10 h-10" style={{ color: 'var(--accent)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
            Demande reçue !
          </h2>
          <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            Merci de rejoindre la révolution éducative au Bénin. Notre équipe examinera votre profil sous <strong>48h</strong> et vous contactera par email.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', subject: 'Mathématiques', bio: '' }); }}
            className="btn-outline px-8 py-3"
          >
            Soumettre une autre demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ── Hero ── */}
      <div style={{ backgroundColor: 'var(--primary)' }}>
        <div className="container mx-auto px-4 md:px-8 py-20 text-center text-white">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 opacity-70">Devenir Mentor</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
            Partagez votre Savoir.<br />
            <em>Gagnez</em> plus.
          </h1>
          <p className="text-xl text-white/75 max-w-xl mx-auto mb-12 leading-relaxed">
            Rejoignez la plus grande communauté d'enseignants d'élite au Bénin et transformez l'avenir de vos élèves.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 flex-wrap">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Colonne Gauche — Avantages ── */}
          <div>
            <span className="section-eyebrow">Pourquoi Minsii ?</span>
            <h2 className="section-title text-3xl mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
              Une plateforme pensée pour<br />
              <em style={{ color: 'var(--primary)' }}>les enseignants</em>.
            </h2>

            <div className="space-y-6">
              {WHY_MINSII.map((item, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-main)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Témoignage */}
            <div className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-section)' }}>
              <div className="flex items-center gap-3 mb-4">
                <img src="https://ui-avatars.com/api/?name=Koffi+A&background=EEF2FF&color=2B2BEF"
                  alt="Koffi"  className="w-10 h-10 rounded-xl" />
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>Koffi A., Maths Série C</div>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" style={{ color: 'var(--secondary)' }} />)}
                  </div>
                </div>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                "Depuis que j'ai rejoint Minsii, j'ai doublé mes revenus mensuels tout en gardant la liberté de choisir mes élèves."
              </p>
            </div>
          </div>

          {/* ── Colonne Droite — Formulaire ── */}
          <div className="minsii-card" style={{ padding: '2.5rem' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              Postulez maintenant
            </h3>

            {error && <div className="alert-error mb-6">{error}</div>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label" htmlFor="full-name">Nom Complet</label>
                  <input
                    id="full-name"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input-sopa"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="subject">Matière Principale</label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input-sopa"
                  >
                    <option>Mathématiques</option>
                    <option>Français</option>
                    <option>SVT</option>
                    <option>Anglais</option>
                    <option>Physique-Chimie</option>
                    <option>Histoire-Géographie</option>
                    <option>Économie</option>
                    <option>Informatique</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="email">Email Professionnel</label>
                <input
                  id="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="form-input-sopa"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="bio">Présentez-vous en quelques lignes</label>
                <textarea
                  id="bio"
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="form-input-sopa resize-none"
                  placeholder="Décrivez votre expérience, votre pédagogie et pourquoi vous souhaitez rejoindre Minsii..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-minsii w-full py-4 text-base"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                ) : (
                  <>Envoyer ma candidature <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-5 flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              En postulant, vous acceptez nos conditions générales d'utilisation pour les enseignants.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMentor;
