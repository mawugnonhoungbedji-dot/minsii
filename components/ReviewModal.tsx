import React, { useState, useEffect } from 'react';
import { X, Star, Send, User, Phone } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { authService } from '../services/authService';

interface ReviewModalProps {
    teacherId: string;
    teacherName: string;
    onClose: () => void;
    onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ teacherId, teacherName, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoadingUser(true);
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const isLoggedIn = !!user;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        reviewService.addReview({
            teacherId,
            authorName: isLoggedIn ? user.profile.name : guestName,
            authorPhone: !isLoggedIn ? guestPhone : undefined,
            authorEmail: isLoggedIn ? user.email : undefined,
            rating,
            comment,
            isVerified: isLoggedIn
        });

        onSubmit();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-fadeIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Laisser un avis</h2>
                    <p className="text-sm text-gray-500 mt-1">Pour {teacherName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Note</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoveredStar || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Votre avis</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            placeholder="Partagez votre expérience avec cet enseignant..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Guest Info */}
                    {!isLoggedIn && (
                        <div className="space-y-4 p-4 bg-indigo-50 rounded-xl">
                            <p className="text-xs text-indigo-600 font-medium">Vous n'êtes pas connecté</p>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                    placeholder="Votre nom complet"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    required
                                    placeholder="Numéro de téléphone"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Publier l'avis
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
