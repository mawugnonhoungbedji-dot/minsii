import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandedLoaderProps {
    fullScreen?: boolean;
    message?: string;
}

const BrandedLoader: React.FC<BrandedLoaderProps> = ({ fullScreen = true, message = "Chargement de votre univers..." }) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 12000); // Increased safety net
        return () => clearTimeout(timer);
    }, []);

    const LoaderContent = () => (
        <div className="flex flex-col items-center justify-center">
            <div className="relative mb-12">
                {/* Rotating Outer Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-24px] border-[3px] border-t-transparent rounded-full shadow-blue/5" 
                    style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)' }}
                ></motion.div>

                {/* Pulsing Logo Container */}
                <motion.div 
                    animate={{ scale: [0.98, 1.02, 0.98] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden z-10 border border-gray-100"
                >
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                        <span className="text-white font-black text-3xl font-heading">M</span>
                    </div>
                </motion.div>

                {/* Secondary Pulse Ring */}
                <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[-12px] rounded-[3rem] -z-10" 
                    style={{ backgroundColor: 'var(--primary-light)' }}
                ></motion.div>
            </div>

            {message && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[11px] font-medium tracking-widest uppercase text-gray-400 animate-pulse"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {fullScreen ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFAF7]"
                >
                    <LoaderContent />
                </motion.div>
            ) : (
                <div className="w-full py-20 flex items-center justify-center">
                    <LoaderContent />
                </div>
            )}
        </AnimatePresence>
    );
};

export default BrandedLoader;
