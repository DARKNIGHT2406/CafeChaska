'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, X } from 'lucide-react';
import ItemModal from '@/components/ItemModal';
import { API_URL } from '@/config';

export default function MenuManager({ cafeSlug }) {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Edit Category State
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [tempName, setTempName] = useState('');

    // Fetch Categories on Mount
    useEffect(() => {
        fetch(`${API_URL}/api/categories/${cafeSlug}`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0) setSelectedCategory(data[0].id);
            })
            .catch(err => console.error(err));
    }, [cafeSlug]);

    // Fetch Items when Category changes
    useEffect(() => {
        if (!selectedCategory) return;
        setLoading(true);
        fetch(`${API_URL}/api/menu-items/${cafeSlug}?categoryId=${selectedCategory}`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedCategory, cafeSlug]);

    // Item CRUD
    const handleSaveItem = async (payload, id) => {
        const url = id
            ? `${API_URL}/api/menu-items/${id}`
            : `${API_URL}/api/menu-items`;

        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const savedItem = await res.json();

            if (id) {
                setItems(items.map(i => i.id === id ? savedItem : i));
            } else {
                setItems([...items, savedItem]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save item');
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Category Editing Logic
    const handleStartEdit = (e, cat) => {
        e.stopPropagation(); // prevent triggering selection
        setEditingCategoryId(cat.id);
        setTempName(cat.name);
    };

    const handleSaveCategory = async (id) => {
        if (!tempName.trim()) {
            setEditingCategoryId(null);
            return;
        }

        // Optimistic Update
        const originalCategories = [...categories];
        const updatedCategories = categories.map(c => c.id === id ? { ...c, name: tempName } : c);
        setCategories(updatedCategories);
        setEditingCategoryId(null);

        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tempName })
            });
            if (!res.ok) throw new Error('Failed to update');
        } catch (err) {
            console.error(err);
            alert('Failed to update category name');
            setCategories(originalCategories); // Revert
        }
    };

    return (
        <div>
            {/* Category Navigation */}
            <div className="flex overflow-x-auto gap-4 py-4 mb-4 md:mb-6 border-b border-wood/10 scrollbar-hide items-center">
                {categories.map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    const isEditing = editingCategoryId === cat.id;

                    if (isEditing) {
                        return (
                            <input
                                key={cat.id}
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => handleSaveCategory(cat.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory(cat.id)}
                                className="px-6 py-2 rounded-full font-medium bg-white border border-wood/30 text-wood outline-none shadow-inner min-w-[120px]"
                            />
                        );
                    }

                    return (
                        <div key={cat.id} className="relative group">
                            <button
                                onClick={() => setSelectedCategory(cat.id)}
                                onDoubleClick={(e) => handleStartEdit(e, cat)}
                                className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all ${isSelected
                                    ? 'bg-wood text-cream shadow-md'
                                    : 'bg-white text-dark/60 hover:bg-wood/10'
                                    }`}
                            >
                                {cat.name}
                            </button>
                            {/* Tiny Edit Icon */}
                            <button
                                onClick={(e) => handleStartEdit(e, cat)}
                                className="absolute -top-1 -right-1 bg-white border border-wood/20 text-wood text-[10px] w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-sm z-10"
                                title="Edit Name"
                            >
                                ✎
                            </button>
                        </div>
                    );
                })}

                <button className="whitespace-nowrap px-6 py-2 rounded-full border border-dashed border-wood/30 text-wood hover:bg-wood/5 flex items-center gap-2">
                    <span>+</span> Add Category
                </button>
            </div>

            {/* Items Grid */}
            {loading ? (
                <div className="flex justify-center py-20 text-wood/50">Loading delicious items...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <ManagerItemCard
                            key={item.id}
                            item={item}
                            onEdit={() => openEditModal(item)}
                        />
                    ))}

                    {/* Add Item Card */}
                    <button
                        onClick={openAddModal}
                        className="bg-cream/50 rounded-2xl border-2 border-dashed border-wood/20 flex flex-col items-center justify-center min-h-[112px] md:min-h-[300px] hover:bg-cream hover:border-wood/40 transition-all text-wood/60 hover:text-wood"
                    >
                        <span className="text-4xl mb-2">+</span>
                        <span className="font-medium">Add New Item</span>
                    </button>
                </div>
            )}

            <ItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                categoryId={selectedCategory}
                cafeSlug={cafeSlug}
                onSave={handleSaveItem}
            />
        </div>
    );
}

function ManagerItemCard({ item, onEdit }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = item.images && item.images.length > 0
        ? item.images
        : [item.imageUrl || 'https://placehold.co/400x300?text=No+Image'];

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <motion.div
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white rounded-2xl shadow-sm border border-wood/5 overflow-hidden relative"
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

                {/* Veg/Non-Veg Indicator */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded p-1 shadow-sm">
                    <div className={`w-3 h-3 border-2 ${item.isVeg !== false ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-dark leading-tight">{item.name}</h3>
                        <div className="font-bold text-wood">₹{item.price}</div>
                    </div>

                    {/* Edit Button Area (Styled exactly like ADD button) */}
                    <div className="flex flex-col items-end">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="bg-cream text-wood border border-wood/20 px-6 py-2 rounded-lg font-bold shadow-sm uppercase text-sm hover:bg-wood hover:text-cream transition-colors"
                        >
                            EDIT
                        </motion.button>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
