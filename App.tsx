import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { authService } from './services/authService';
import { teacherService } from './services/teacherService';
import { Teacher } from './types';

// Components
// Navbar is rendered by Layout — no top-level import needed
import Layout from './components/Layout';
import BrandedLoader from './components/BrandedLoader';
import OnboardingModal from './components/OnboardingModal';
import TeacherModal from './components/TeacherModal';

// Pages
import Home from './components/pages/Home';
import Marketplace from './components/pages/Marketplace';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardClient from './components/DashboardClient';
import DashboardTeacher from './components/DashboardTeacher';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardDirector from './components/DashboardDirector';
import TeacherProfilePublic from './components/TeacherProfilePublic';
// HowItWorks is now a section embedded in Home — no standalone route import needed
import BecomeMentor from './components/BecomeMentor';
import LegalPages from './components/LegalPages';
import InfoPages from './components/InfoPages';

// Helper component to redirect users to their specific dashboard based on role
const DashboardRedirect: React.FC<{ user: any; isLoading: boolean }> = ({ user, isLoading }) => {
  if (isLoading) return <BrandedLoader message="Calcul de votre destination..." />;
  if (!user) return <Navigate to="/login" />;
  
  const role = user?.profile?.role;
  
  switch (role) {
    case 'admin':
      return <Navigate to="/dashboard-admin" />;
    case 'teacher':
      return <Navigate to="/dashboard-teacher" />;
    case 'director':
      return <Navigate to="/dashboard-director" />;
    default:
      return <Navigate to="/dashboard-client" />;
  }
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTeachersLoading, setIsTeachersLoading] = useState(true);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('[App] Auth check error:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        // Use a non-blocking profile fetch
        setIsFetchingProfile(true);
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          // BUG #9 — Déclencher l'onboarding uniquement pour les nouvelles inscriptions
          if (event === 'SIGNED_IN' && !session.user.user_metadata?.onboarding_completed) {
            const isNewUser = new Date(session.user.created_at).getTime() > Date.now() - 30_000;
            if (isNewUser) setShowOnboarding(true);
          }
        } finally {
          setIsFetchingProfile(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsFetchingProfile(false);
        if (location.pathname.includes('dashboard')) {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const fetchTeachers = async () => {
      setError(null);
      setIsTeachersLoading(true);
      try {
        const teachersRes = await teacherService.getAllTeachers();
        if (teachersRes.success && teachersRes.data) {
          setTeachers(teachersRes.data);
          const countRes = await teacherService.countTotalTeachers();
          setTeachersCount(countRes?.data ?? teachersRes.data.length);
        } else {
          setError(teachersRes.error || "Impossible de charger les mentors.");
        }
      } catch (err: any) {
        console.error('[App] Fetch teachers error:', err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setIsTeachersLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  };

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  if (isInitialLoading) {
    return <BrandedLoader message="Minsii — L'excellence béninoise..." />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      setView={(view) => navigate(view === 'home' ? '/' : `/${view}`)}
      currentView={location.pathname === '/' ? 'home' : location.pathname.substring(1)}
    >
      <Routes>
        <Route path="/" element={
          <Home 
            teachers={teachers} 
            teachersCount={teachersCount} 
            setView={(v) => navigate(`/${v}`)} 
          />
        } />
        
        <Route path="/marketplace" element={
          <Marketplace 
            teachers={teachers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={[0, 50000]}
            setPriceRange={() => {}}
            selectedSubjects={[]}
            setSelectedSubjects={() => {}}
            onTeacherClick={(t) => navigate(`/public-profile?prof=${t.id}`)}
            isLoading={isTeachersLoading}
          />
        } />
        
        <Route path="/how-it-works" element={<InfoPages type="mentor-guide" />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />
        
        <Route path="/login" element={
          <Login 
            onSuccess={() => navigate('/dashboard')} 
            onSwitchToSignup={() => navigate('/signup')} 
          />
        } />
        
        <Route path="/signup" element={
          <Signup 
            onSuccess={() => { loadUser(); navigate('/dashboard'); }} 
            onSwitchToLogin={() => navigate('/login')} 
          />
        } />
        
        <Route path="/dashboard" element={<DashboardRedirect user={user} isLoading={isFetchingProfile} />} />
        
        {/* Dashboards */}
        <Route path="/dashboard-admin" element={
          user?.profile?.role === 'admin'
            ? <DashboardAdmin user={user} onBack={() => navigate('/')} />
            : user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        <Route path="/dashboard-teacher" element={
          user?.profile?.role === 'teacher'
            ? <DashboardTeacher user={user} onBack={() => navigate('/')} teacherId={user?.profile?.id || ''} />
            : user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        <Route path="/dashboard-director" element={
          user?.profile?.role === 'director'
            ? <DashboardDirector user={user} onBack={() => navigate('/')} />
            : user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        <Route path="/dashboard-client" element={
          user?.profile?.role === 'student'
            ? <DashboardClient user={user} onBack={() => navigate('/')} />
            : user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        {/* Public Profile */}
        <Route path="/public-profile" element={
          <TeacherProfilePublic 
            teacherId={new URLSearchParams(location.search).get('prof') || ''}
            onBack={() => navigate('/marketplace')} 
            onContact={() => {
              if (user) {
                const searchParams = new URLSearchParams(location.search);
                const teacherId = searchParams.get('prof');
                navigate('/dashboard-client', { state: { tab: 'messages', contactTeacherId: teacherId } });
              } else {
                navigate('/login', { state: { from: location.pathname + location.search } });
              }
            }}          />
        } />

        {/* Info & Legal */}
        <Route path="/services" element={<InfoPages type="services" />} />
        <Route path="/career" element={<InfoPages type="career" />} />
        <Route path="/blog" element={<InfoPages type="blog" />} />
        <Route path="/material" element={<InfoPages type="material" />} />
        <Route path="/series" element={<InfoPages type="series" />} />
        <Route path="/expertise-ia" element={<InfoPages type="expertise-ia" />} />
        <Route path="/payments" element={<InfoPages type="payments" />} />
        
        <Route path="/faq" element={<InfoPages type="faq" />} />
        <Route path="/mentor-guide" element={<InfoPages type="mentor-guide" />} />
        <Route path="/parent-guide" element={<InfoPages type="parent-guide" />} />
        <Route path="/resources" element={<InfoPages type="resources" />} />
        <Route path="/ethics" element={<InfoPages type="ethics" />} />
        
        <Route path="/privacy" element={<LegalPages type="privacy" />} />
        <Route path="/cgu" element={<LegalPages type="cgu" />} />
        <Route path="/mentions" element={<LegalPages type="mentions" />} />
        <Route path="/cookies" element={<LegalPages type="cookies" />} />
        <Route path="/security" element={<LegalPages type="security" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {showOnboarding && (
        <OnboardingModal 
          onComplete={() => setShowOnboarding(false)} 
          onSkip={() => setShowOnboarding(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
