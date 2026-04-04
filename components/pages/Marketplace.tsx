import React from 'react';
import TeacherCard from '../TeacherCard';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Teacher } from '../../types';

interface MarketplaceProps {
  teachers: Teacher[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (val: string[]) => void;
  onTeacherClick: (teacher: Teacher) => void;
  isLoading: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'Tous les niveaux' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'college', label: 'Collège' },
  { id: 'lycee', label: 'Lycée' },
  { id: 'universitaire', label: 'Universitaire' },
];

const Marketplace: React.FC<MarketplaceProps> = ({
  teachers,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  selectedSubjects,
  setSelectedSubjects,
  onTeacherClick,
  isLoading
}) => {
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || activeCategory === 'Tous' || 
                            t.levels?.some(l => l.toLowerCase().includes(activeCategory));
    const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.some(s => t.subject === s);
    return matchesSearch && matchesCategory && matchesSubjects;
  });

  const hasActiveFilters = searchTerm || activeCategory !== 'all' || selectedSubjects.length > 0;
  const resetFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setSelectedSubjects([]);
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 md:px-8 py-12">

        {/* ── En-tête ── */}
        <div className="mb-10">
          <span className="section-eyebrow">Catalogue des Mentors</span>
          <h1 className="section-title text-4xl md:text-5xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Trouvez <em style={{ color: 'var(--primary)' }}>votre</em> mentor idéal
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLoading ? 'Chargement...' : `${filteredTeachers.length} mentor${filteredTeachers.length !== 1 ? 's' : ''} disponible${filteredTeachers.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* ── Barre de recherche ── */}
        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher par matière, nom, quartier..."
            className="form-input-sopa form-input-icon pr-12 text-base"
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* ── Filtres de catégorie ── */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat.id
                  ? 'text-white shadow-md'
                  : 'hover:border-gray-300'
              }`}
              style={activeCategory === cat.id
                ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' }
                : { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)', color: 'var(--text-muted)' }
              }
            >
              {cat.label}
            </button>
          ))}

          {/* Reset si filtres actifs */}
          {hasActiveFilters && (
            <button onClick={resetFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* ── Grille des Mentors ── */}
        {isLoading ? (
          /* Skeleton loaders */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl shimmer" />
            ))}
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            {filteredTeachers.map(teacher => (
              <TeacherCard 
                key={teacher.id} 
                teacher={teacher} 
                onClick={() => onTeacherClick(teacher)} 
              />
            ))}
          </div>
        ) : (
          /* État vide */
          <div className="text-center py-32 minsii-card max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--primary-light)' }}>
              <Search className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              Aucun mentor trouvé
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Modifiez vos filtres ou essayez une autre recherche.
            </p>
            <button onClick={resetFilters} className="btn-minsii px-6 py-2.5 text-sm">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
