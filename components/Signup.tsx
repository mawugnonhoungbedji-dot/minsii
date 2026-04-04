
import React, { useState } from 'react';
import { User, GraduationCap, Mail, Lock, ArrowRight, CheckCircle2, MapPin, BookOpen, ChevronLeft, Award, Target, Banknote, Building2, Rocket, Loader2, ShieldCheck } from 'lucide-react';
import { BENIN_LOCATIONS } from '../data/beninLocations';
import { authService } from '../services/authService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

type SignupStep = 1 | 2 | 3 | 4 | 'verify-email';

const ROLES = [
  {
    id: 'student',
    title: 'Élève / Parent',
    icon: User,
    desc: 'Trouvez le mentor parfait pour votre enfant.',
    bg: 'var(--primary-light)',
    color: 'var(--primary)',
  },
  {
    id: 'teacher',
    title: 'Mentor / Enseignant',
    icon: GraduationCap,
    desc: 'Partagez votre savoir et augmentez vos revenus.',
    bg: 'var(--secondary-light)',
    color: 'var(--secondary)',
  },
  {
    id: 'director',
    title: 'Institution d\'Excellence',
    icon: Building2,
    desc: 'Pilotez votre établissement, recrutez les meilleurs et gagnez en visibilité.',
    bg: 'var(--accent-light)',
    color: 'var(--accent)',
  },
];

const STEP_LABELS = ['Mon rôle', 'Mon compte', 'Mon profil', 'Mes objectifs'];

const Signup: React.FC<SignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState<SignupStep>(1);
  const [role, setRole] = useState<'student' | 'teacher' | 'director'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    level: '',
    diploma: '',
    subject: '',
    experience: '',
    goal: '',
    budget: '',
    phone: '',
    establishment_name: '',
    establishment_type: '',
  });

  const nextStep = () => setStep((prev) => typeof prev === 'number' ? (prev + 1) as SignupStep : prev);
  const prevStep = () => setStep((prev) => typeof prev === 'number' ? (prev - 1) as SignupStep : 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step < 4) {
      nextStep();
    } else {
      setIsLoading(true);
      try {
        const { data: _authUser, error: signupError } = await authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          location: formData.location || undefined,
          level: role === 'student' ? formData.level : undefined,
          goals: role === 'student' ? formData.goal : undefined,
          budget: role === 'student' && formData.budget ? parseInt(formData.budget) : undefined,
          subjects: role === 'teacher' && formData.subject ? [formData.subject] : (role === 'teacher' && formData.level ? [formData.level] : undefined),
          education: role === 'teacher' ? (formData.diploma || undefined) : undefined,
          experience_years: role === 'teacher' && formData.experience ? parseInt(formData.experience.replace(/\D/g, '')) : undefined,
          hourly_rate: role === 'teacher' && formData.budget ? parseInt(formData.budget) : undefined,
          teaching_philosophy: role === 'teacher' ? formData.goal : undefined,
          phone_number: formData.phone || undefined,
          establishment_name: role === 'director' ? formData.establishment_name : undefined,
          establishment_type: role === 'director' ? formData.establishment_type : undefined,
        });

        if (signupError) {
          // signupError est une string dans ApiResponse<T>, pas un objet Error
          setError(signupError);
        } else {
          setStep('verify-email');
        }
      } catch (err) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  /* ── Barre de progression ── */
  const renderProgress = () => (
    <div className="mb-10">
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor: typeof step === 'number' && step >= s ? 'var(--primary)' : 'var(--border-main)'
            }}
          />
        ))}
      </div>
      {typeof step === 'number' && (
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Étape {step} sur 4 — <span style={{ color: 'var(--primary)' }}>{STEP_LABELS[step - 1]}</span>
        </p>
      )}
    </div>
  );

  /* ── Bouton retour ── */
  const BackButton = () => (
    <button type="button" onClick={prevStep}
      className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-70"
      style={{ color: 'var(--text-muted)' }}>
      <ChevronLeft className="w-4 h-4" />
      Retour
    </button>
  );

  return (
    <div className="auth-page">

      {/* ── Panneau Gauche — Brand ── */}
      <div className="auth-brand-panel hidden md:flex">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.2)', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.15)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 text-white max-w-xs">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Minsii</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
            Rejoignez la révolution éducative 🇧🇯
          </h1>
          <p className="text-white/70 leading-relaxed mb-12">
            La plateforme de mise en relation entre mentors certifiés et familles béninoises.
          </p>

          {/* Features */}
          <div className="space-y-5">
            {[
              { icon: ShieldCheck, text: 'Mentors vérifiés par notre équipe' },
              { icon: CheckCircle2, text: 'Mise en relation directe avec les mentors' },
              { icon: Target, text: 'Matching intelligent par IA' },
              { icon: Award, text: 'Taux de succès BAC : 99%' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-white/60 shrink-0" />
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>10k+</div>
              <div className="text-sm text-white/50">Élèves aidés</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>500+</div>
              <div className="text-sm text-white/50">Mentors actifs</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panneau Droit — Formulaire ── */}
      <div className="auth-form-panel">
        <div className="w-full max-w-md">

          {/* En-tête mobile */}
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>Minsii</span>
          </div>

          {step !== 'verify-email' && (
            <>
              <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                Créer un compte
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                Déjà membre ?{' '}
                <button onClick={onSwitchToLogin} className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                  Se connecter
                </button>
              </p>
              {renderProgress()}
            </>
          )}

          {error && <div className="alert-error mb-6 animate-soft-in">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Étape 1 : Rôle ── */}
            {step === 1 && (
              <div className="animate-soft-in space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={cn(
                      "w-full flex items-center gap-5 p-5 rounded-2xl border-2 transition-all text-left",
                      role === r.id 
                        ? "shadow-premium" 
                        : "border-[var(--border-main)] backgroundColor-var(--bg-card)"
                    )}
                    style={role === r.id
                      ? { borderColor: r.color, backgroundColor: r.bg }
                      : { borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-card)' }
                    }
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: role === r.id ? r.color : 'var(--bg-section)' }}>
                      <r.icon className="w-6 h-6" style={{ color: role === r.id ? 'white' : 'var(--text-muted)' }} />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: 'var(--text-main)' }}>{r.title}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                    {role === r.id && (
                      <CheckCircle2 className="w-5 h-5 ml-auto shrink-0" style={{ color: r.color }} />
                    )}
                  </button>
                ))}

                {/* Séparateur & Google */}
                <div className="pt-4 space-y-4">
                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-[var(--border-main)]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">ou</span>
                    <div className="flex-1 h-px bg-[var(--border-main)]" />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => authService.signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-[14px] border font-bold text-sm transition-all hover:bg-white hover:shadow-premium active:scale-[0.98] border-[var(--border-main)] text-[var(--text-main)] bg-white/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    S'inscrire avec Google
                  </button>
                </div>
              </div>
            )}

            {/* ── Étape 2 : Identité ── */}
            {step === 2 && (
              <div className="animate-soft-in">
                <BackButton />
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        required type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="form-input-sopa form-input-icon"
                        placeholder={role === 'director' ? "Nom du responsable / institution" : "Votre nom et prénoms"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        required type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="form-input-sopa form-input-icon"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        required type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="form-input-sopa form-input-icon"
                        placeholder="Minimum 8 caractères"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Téléphone WhatsApp</label>
                    <div className="relative flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-[14px] text-sm font-medium"
                        style={{ backgroundColor: 'var(--bg-section)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}>
                        🇧🇯 +229
                      </div>
                      <input
                        required type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="form-input-sopa flex-1"
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        placeholder="97 00 00 00"
                      />
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-main)' }} />
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>ou</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-main)' }} />
                  </div>

                  {/* Google Signup */}
                  <button 
                    type="button" 
                    onClick={() => authService.signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-[14px] border font-bold text-sm transition-all hover:bg-white hover:shadow-premium active:scale-[0.98] border-[var(--border-main)] text-[var(--text-main)] bg-white/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    S'inscrire avec Google
                  </button>
                </div>
              </div>
            )}

            {/* ── Étape 3 : Profil ── */}
            {step === 3 && (
              <div className="animate-soft-in">
                <BackButton />
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Ville / Commune</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <select
                        required
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="form-input-sopa form-input-icon appearance-none"
                      >
                        <option value="">Sélectionner votre ville</option>
                        {BENIN_LOCATIONS.flatMap(dept =>
                          dept.communes.map(commune => (
                            <option key={commune.name} value={commune.name}>
                              {commune.name} ({dept.name})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {role === 'director' ? (
                    <>
                      <div>
                        <label className="form-label">Nom de l'établissement</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                          <input
                            required type="text"
                            value={formData.establishment_name}
                            onChange={(e) => updateFormData('establishment_name', e.target.value)}
                            className="form-input-sopa form-input-icon"
                            placeholder="Nom de l'institution"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Type d'établissement</label>
                        <select
                          required
                          value={formData.establishment_type}
                          onChange={(e) => updateFormData('establishment_type', e.target.value)}
                          className="form-input-sopa appearance-none"
                        >
                          <option value="">Sélectionner le type</option>
                          <option value="École Primaire">École Primaire</option>
                          <option value="Collège Enseignement Général">Collège Enseignement Général</option>
                          <option value="Lycée Technique / Industriel">Lycée Technique / Industriel</option>
                          <option value="Complexe Scolaire Privé">Complexe Scolaire Privé</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="form-label">
                        {role === 'student' ? "Niveau d'études" : "Spécialité principale"}
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                        <select
                          required
                          value={formData.level}
                          onChange={(e) => updateFormData('level', e.target.value)}
                          className="form-input-sopa form-input-icon appearance-none"
                        >
                          <option value="">{role === 'student' ? "Votre niveau" : "Votre spécialité"}</option>
                          {role === 'student' ? (
                            <>
                              <option value="Primaire (CI-CM2)">Primaire (CI-CM2)</option>
                              <option value="Collège (6ème-3ème)">Collège (6ème-3ème)</option>
                              <option value="Lycée Série A / C / D">Lycée Série A / C / D</option>
                              <option value="Enseignement Technique">Enseignement Technique</option>
                            </>
                          ) : (
                            <>
                              <option value="Primaire toutes matières">Primaire toutes matières</option>
                              <option value="Sciences Exactes (Maths/Phys/Chim)">Sciences Exactes (Maths/Phys/Chim)</option>
                              <option value="Lettres & Langues">Lettres & Langues</option>
                              <option value="SVT / Biologie">SVT / Biologie</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {role === 'teacher' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Plus haut diplôme</label>
                        <div className="relative">
                          <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                          <select
                            required
                            value={formData.diploma}
                            onChange={(e) => updateFormData('diploma', e.target.value)}
                            className="form-input-sopa form-input-icon appearance-none"
                          >
                            <option value="">Diplôme</option>
                            <option value="Licence / DEUG">Licence / DEUG</option>
                            <option value="Master / BAPES">Master / BAPES</option>
                            <option value="Doctorat / CAPES">Doctorat / CAPES</option>
                            <option value="Ingénieur d'État">Ingénieur d'État</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Expérience</label>
                        <div className="relative">
                          <Rocket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                          <input
                            required type="text"
                            value={formData.experience}
                            onChange={(e) => updateFormData('experience', e.target.value)}
                            className="form-input-sopa form-input-icon"
                            placeholder="Ex: 5 ans"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Étape 4 : Objectifs ── */}
            {step === 4 && (
              <div className="animate-soft-in">
                <BackButton />
                <div className="space-y-4">
                  <div>
                    <label className="form-label">
                      {role === 'student' ? "Votre ambition principale" : "Votre philosophie pédagogique"}
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3.5 top-4 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <textarea
                        required
                        value={formData.goal}
                        onChange={(e) => updateFormData('goal', e.target.value)}
                        rows={3}
                        className="form-input-sopa form-input-icon resize-none"
                        placeholder={role === 'student'
                          ? "Ex: Obtenir mention Très Bien au BAC, intégrer l'UAC..."
                          : "Ex: Approche bienveillante centrée sur la compréhension profonde..."}
                      />
                    </div>
                  </div>

                  {role !== 'director' && (
                    <div>
                      <label className="form-label">
                        {role === 'student' ? "Budget mensuel (FCFA)" : "Tarif horaire souhaité (FCFA)"}
                      </label>
                      <div className="relative">
                        <Banknote className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <input
                          required type="number"
                          min="1000" step="500"
                          value={formData.budget}
                          onChange={(e) => updateFormData('budget', e.target.value)}
                          className="form-input-sopa form-input-icon pr-24"
                          placeholder="Ex: 5000"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold"
                          style={{ color: 'var(--text-muted)' }}>
                          FCFA {role === 'teacher' ? '/ h' : '/ mois'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── État de vérification email ── */}
            {step === 'verify-email' && (
              <div className="animate-soft-in text-center py-8">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md"
                  style={{ backgroundColor: 'var(--primary-light)' }}>
                  <Mail className="w-10 h-10" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  Vérifiez votre email
                </h3>
                <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.<br />
                  Cliquez sur le lien pour activer votre compte.
                </p>

                <div className="p-5 rounded-2xl text-sm text-left mb-8 leading-relaxed"
                  style={{ backgroundColor: 'var(--primary-light)', color: 'var(--text-main)' }}>
                  <strong>Astuce :</strong> Vérifiez aussi vos spams si vous ne voyez pas l'email dans les 2 minutes.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSuccess();
                    onSwitchToLogin(); // This is just to ensure clean state, but onSuccess will navigate
                  }}
                  className="btn-minsii px-8 py-3"
                >
                  Aller à mon tableau de bord
                </button>
              </div>
            )}

            {/* ── Bouton de navigation ── */}
            {step !== 'verify-email' && (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-minsii w-full py-4 text-base mt-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {step === 4 ? 'Créer mon compte' : 'Continuer'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
