import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, BookOpen, Users, Compass, 
  ShieldCheck, ArrowLeft, Briefcase, 
  FileText, Lightbulb, CreditCard, 
  Layers, Database, Sparkles, GraduationCap, Clock, Heart, UserCheck, ChevronRight, Download, Shield
} from 'lucide-react';

interface InfoPagesProps {
  type: 'faq' | 'mentor-guide' | 'parent-guide' | 'resources' | 'ethics' | 'services' | 'career' | 'blog' | 'material' | 'series' | 'expertise-ia' | 'payments';
}

const InfoPages: React.FC<InfoPagesProps> = ({ type }) => {
  const navigate = useNavigate();
  const renderFAQ = () => (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--primary-light)' }}>
          <HelpCircle className="w-8 h-8" style={{ color: 'var(--primary)' }} />
        </div>
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Foire aux Questions (FAQ)</h1>
      </div>
      <div className="space-y-6">
        {[
          { q: "Comment fonctionne le paiement par Mobile Money ?", a: "Une fois le mentor sélectionné, vous payez via l'interface MTN ou Moov Money intégrée. Minsii sécurise les fonds et ne les reverse au mentor qu'après confirmation du cours." },
          { q: "Les mentors sont-ils vraiment vérifiés ?", a: "Oui. Nous exigeons systématiquement le diplôme, une pièce d'identité et nous menons un entretien pédagogique pour évaluer la capacité à transmettre le savoir." },
          { q: "Puis-je changer de mentor si je ne suis pas satisfait ?", a: "Absolument. Si le premier cours ne répond pas à vos attentes, nous vous aidons à trouver un remplaçant gratuitement." },
          { q: "Quel est le tarif moyen d'un cours ?", a: "Le tarif varie entre 2500 FCFA/h pour le primaire et jusqu'à 7000 FCFA/h pour les séries d'élite comme la Terminale C." },
          { q: "Proposez-vous des cours en ligne ?", a: "Minsii privilégie le contact humain à domicile, mais certains mentors proposent des sessions hybrides via Zoom ou Google Meet." }
        ].map((item, idx) => (
          <div key={idx} className="minsii-card">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--primary)' }} /> {item.q}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
          </div>
        ))}
      </div>
    </>
  );

  const renderMentorGuide = () => (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Guide du Mentor</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" /> Optimiser votre Profil
          </h2>
          <p className="mb-4">Un profil complet attire 4x plus de parents. Mettez en avant vos diplômes (CAPES, Doctorat, etc.) et votre spécialité (Série C, D, G).</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Utilisez une photo professionnelle et souriante.</li>
            <li>Détaillez vos quartiers d'intervention (Fidjrossè, Calavi, Porto-Novo).</li>
            <li>Utilisez l'outil IA de Minsii pour générer des plans d'études convaincants.</li>
          </ul>
        </section>

        <section className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
             <GraduationCap className="w-5 h-5 text-indigo-600" /> Pendant le cours
          </h2>
          <p className="text-sm">L'approche par compétences (APC) est la norme au Bénin. Vos cours doivent être interactifs et tournés vers la résolution de problèmes réels d'examen.</p>
        </section>

        <section className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Clock className="w-5 h-5 text-indigo-600" /> Ponctualité et Suivi
          </h2>
          <p className="text-sm">Arriver 5 minutes avant l'heure est un gage de professionnalisme. Envoyez un bref rapport de progrès au parent via Minsii après chaque session.</p>
        </section>
      </div>
    </>
  );

  const renderResources = () => (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Ressources Pédagogiques</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Annales BAC 2024 - Série D", type: "PDF", size: "2.4 MB" },
          { title: "Méthodologie Dissertation Philo (A/C/D)", type: "Guide", size: "1.1 MB" },
          { title: "Sujets Types BEPC 2024", type: "PDF", size: "3.2 MB" },
          { title: "Guide de l'APC pour les parents", type: "Livre Blanc", size: "0.8 MB" }
        ].map((res, idx) => (
          <div key={idx} className="minsii-card p-6 flex justify-between items-center group hover:border-[#1e1edc]/20 transition-all cursor-pointer">
            <div>
              <h3 className="font-bold text-gray-900">{res.title}</h3>
              <p className="text-xs text-gray-400 font-semibold tracking-wider">{res.type} • {res.size}</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-[#1e1edc] group-hover:text-white transition-all">
              <Download className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 bg-indigo-900 rounded-[3rem] text-white">
        <h3 className="text-xl font-bold mb-4">Bibliothèque Minsii Premium</h3>
        <p className="text-sm text-indigo-100 mb-6">Accédez à plus de 500 fiches de révisions exclusives conçues par les meilleurs inspecteurs pédagogiques du Bénin.</p>
        <button className="bg-white text-[#1e1edc] px-8 py-3 rounded-xl font-bold text-xs tracking-wider">S'abonner aux ressources</button>
      </div>
    </>
  );

  const renderEthics = () => (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-red-50 rounded-2xl text-red-600">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Charte Éthique Minsii</h1>
      </div>
      <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-8">
        <div className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Intégrité et Honnêteté</h2>
          <p className="text-sm">Le mentor s'engage à fournir des informations exactes sur ses diplômes et son expérience. Toute fraude entraîne une exclusion définitive de la plateforme.</p>
        </div>
        <div className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Respect de la Vie Privée</h2>
          <p className="text-sm">Le mentor et le parent s'engagent à respecter la vie privée mutuelle lors des interventions à domicile. La discrétion est une valeur fondamentale de Minsii.</p>
        </div>
        <div className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sécurité des Mineurs</h2>
          <p className="text-sm">La sécurité des élèves est notre priorité absolue. Les mentors s'engagent à adopter un comportement exemplaire et protecteur à tout instant.</p>
        </div>
        <div className="minsii-card p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Neutralité</h2>
          <p className="text-sm">Les cours doivent rester strictement académiques. Toute propagande politique, religieuse ou idéologique est formellement interdite.</p>
        </div>
      </div>
    </>
  );

  const renderParentGuide = () => (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-green-50 rounded-2xl text-green-600">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Choisir le Mentor Idéal</h1>
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="minsii-card p-8 rounded-[3rem]">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Étape 1 : Définir le besoin</h3>
            <p className="text-sm text-gray-500 mb-4">S'agit-il d'un rattrapage ponctuel ou d'un accompagnement longue durée ? Identifiez la série (C, D, A, G) de l'élève en priorité.</p>
            <div className="p-4 bg-indigo-50 rounded-2xl text-xs font-bold text-indigo-600 italic">
              "Un élève en Série C a besoin d'un mentor capable d'approfondir les démonstrations complexes."
            </div>
          </div>
          <div className="minsii-card p-8 rounded-[3rem]">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Étape 2 : Analyser le Profil</h3>
            <p className="text-sm text-gray-500 mb-4">Vérifiez les avis et les badges de certification. Un mentor avec le badge "Expert BAC" est recommandé pour les classes d'examen.</p>
          </div>
        </div>
        <div className="minsii-card p-10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10">
           <div className="shrink-0 p-6 bg-[#1e1edc] rounded-3xl text-white shadow-xl">
             <Shield className="w-12 h-12" />
           </div>
           <div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Utilisez le Concierge IA</h3>
             <p className="text-gray-600 text-sm leading-relaxed">Notre intelligence artificielle analyse des milliers de points de données pour vous proposer les 2 mentors les plus compatibles avec votre quartier et votre budget.</p>
           </div>
        </div>
      </div>
    </>
  );

  const renderServices = () => (
    <div className="space-y-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-6">
          <Sparkles size={10} className="text-[var(--primary)]" />
          <span className="text-[8px] font-semibold text-[var(--primary)] opacity-40 tracking-widest">Nos Prestations</span>
        </div>
        <h1 className="text-4xl font-bold text-[var(--text-main)] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Services d'Excellence <br /><span className="text-[var(--primary)] italic font-serif">Minsii</span>
        </h1>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-xs font-semibold tracking-wide leading-relaxed">
          Nous accompagnons chaque étape du parcours académique et professionnel avec les meilleurs experts du Bénin.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: <GraduationCap />, title: "Soutien Scolaire", desc: "Cours à domicile et en ligne du CP à la Terminale." },
          { icon: <Compass />, title: "Orientation", desc: "Coaching carrière et choix de filières universitaires." },
          { icon: <Database />, title: "Préparation Concours", desc: "Entraînement intensif pour les concours d'élite." },
          { icon: <Lightbulb />, title: "Soft Skills", desc: "Développement personnel et leadership pour jeunes." }
        ].map((s, i) => (
          <div key={i} className="p-8 rounded-[var(--radius-serenity)] bg-white border border-[var(--border-main)] hover:shadow-serenity transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] mb-6">
              {s.icon}
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h3>
            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-6">
          <FileText size={10} className="text-[var(--primary)]" />
          <span className="text-[8px] font-semibold text-[var(--primary)] opacity-40 tracking-widest">Minsii Mag</span>
        </div>
        <h1 className="text-4xl font-bold text-[var(--text-main)] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Actualités & <br /><span className="text-[var(--primary)] italic font-serif">Conseils Éducatifs</span>
        </h1>
      </div>
      <div className="minsii-card p-12 text-center">
        <p className="text-[var(--text-muted)] font-bold text-xs tracking-wider mb-4">Espace en préparation</p>
        <p className="text-sm">Notre équipe éditoriale prépare des articles exclusifs pour la réussite de vos enfants.</p>
      </div>
    </div>
  );

  const renderGeneric = (title: string, subtitle: string) => (
    <div className="space-y-12 text-center">
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-6">
        <Sparkles size={10} className="text-[var(--primary)]" />
        <span className="text-[8px] font-semibold text-[var(--primary)] opacity-40 tracking-widest">Espace {title}</span>
      </div>
      <h1 className="text-4xl font-bold text-[var(--text-main)] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
        {title} <br /><span className="text-[var(--primary)] italic font-serif">Minsii Elite</span>
      </h1>
      <div className="minsii-card p-12 max-w-2xl mx-auto">
        <p className="text-sm leading-relaxed text-[var(--text-muted)] font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFAF7] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1e1edc] transition-colors tracking-wider mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </button>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-black/5 shadow-xl shadow-black/5 animate-soft-in">
          {type === 'faq' && renderFAQ()}
          {type === 'mentor-guide' && renderMentorGuide()}
          {type === 'resources' && renderResources()}
          {type === 'ethics' && renderEthics()}
          {type === 'parent-guide' && renderParentGuide()}
          {type === 'services' && renderServices()}
          {type === 'blog' && renderBlog()}
          
          {type === 'career' && renderGeneric("Carrières", "Rejoignez l'élite éducative du Bénin. Nous recrutons des talents passionnés par la transmission du savoir.")}
          {type === 'material' && renderGeneric("Matériel Didactique", "Découvrez notre sélection d'outils et de supports pour optimiser l'apprentissage à domicile.")}
          {type === 'series' && renderGeneric("Séries d'Élite", "Focus sur les séries d'excellence (Terminales C, D, E) avec des mentors spécialisés.")}
          {type === 'expertise-ia' && renderGeneric("Expertise IA", "Comment Minsii utilise l'intelligence artificielle pour personnaliser le parcours de chaque élève.")}
          {type === 'payments' && renderGeneric("Système de Paiement", "Sécurité totale via Mobile Money (MTN & Moov) avec séquestre de protection.")}

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest">
            <p>© 2025 Minsii Education — Excellence Académique</p>
            <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="hover:text-[#1e1edc] transition-colors"
            >
              Retour en haut ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPages;
