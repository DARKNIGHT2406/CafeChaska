'use client';

import { useState, useEffect } from 'react';
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
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-wood/5 group relative flex flex-row md:flex-col h-28 md:h-auto">
                            <div className="w-28 md:w-full h-full md:h-48 bg-gray-200 relative overflow-hidden shrink-0">
                                {item.videoUrl ? (
                                    <video
                                        src={item.videoUrl}
                                        className="w-full h-full object-cover"
                                        muted
                                        onMouseOver={e => e.target.play()}
                                        onMouseOut={e => e.target.pause()}
                                    />
                                ) : (
                                    <img
                                        src={item.imageUrl || (item.images && item.images[0]) || 'https://placehold.co/400?text=No+Image'}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = 'https://placehold.co/400?text=Image+Error'; }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}

                                {/* Icons for multi-media */}
                                <div className="absolute bottom-2 left-2 flex gap-1">
                                    {item.images && item.images.length > 0 && (
                                        <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            📷 {item.images.length}
                                        </span>
                                    )}
                                    {item.videoUrl && (
                                        <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            🎥
                                        </span>
                                    )}
                                </div>

                                {/* Click area for edit */}
                                <div
                                    onClick={() => openEditModal(item)}
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer"
                                ></div>

                                <button
                                    onClick={() => openEditModal(item)}
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-wood opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    ✏️
                                </button>
                            </div>

                            <div className="p-3 md:p-4 flex-1 flex flex-col justify-center md:block min-w-0" onClick={() => openEditModal(item)}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-dark text-lg">{item.name}</h3>
                                    <span className="font-bold text-wood">₹{item.price}</span>
                                </div>
                                <p className="text-sm text-dark/60 line-clamp-2">{item.description}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.ingredients?.map((ing, i) => (
                                        <span key={i} className="text-xs bg-cream text-wood/80 px-2 py-1 rounded-md">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
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
