import React from 'react';
import { Calendar, Users, Briefcase, Clock, User, ChevronRight, Star } from 'lucide-react';
import { Booking } from '../../services/bookingService';
import { AuthUser } from '../../services/authService';
import { Review } from '../../services/reviewService';

interface TeacherOverviewProps {
    stats: {
        totalSessions: number;
        activeStudents: number;
        pendingReviews: number;
    };
    user: AuthUser;
    bookings: Booking[];
    reviews: Review[];
}

const TeacherOverview: React.FC<TeacherOverviewProps> = ({ stats, user, bookings, reviews }) => (
    <div className="space-y-12 animate-soft-in">
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white p-10 lg:p-14 rounded-[40px] border border-[var(--border-main)]/50 shadow-premium overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="flex-1 relative z-10">
                <h1 className="text-4xl lg:text-5xl font-black text-[var(--text-main)] tracking-tighter mb-4 leading-[0.9] font-serif italic">
                    Bonjour, <span className="text-[var(--primary)] not-italic">{user?.profile?.name?.split(' ')[0] || 'Mentor'}</span> 👋
                </h1>
                <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg max-w-xl leading-relaxed opacity-80">Prêt à transformer l'avenir de vos élèves aujourd'hui ?</p>
            </div>
            <button className="bg-[var(--primary)] text-white h-16 px-10 lg:px-12 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:scale-[1.03] active:scale-95 transition-all relative z-10">
                PROPOSER UNE SESSION
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {[
                { label: 'Sessions', value: stats.totalSessions, icon: Calendar, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/5' },
                { label: 'Élèves', value: stats.activeStudents, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                { label: 'Candidatures', value: stats.pendingReviews, icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-500/5' },
            ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[32px] p-8 flex items-center justify-between group hover:shadow-premium transition-all border border-[var(--border-main)]/50">
                    <div>
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2 opacity-50">{stat.label}</p>
                        <h3 className="text-4xl lg:text-5xl font-black text-[var(--text-main)] tracking-tighter font-serif">{stat.value}</h3>
                    </div>
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 ${stat.bg} ${stat.color} rounded-[20px] flex items-center justify-center transition-transform group-hover:rotate-12`}>
                        <stat.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            <div className="xl:col-span-2 space-y-10">
                <section className="bg-white rounded-[40px] p-10 lg:p-14 border border-[var(--border-main)]/50 shadow-premium">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg lg:text-xl font-black text-[var(--text-main)] flex items-center gap-3 tracking-tight font-serif uppercase italic">
                            <Clock className="w-5 h-5 text-[var(--primary)] not-italic" />
                            Sessions à venir
                        </h3>
                        <button className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Tout voir</button>
                    </div>
                    
                    <div className="space-y-6">
                        {bookings.slice(0, 4).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-6 lg:p-8 bg-[#FDFAF7] hover:bg-white border border-transparent hover:border-[#1A1008]/5 rounded-[32px] transition-all group hover:shadow-xl">
                                <div className="flex items-center gap-6 lg:gap-10">
                                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-[20px] flex flex-col items-center justify-center shadow-sm font-black border border-[var(--border-main)]/30">
                                        <span className="text-[8px] text-[var(--primary)] uppercase tracking-[0.2em] leading-none mb-1 opacity-50">
                                            {booking.requested_date ? new Date(booking.requested_date).toLocaleDateString('fr-FR', { month: 'short' }) : '---'}
                                        </span>
                                        <span className="text-xl text-[var(--text-main)] leading-tight tracking-tighter">
                                            {booking.requested_date ? new Date(booking.requested_date).getDate() : '--'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-black text-[var(--text-main)] text-[15px] lg:text-[17px] tracking-tight mb-2 group-hover:text-[var(--primary)] transition-colors font-serif italic uppercase">{booking.subject}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[8px] font-black text-[var(--primary)] uppercase tracking-[0.15em] px-2.5 py-1 bg-[var(--primary)]/5 rounded-full border border-[var(--primary)]/10">
                                                {booking.status === 'accepted' ? 'Confirmé' : 'En attente'}
                                            </span>
                                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30">{booking.student?.name || 'Élève'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-[#1A1008]/20 group-hover:text-[#1e1edc] group-hover:shadow-lg transition-all border border-[#1A1008]/5">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                        {bookings.length === 0 && (
                            <div className="py-20 text-center opacity-30">
                                <Calendar className="w-14 h-14 mx-auto mb-6 text-[#1A1008]" />
                                <p className="text-sm font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Aucune session prévue.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="space-y-10 lg:space-y-12">
                <div className="bg-[#0a0a1a] p-10 lg:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-1000" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter mb-4 uppercase font-serif italic">Minsii <span className="text-[var(--primary)] not-italic">Elite</span></h3>
                        <p className="text-white/40 text-xs lg:text-sm font-bold leading-relaxed mb-10 max-w-[180px]">
                            Plus que <strong className="text-white">2 sessions</strong> avant de devenir un Mentor Élite.
                        </p>
                        <button className="w-full h-14 bg-[var(--primary)] text-white font-black text-[10px] rounded-xl shadow-xl shadow-blue-500/20 transition-transform hover:scale-[1.05] active:scale-95 uppercase tracking-[0.2em]">
                            MON BADGE
                        </button>
                    </div>
                </div>

                <section className="bg-white rounded-[40px] p-10 lg:p-12 border border-[var(--border-main)]/50 shadow-premium">
                    <h3 className="text-lg font-black text-[var(--text-main)] mb-10 tracking-tight uppercase font-serif italic">Derniers Avis</h3>
                    <div className="space-y-12">
                        {reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-section)] border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-base shadow-sm">
                                        {review.authorName?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-tight">{review.authorName}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} className={`w-2.5 h-2.5 ${idx < review.rating ? 'fill-amber-500 text-amber-500' : 'text-[var(--text-muted)] opacity-20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[13px] text-[var(--text-muted)] italic font-bold leading-relaxed opacity-60 uppercase tracking-tight">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <div className="py-12 text-center opacity-30">
                                <p className="text-xs font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Pas encore d'avis.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    </div>
);

export default TeacherOverview;
