
import React, { useState, useMemo } from 'react';
import { Star, Filter, CheckCircle, User, Loader2, Send, Sparkles } from 'lucide-react';
import { reviewService, Review } from '../services/reviewService';

interface ReviewSectionProps {
    reviews: Review[];
    teacherId: string;
    currentUser: any | null;
    onReviewSubmitted?: () => void;
    variant?: 'light' | 'dark';
}

type FilterType = 'all' | 'verified' | '5' | '4' | '3';

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
    reviews, 
    teacherId, 
    currentUser, 
    onReviewSubmitted,
    variant = 'light' 
}) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const isDark = variant === 'dark';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !comment.trim()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            await reviewService.addReview({
                teacherId,
                rating,
                comment: comment.trim(),
                authorName: currentUser?.profile?.name || 'Parent Minsii',
                authorAvatar: currentUser?.profile?.avatar_url || '',
                isVerified: true
            });

            setMessage({ type: 'success', text: 'Merci pour votre avis ! Il a été publié avec succès.' });
            setRating(0);
            setComment('');
            setShowForm(false);
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la publication de l\'avis.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) return { average: 0, distribution: [0, 0, 0, 0, 0], total: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / total;
        const distribution = [5, 4, 3, 2, 1].map(rating =>
            reviews.filter(r => r.rating === rating).length
        );
        return { average, distribution, total };
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        let filtered = [...reviews];
        if (filter === 'verified') {
            filtered = filtered.filter(r => r.isVerified);
        } else if (filter === '5') {
            filtered = filtered.filter(r => r.rating === 5);
        } else if (filter === '4') {
            filtered = filtered.filter(r => r.rating === 4);
        } else if (filter === '3') {
            filtered = filtered.filter(r => r.rating === 3);
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [reviews, filter]);

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
        if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className={isDark ? 'text-white' : 'text-gray-900'}>
            {/* Rating Summary */}
            <div className={`rounded-[2rem] p-8 mb-10 border shadow-2xl ${
                isDark 
                ? 'bg-white/5 border-white/10 shadow-black/20' 
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-indigo-100/20'
            }`}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                    <div className="text-center shrink-0">
                        <div className={`text-6xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stats.average.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mb-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    className={`w-6 h-6 ${i <= Math.round(stats.average)
                                        ? 'fill-orange-400 text-orange-400'
                                        : isDark ? 'text-white/10' : 'text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className={`text-[10px] font-bold text-gray-400 tracking-wider ${isDark ? 'text-indigo-100/30' : 'text-gray-400'}`}>
                            {stats.total} Expertises Rendues
                        </p>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                        {[5, 4, 3, 2, 1].map((rating, index) => {
                            const count = stats.distribution[index];
                            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                            return (
                                <div key={rating} className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold w-10 shrink-0 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                                        {rating} ★
                                    </span>
                                    <div className={`flex-1 rounded-full h-2.5 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                                        <div
                                            className="bg-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold w-10 text-right ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Filters & Add Review */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-wider transition-all whitespace-nowrap border ${
                            filter === 'all'
                            ? 'bg-orange-400 text-white border-orange-400 shadow-lg shadow-orange-400/20'
                            : isDark ? 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10' : 'bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200'
                        }`}
                    >
                        Tous ({reviews.length})
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-wider transition-all whitespace-nowrap border flex items-center gap-2 ${
                            filter === 'verified'
                            ? 'bg-orange-400 text-white border-orange-400 shadow-lg shadow-orange-400/20'
                            : isDark ? 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10' : 'bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200'
                        }`}
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Vérifiés
                    </button>
                </div>

                {currentUser && ['student', 'director'].includes(currentUser.profile?.role) && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-premium px-8 py-3 text-[10px] flex items-center gap-3"
                    >
                        <Star className="w-4 h-4" />
                        Laisser un Avis
                    </button>
                )}

                {(!currentUser || !['student', 'director'].includes(currentUser.profile?.role)) && (
                    <div className={`px-5 py-2.5 rounded-2xl italic text-[10px] font-bold text-gray-400 tracking-wider border ${
                        isDark ? 'bg-white/5 border-white/5 text-indigo-100/20' : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}>
                        Accès restreint aux témoignages certifiés
                    </div>
                )}
            </div>

            {/* Review Submission Form */}
            {showForm && (
                <div className={`rounded-[2.5rem] p-10 mb-12 border shadow-3xl animate-in slide-in-from-top-6 duration-500 overflow-hidden relative ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-indigo-100 text-gray-900'
                }`}>
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-400/30" />
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-2xl font-bold tracking-tight">Votre témoignage</h4>
                        <button onClick={() => setShowForm(false)} className="text-orange-400 hover:scale-110 transition-transform font-bold text-[10px] tracking-wider">Fermer</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-center gap-5">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="group transition-transform hover:scale-125 active:scale-90"
                                >
                                    <Star className={`w-12 h-12 transition-all duration-500 ${star <= rating ? 'fill-orange-400 text-orange-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : isDark ? 'text-white/5' : 'text-gray-100'}`} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Décrivez l'impact de ce mentor sur votre parcours..."
                            className={`w-full p-8 rounded-[2rem] outline-none transition-all font-medium text-lg min-h-[160px] border shadow-inner ${
                                isDark 
                                ? 'bg-black/20 border-white/5 focus:border-orange-400/30 text-white placeholder-white/10' 
                                : 'bg-gray-50 border-transparent focus:bg-white focus:border-orange-400/30 text-gray-900 placeholder-gray-300'
                            }`}
                            required
                        ></textarea>

                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="btn-premium w-full py-6 text-sm flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Publier mon Témoignage
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {message && (
                <div className={`p-6 rounded-3xl mb-10 flex items-center gap-5 animate-in fade-in slide-in-from-left-6 border ${
                    message.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    <div className={`p-2 rounded-xl ${message.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <CheckCircle className="w-6 h-6 shrink-0" />
                    </div>
                    <p className="text-xs font-bold tracking-wider">{message.text}</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                        <Sparkles className={`w-16 h-16 mx-auto mb-6 ${isDark ? 'text-indigo-100/10' : 'text-gray-200'}`} />
                        <p className={`text-xl font-bold tracking-tight mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Aucune certification publique</p>
                        <p className={`text-[10px] font-bold text-gray-400 tracking-widest ${isDark ? 'text-indigo-100/20' : 'text-gray-400'}`}>Soyez le pionnier en laissant votre avis</p>
                    </div>
                ) : (
                    filteredReviews.map(review => (
                        <div
                            key={review.id}
                            className={`rounded-[2.5rem] p-8 border hover:scale-[1.02] transition-all duration-500 group animate-soft-in ${
                                isDark 
                                ? 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8' 
                                : 'bg-white border-gray-100 hover:shadow-2xl shadow-indigo-100/10'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:rotate-6 ${
                                        isDark ? 'bg-indigo-500/10 border-white/5' : 'bg-indigo-50 border-indigo-100'
                                    }`}>
                                        <User className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className={`font-bold tracking-tight text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.authorName}</p>
                                            {review.isVerified && (
                                                <div className="bg-orange-400 text-white p-1 rounded-full shadow-lg shadow-orange-400/20" title="Vérifié par Minsii">
                                                    <CheckCircle className="w-3.5 h-3.5 fill-current" />
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[10px] font-bold text-gray-400 tracking-widest ${isDark ? 'text-indigo-100/20' : 'text-gray-400'}`}>
                                            Expertise • {formatRelativeDate(review.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                    <span className="text-[11px] font-bold text-white">{review.rating}</span>
                                </div>
                            </div>

                            <p className={`text-lg leading-relaxed font-medium italic ${isDark ? 'text-indigo-100/60' : 'text-gray-600'}`}>
                                "{review.comment.length > 200 ? review.comment.substring(0, 200) + '...' : review.comment}"
                            </p>
                            
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a102a] bg-white/10" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-white/20 tracking-widest">Approuvé par la communauté</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
