'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import MenuItemCard from '@/components/MenuItemCard';
import { API_URL } from '@/config';

export default function CustomerOrderPage({ params }) {
    const { cafe_slug, table_id } = use(params);
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState('idle');
    const [loading, setLoading] = useState(true);

    // Fetch Menu
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const [catRes, itemRes] = await Promise.all([
                    fetch(`${API_URL}/api/categories/${cafe_slug}`),
                    fetch(`${API_URL}/api/menu-items/${cafe_slug}?categoryId=all`)
                ]);
                const cats = await catRes.json();
                const menuItems = await itemRes.json();
                setCategories(cats);
                setItems(menuItems);
                if (cats.length > 0) setActiveCategory(cats[0].id);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load menu', err);
                setLoading(false);
            }
        };
        if (cafe_slug) fetchMenu();
    }, [cafe_slug]);

    // Cart Logic
    const handleAdd = (item) => {
        setCart(prev => [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
    };

    const handleUpdate = (itemId, delta) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.itemId === itemId) {
                    return { ...i, quantity: i.quantity + delta };
                }
                return i;
            }).filter(i => i.quantity > 0);
        });
    };

    const getQuantity = (itemId) => {
        return cart.find(i => i.itemId === itemId)?.quantity || 0;
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    setOrderStatus('processing');
    try {
        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cafeId: cafe_slug,
                tableId: table_id,
                items: cart,
                totalAmount: cartTotal,
                customerName: 'Guest'
            })
        });
        if (res.ok) {
            setOrderStatus('success');
            setCart([]);
            setIsCartOpen(false);
        } else {
            setOrderStatus('idle');
            alert('Order failed. Try again.');
        }
    } catch (err) {
        setOrderStatus('idle');
        alert('Network error.');
    }
};

if (loading) return <div className="flex justify-center items-center h-screen bg-cream text-wood animate-pulse">Loading Menu...</div>;

if (orderStatus === 'success') {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cream px-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                <div className="text-6xl">🎉</div>
            </div>
            <h1 className="text-3xl font-bold text-dark mb-2">Order Confirmed!</h1>
            <p className="text-dark/60 mb-8 max-w-[280px]">Your food is being prepared with love.</p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-wood/5 w-full max-w-xs">
                <p className="font-bold text-wood mb-1">Table {table_id.slice(0, 4)}</p>
                <p className="text-xs text-dark/40 capitalize">{cafe_slug.replace('-', ' ')}</p>
            </div>
            <div className="mt-12 bg-wood/5 px-6 py-4 rounded-xl">
                <p className="text-xs text-dark/50 mb-1">Want to order more?</p>
                <p className="font-bold text-wood">Scan QR Code Again</p>
            </div>
        </div>
    );
}

const filteredItems = activeCategory === 'all' ? items : items.filter(i => i.categoryId === activeCategory);

return (
    <div className="min-h-screen bg-cream pb-32 font-sans selection:bg-wood/20">
        {/* Minimal Header */}
        <div className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-wood/5">
            <div>
                <h1 className="font-extrabold text-xl text-dark tracking-tight leading-none">{cafe_slug}</h1>
                <p className="text-[10px] uppercase tracking-widest text-wood font-medium">Table {table_id?.slice(0, 4)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-wood text-cream flex items-center justify-center font-bold text-xs">
                {cafe_slug.charAt(0)}
            </div>
        </div>

        {/* Category Pills */}
        <div className="sticky top-[53px] z-10 bg-cream pt-2 pb-4 px-4 flex gap-3 overflow-x-auto scrollbar-hide mask-gradient-right">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 ${activeCategory === cat.id
                        ? 'bg-wood text-cream shadow-md shadow-wood/20'
                        : 'bg-white text-dark/60 border border-wood/5'
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Menu List */}
        <div className="px-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {filteredItems.map(item => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={getQuantity(item.id)}
                        onAdd={handleAdd}
                        onRemove={(id) => handleUpdate(id, -1)}
                        onUpdate={handleUpdate}
                    />
                ))}
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 text-center text-dark/40 italic">
                        No delicious items found here.
                    </div>
                )}
            </div>
        </div>

        {/* Floating Cart Bar (Swiggy Style) */}
        {cart.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-40">
                <div className="bg-wood text-cream rounded-xl p-4 shadow-xl shadow-wood/30 flex justify-between items-center animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-cream/70 uppercase tracking-wider">{cartCount} Items</span>
                        <span className="font-bold text-lg">₹{cartTotal}</span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-white text-wood px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-cream transition-colors"
                    >
                        View Cart <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}

        {/* Cart Modal (Simplified) */}
        {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-dark">Your Cart</h2>
                        <button onClick={() => setIsCartOpen(false)} className="bg-gray-100 p-2 rounded-full text-dark"><ChevronRight className="rotate-90" /></button>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto mb-6 pr-2">
                        {cart.map(item => (
                            <div key={item.itemId} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-bold text-dark">{item.name}</p>
                                    <p className="text-sm text-gray-500">₹{item.price * item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-cream rounded-lg px-2 py-1">
                                    <button onClick={() => handleUpdate(item.itemId, -1)} className="text-wood px-2 py-1 font-bold">-</button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => handleUpdate(item.itemId, 1)} className="text-wood px-2 py-1 font-bold">+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={placeOrder}
                        disabled={orderStatus === 'processing'}
                        className="w-full bg-wood text-cream py-4 rounded-xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-lg shadow-wood/20 disabled:opacity-70"
                    >
                        {orderStatus === 'processing' ? 'Placing Order...' : `Pay ₹${cartTotal}`}
                    </button>
                </div>
            </div>
        )}
    </div>
);
}
