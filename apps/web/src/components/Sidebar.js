'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ cafeSlug }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const links = [
        { name: 'Dashboard', href: `/${cafeSlug}/dashboard` || '#', icon: '📊' },
        { name: 'Menu', href: `/${cafeSlug}/menu-management` || '#', icon: '🍔' },
        { name: 'Tables', href: `/${cafeSlug}/table-management` || '#', icon: '🪑' },
        { name: 'Settings', href: `/${cafeSlug}/settings` || '#', icon: '⚙️' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-wood/10 p-4 flex justify-between items-center z-50">
                <h2 className="text-lg font-bold text-wood">Cafe Chaska</h2>
                <button onClick={toggleMenu} className="text-2xl text-wood focus:outline-none">
                    {isMobileMenuOpen ? '✖️' : '☰'}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-white border-r border-wood/10 h-screen fixed left-0 top-0 flex flex-col shadow-sm z-50 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:flex
            `}>
                <div className="p-6 border-b border-wood/5 hidden md:block">
                    <h2 className="text-xl font-bold text-wood tracking-tight">Cafe Chaska</h2>
                    <p className="text-xs text-dark/40 uppercase tracking-widest mt-1">Manager</p>
                </div>

                {/* Mobile Menu Header inside Sidebar */}
                <div className="p-6 border-b border-wood/5 md:hidden flex justify-between items-center">
                    <h2 className="text-xl font-bold text-wood">Menu</h2>
                    <button onClick={toggleMenu} className="text-wood">✖️</button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-wood text-cream shadow-md'
                                    : 'text-dark/60 hover:bg-cream hover:text-wood'
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-wood/5">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <span>🚪</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>


        </>
    );
}
