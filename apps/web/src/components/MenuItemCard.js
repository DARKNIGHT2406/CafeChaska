'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';

export default function MenuItemCard({ item, quantity, onAdd, onRemove, onUpdate }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    // Image Logic
    const images = item.images && item.images.length > 0
        ? item.images
        : [item.imageUrl || 'https://placehold.co/400x300?text=No+Image'];

    // Auto-Slider
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    // Handlers
    const handleAdd = (e) => {
        e.stopPropagation();
        onAdd(item);
    };

    return (
        <>
            <motion.div
                layout
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white rounded-2xl shadow-sm border border-wood/5 overflow-hidden relative mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Image Carousel */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLightbox(true);
                            }}
                            onError={(e) => e.target.src = 'https://placehold.co/400?text=Error'}
                        />
                    </AnimatePresence>

                    {/* Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Veg/Non-Veg Indicator (Mock) */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded p-1 shadow-sm">
                        <div className={`w-3 h-3 border-2 ${item.isVeg !== false ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-dark leading-tight mb-1">{item.name}</h3>
                            <div className="font-bold text-wood">₹{item.price}</div>
                        </div>

                        {/* Add Button Area */}
                        <div className="flex flex-col items-end">
                            {!quantity ? (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleAdd}
                                    className="bg-cream text-wood border border-wood/20 px-6 py-2 rounded-lg font-bold shadow-sm uppercase text-sm"
                                >
                                    Add
                                </motion.button>
                            ) : (
                                <div className="flex items-center bg-wood text-cream rounded-lg px-2 py-1.5 gap-3 shadow-md">
                                    <button onClick={(e) => { e.stopPropagation(); onUpdate(item.id, -1); }}><Minus size={16} /></button>
                                    <span className="font-bold w-4 text-center">{quantity}</span>
                                    <button onClick={(e) => { e.stopPropagation(); onUpdate(item.id, 1); }}><Plus size={16} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-dark/60 mt-2 line-clamp-2">
                        {item.description}
                    </p>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 border-t border-wood/10 pt-3"
                            >
                                {item.ingredients && item.ingredients.length > 0 && (
                                    <div className="mb-2">
                                        <h4 className="text-xs font-bold text-dark/70 uppercase tracking-wider mb-1">Ingredients</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {item.ingredients.map((ing, i) => (
                                                <span key={i} className="text-xs bg-cream px-2 py-1 rounded text-wood/80">{ing}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="text-xs text-dark/40 italic mt-2">
                                    Tap image to view full screen.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLightbox(false)}
                        className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <button className="absolute top-4 right-4 text-white/50 hover:text-white">
                            <X size={32} />
                        </button>
                        <motion.img
                            layoutId={`img-${item.id}`}
                            src={images[currentImageIndex]}
                            className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
