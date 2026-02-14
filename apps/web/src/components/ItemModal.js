'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config';

export default function ItemModal({ isOpen, onClose, item, categoryId, cafeSlug, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        ingredients: '',
        imageUrl: '', // Cover Image
        images: [],   // Gallery
        videoUrl: ''  // Video
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                price: item.price,
                description: item.description,
                ingredients: item.ingredients?.join(', ') || '',
                imageUrl: item.imageUrl || '',
                images: item.images || [],
                videoUrl: item.videoUrl || ''
            });
        } else {
            setFormData({
                name: '',
                price: '',
                description: '',
                ingredients: '',
                imageUrl: '',
                images: [],
                videoUrl: ''
            });
        }
    }, [item, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'cafe_chaska_unsigned');

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: data
            });

            if (!res.ok) throw new Error('Upload failed');

            const result = await res.json();
            if (result.url) {
                if (type === 'cover') {
                    setFormData(prev => ({ ...prev, imageUrl: result.url }));
                } else if (type === 'gallery') {
                    // Append to images array
                    setFormData(prev => ({ ...prev, images: [...prev.images, result.url] }));
                } else if (type === 'video') {
                    setFormData(prev => ({ ...prev, videoUrl: result.url }));
                }
            }
        } catch (err) {
            console.error('Upload failed', err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: Number(formData.price),
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
            categoryId,
            cafeId: cafeSlug
        };
        onSave(payload, item?.id);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-wood">{item ? 'Edit Item' : 'Add New Item'}</h2>
                    <button onClick={onClose} className="text-dark/40 hover:text-dark text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark/70 mb-1">Item Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-wood/20 rounded-lg focus:ring-wood focus:border-wood outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark/70 mb-1">Price (₹)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-wood/20 rounded-lg focus:ring-wood focus:border-wood outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Ingredients & Desc */}
                    <div>
                        <label className="block text-sm font-medium text-dark/70 mb-1">Ingredients</label>
                        <input
                            name="ingredients"
                            placeholder="Comma separated"
                            value={formData.ingredients}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-wood/20 rounded-lg focus:ring-wood focus:border-wood outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark/70 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-wood/20 rounded-lg focus:ring-wood focus:border-wood outline-none"
                        />
                    </div>

                    {/* Media Section */}
                    <div className="border-t border-wood/10 pt-4 mt-4">
                        <h3 className="text-lg font-bold text-wood mb-4">Media</h3>

                        {/* 1. Cover Image */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-dark/70 mb-2">Cover Image</label>
                            <div className="flex items-center gap-4">
                                {formData.imageUrl && (
                                    <img src={formData.imageUrl} alt="Cover" className="w-20 h-20 rounded-lg object-cover border border-wood/10" />
                                )}
                                <label className="cursor-pointer bg-cream border border-wood/30 text-wood px-4 py-2 rounded-lg hover:bg-wood hover:text-cream transition-colors text-sm">
                                    {uploading ? 'Processing...' : 'Change Cover'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'cover')} />
                                </label>
                            </div>
                        </div>

                        {/* 2. Gallery Images (Multi) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-dark/70 mb-2">Gallery Images (Min 3 Recommended)</label>
                            <div className="flex flex-wrap gap-3 mb-2">
                                {formData.images.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 group">
                                        <img src={url} className="w-full h-full rounded-lg object-cover border border-wood/10" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}

                                <label className="cursor-pointer w-20 h-20 flex items-center justify-center bg-cream border border-dashed border-wood/30 text-wood rounded-lg hover:bg-wood/5 transition-colors">
                                    <span className="text-2xl">+</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'gallery')} />
                                </label>
                            </div>
                        </div>

                        {/* 3. Video */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-dark/70 mb-2">Promotional Video</label>
                            {formData.videoUrl ? (
                                <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-wood/10 bg-black">
                                    <video src={formData.videoUrl} controls className="w-full h-32 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md text-xs"
                                    >
                                        Remove Video
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer bg-cream border border-wood/30 text-wood px-4 py-2 rounded-lg hover:bg-wood hover:text-cream transition-colors text-sm inline-block">
                                    {uploading ? 'Uploading Video...' : 'Upload Video (MP4)'}
                                    <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e.target.files[0], 'video')} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-4 border-t border-wood/10">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-dark/60 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                        <button type="submit" disabled={uploading} className="flex-1 py-3 bg-wood text-cream rounded-lg hover:opacity-90 disabled:opacity-50 font-medium shadow-md">
                            {item ? 'Save Item' : 'Create Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
