import React, { useState } from 'react';
import { X, CheckCircle, Zap } from 'lucide-react';

interface MultiSelectProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (val: string[]) => void;
    allowCustom?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange, allowCustom = false }) => {
    const [showInput, setShowInput] = useState(false);
    const [customVal, setCustomVal] = useState('');

    const toggleOption = (opt: string) => {
        if (selected.includes(opt)) {
            onChange(selected.filter(i => i !== opt));
        } else {
            onChange([...selected, opt]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">{label}</label>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus-within:bg-white focus-within:border-indigo-500 transition-all shadow-inner min-h-[4rem]">
                {selected.length === 0 && !showInput && (
                    <p className="text-xs text-gray-400 font-bold italic py-2 ml-2">Sélectionnez au moins une option...</p>
                )}
                {selected.map(item => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => toggleOption(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-100"
                    >
                        {item}
                        <X className="w-3.5 h-3.5" />
                    </button>
                ))}

                <div className="w-full h-px bg-gray-100 my-2"></div>

                <div className="flex flex-wrap gap-2 w-full">
                    {options.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOption(opt)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selected.includes(opt)
                                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                                    : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                    {allowCustom && (
                        <div className="flex items-center gap-2">
                            {showInput ? (
                                <div className="flex bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-sm animate-in slide-in-from-left-2 duration-300">
                                    <input
                                        type="text"
                                        value={customVal}
                                        onChange={(e) => setCustomVal(e.target.value)}
                                        className="px-3 py-1.5 text-xs outline-none w-32"
                                        placeholder="Autre..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (customVal.trim() && !selected.includes(customVal.trim())) {
                                                    onChange([...selected, customVal.trim()]);
                                                    setCustomVal('');
                                                    setShowInput(false);
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (customVal.trim() && !selected.includes(customVal.trim())) {
                                                onChange([...selected, customVal.trim()]);
                                                setCustomVal('');
                                                setShowInput(false);
                                            }
                                        }}
                                        className="bg-indigo-600 text-white px-2 hover:bg-indigo-700 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowInput(true)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-600 transition-all flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4" /> AJOUTER
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;
