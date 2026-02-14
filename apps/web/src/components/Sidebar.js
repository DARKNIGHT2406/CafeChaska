'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ cafeSlug }) {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: `/${cafeSlug}/dashboard`, icon: '📊' },
        { name: 'Menu', href: `/${cafeSlug}/menu-management`, icon: '🍔' },
        { name: 'Tables', href: `/${cafeSlug}/table-management`, icon: '🪑' },
        { name: 'Settings', href: `/${cafeSlug}/settings`, icon: '⚙️' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-wood/10 h-screen fixed left-0 top-0 flex flex-col shadow-sm hidden md:flex">
            <div className="p-6 border-b border-wood/5">
                <h2 className="text-xl font-bold text-wood tracking-tight">Cafe Chaska</h2>
                <p className="text-xs text-dark/40 uppercase tracking-widest mt-1">Manager</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
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
    );
}
