import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Scale, Info, ArrowLeft, Cookie, Lock } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'cgu' | 'mentions' | 'cookies' | 'security';
}

const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const navigate = useNavigate();
  const renderMentions = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--primary-light)' }}>
          <Info className="w-8 h-8" style={{ color: 'var(--primary)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Mentions Légales</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Éditeur de la Plateforme</h2>
          <p>
            La plateforme <strong>Minsii</strong> est éditée par la société <strong>MINSII EDUCATION SARL</strong>, 
            société de droit béninois au capital de 1.000.000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier (RCCM) 
            de Cotonou sous le numéro RB/COT/24 B XXXX.
          </p>
          <p className="mt-2">
            <strong>Siège Social :</strong> Quartier Haie Vive, Avenue de l'Indépendance, Immeuble Minsii, Cotonou, Bénin.
          </p>
          <p>
            <strong>Contact :</strong> support@minsii.bj | +229 6X XX XX XX
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Directeur de la Publication</h2>
          <p>M. Jean-Marc Dossou, Directeur Général de Minsii Education.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
          <p>
            La plateforme est hébergée sur les infrastructures de Google Cloud Platform (GCP).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant la plateforme (textes, graphismes, logiciels, photographies, images, logos, etc.) 
            sont la propriété exclusive de MINSII EDUCATION SARL ou de ses partenaires. Toute reproduction, même partielle, est strictement interdite.
          </p>
        </section>
      </div>
    </>
  );

  const renderCGU = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--secondary-light)' }}>
          <Scale className="w-8 h-8" style={{ color: 'var(--secondary)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Conditions Générales (CGU)</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Objet du Service</h2>
          <p>
            Minsii est une plateforme de mise en relation entre des enseignants (Mentors) et des familles (Parents/Élèves) pour des cours à domicile au Bénin.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Processus de Vérification</h2>
          <p>
            Chaque Mentor sur Minsii fait l'objet d'un processus rigoureux : 
            vérification de l'identité, contrôle des diplômes et entretien pédagogique. 
            Toutefois, Minsii ne peut être tenu responsable d'incidents survenant pendant les cours à domicile, 
            le Mentor agissant en tant que prestataire indépendant.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Paiements et Sécurité</h2>
          <p>
            Les paiements s'effectuent exclusivement via la plateforme par <strong>MTN Mobile Money</strong> ou <strong>Moov Money</strong>. 
            Les fonds sont conservés par Minsii et versés au Mentor après validation du cours par le Parent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Annulation et Remboursement</h2>
          <p>
            Toute annulation par le Parent moins de 12 heures avant le cours peut entraîner une pénalité de 50% du tarif horaire. 
            Si le Mentor ne se présente pas, le Parent est remboursé intégralement.
          </p>
        </section>
      </div>
    </>
  );

  const renderPrivacy = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--accent-light)' }}>
          <Shield className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Confidentialité</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Données Collectées</h2>
          <p>
            Nous collectons les données nécessaires au bon fonctionnement du service : 
            Nom, Prénom, Numéro de téléphone (pour Mobile Money), Adresse e-mail, Quartier de résidence et parcours académique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Utilisation des Données</h2>
          <p>
            Vos données sont utilisées pour : 
            Mettre en relation parents et enseignants, traiter les paiements, envoyer des notifications importantes 
            et améliorer notre algorithme de recommandation IA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Protection de la Vie Privée (APDP)</h2>
          <p>
            Minsii s'engage à respecter les directives de l'Autorité de Protection des Données à Caractère Personnel (APDP) du Bénin. 
            Vos données ne sont jamais vendues à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Vos Droits</h2>
          <p>
            Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles 
            en envoyant une demande à privacy@minsii.bj.
          </p>
        </section>
      </div>
    </>
  );
  const renderCookies = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--primary-light)' }}>
          <Cookie className="w-8 h-8" style={{ color: 'var(--primary)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Politique des Cookies</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Utilisation des Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et sécuriser vos sessions. 
            Certains sont indispensables au bon fonctionnement technique de la plateforme Minsii.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Vos Choix</h2>
          <p>
            Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies, mais cela pourrait affecter 
            certaines fonctionnalités essentielles comme la connexion à votre dashboard.
          </p>
        </section>
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--accent-light)' }}>
          <Lock className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Sécurité des Données</h1>
      </div>
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Standards de Sécurité</h2>
          <p>
            Toutes les communications sur Minsii sont chiffrées via TLS (SSL). Vos données sont stockées sur des serveurs 
            sécurisés certifiés ISO 27001.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Sécurité des Paiements</h2>
          <p>
            Minsii ne stocke aucune information bancaire. Les transactions Mobile Money sont gérées directement par les opérateurs (MTN/Moov) 
            via des passerelles de paiement sécurisées et agréées par la BCEAO.
          </p>
        </section>
      </div>
    </>
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
          {type === 'mentions' && renderMentions()}
          {type === 'cgu' && renderCGU()}
          {type === 'privacy' && renderPrivacy()}
          {type === 'cookies' && renderCookies()}
          {type === 'security' && renderSecurity()}

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest">
            <p>© 2025 Minsii Education — Tous droits réservés</p>
            <div className="flex gap-6">
              <span className="hover:text-[#1e1edc] cursor-pointer">Bénin</span>
              <span className="hover:text-[#1e1edc] cursor-pointer">International</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
