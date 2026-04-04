import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { BENIN_LOCATIONS } from '../data/beninLocations';

interface SearchableSelectProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const allCommunes = BENIN_LOCATIONS.flatMap(d => d.communes.map(c => ({ name: c.name, dept: d.name })));
    const filtered = allCommunes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dept.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-3 relative">
            <label className="text-[10px] font-semibold text-gray-400 tracking-wider ml-2">{label}</label>
            <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <input
                    type="text"
                    value={isOpen ? search : value}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch('');
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#1e1edc]/10 outline-none transition-all font-bold text-gray-900 shadow-inner"
                    placeholder={placeholder}
                />
                {isOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white rounded-[1.5rem] shadow-2xl border border-indigo-50 animate-in fade-in zoom-in-95 duration-200">
                        {filtered.length > 0 ? (
                            filtered.map(c => (
                                <button
                                    key={`${c.dept}-${c.name}`}
                                    type="button"
                                    onClick={() => {
                                        onChange(c.name);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className="w-full px-6 py-4 text-left hover:bg-indigo-50 transition-colors flex flex-col"
                                >
                                    <span className="font-bold text-[#1A1008] text-sm tracking-tight">{c.name}</span>
                                    <span className="text-[10px] font-semibold text-[#5C5248]/40 tracking-wider">{c.dept}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-[#5C5248]/40 font-bold italic text-xs">
                                Aucune commune trouvée...
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default SearchableSelect;
