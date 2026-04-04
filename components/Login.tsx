import React from 'react';
import { Mail, Lock, ArrowRight, Chrome, Sparkles, Loader2, ShieldCheck, GraduationCap, Star } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [mode, setMode] = React.useState<'login' | 'forgot-password'>('login');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (mode === 'forgot-password') {
      try {
        const { error: resetError } = await authService.resetPasswordForEmail(email);
        if (resetError) {
          setError(resetError);
        } else {
          setSuccess('Email de réinitialisation envoyé. Consultez votre boîte de réception.');
          // Automatiquement revenir au login après un délai si on veut, ou laisser l'utilisateur lire
        }
      } catch (err) {
        setError('Une erreur est survenue.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const password = formData.get('password') as string;

    try {
      const { data: user, error: loginError } = await authService.login(email, password);
      if (loginError) {
        if (loginError.includes('Invalid login credentials')) {
          setError('Identifiants invalides. Vérifiez votre email et mot de passe.');
        } else if (loginError.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter.');
        } else if (loginError.includes('rate limit')) {
          setError('Trop de tentatives. Patientez quelques minutes.');
        } else {
          setError(loginError);
        }
      } else if (user) {
        onSuccess();
      }
    } catch (err) {
      setError('Erreur de connexion au serveur. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Layout split : panneau bleu gauche + formulaire ivoire droit */
    <div className="auth-page">

      {/* ── Panneau Gauche — Brand Panel ── */}
      <div className="auth-brand-panel hidden md:flex">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.2)', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.15)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 text-white max-w-xs">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Minsii</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
            {mode === 'login' ? 'Bon retour parmi nous. 🇧🇯' : 'Récupérez votre accès. 🛡️'}
          </h1>
          <p className="text-white/70 leading-relaxed mb-12">
            {mode === 'login' 
              ? "Retrouvez vos mentors, suivez la progression de vos enfants et connectez-vous avec l'excellence béninoise."
              : "Entrez votre email pour recevoir les instructions de réinitialisation de votre mot de passe."}
          </p>

          {/* Témoignages de confiance */}
          <div className="space-y-4">
            {[
              { stat: '10,000+', label: 'Élèves impactés' },
              { stat: '500+', label: 'Mentors vérifiés' },
              { stat: '98%', label: 'Taux de satisfaction' },
            ].map(({ stat, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/80 text-sm">
                  <strong className="text-white">{stat}</strong> {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panneau Droit — Formulaire ── */}
      <div className="auth-form-panel">
        <div className="w-full max-w-sm">

          {/* En-tête mobile seulement */}
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>Minsii</span>
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
            {mode === 'login' ? 'Connexion' : 'Mot de passe oublié'}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button onClick={onSwitchToSignup} className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                  Créer un compte
                </button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="font-semibold hover:underline flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                Retour à la connexion
              </button>
            )}
          </p>

          {/* Erreur */}
          {error && (
            <div className="alert-error mb-6 animate-soft-in">
              {error}
            </div>
          )}

          {/* Succès */}
          {success && (
            <div className="p-4 rounded-[var(--radius-serenity)] bg-green-500/10 border border-green-500/20 text-green-700 text-sm mb-6 animate-soft-in">
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input-sopa form-input-icon"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe (seulement en mode login) */}
            {mode === 'login' && (
              <div>
                <label className="form-label" htmlFor="login-password">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="form-input-sopa form-input-icon"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" style={{ accentColor: 'var(--primary)' }} />
                  Rester connecté
                </label>
                <button 
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="hover:underline font-medium" 
                  style={{ color: 'var(--primary)' }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-minsii w-full py-3.5 text-base mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Réinitialiser'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          {mode === 'login' && (
            <>
              <div className="relative flex items-center gap-4 my-7">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-main)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ou continuer avec</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-main)' }} />
              </div>

              {/* Google */}
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
                Continuer avec Google
              </button>
            </>
          )}

          {/* Badge confiance */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            Connexion sécurisée · Données protégées
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
