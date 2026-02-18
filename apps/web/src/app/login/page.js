'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ cafeId: e.target.email.value, password: e.target.password.value }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Success
            // Set cookie for 1 day
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
            // Redirect to cafe specific dashboard
            // Redirect to cafe specific dashboard
            if (data.cafe && data.cafe.slug) {
                console.log('Redirecting to:', `/${data.cafe.slug}/dashboard`);
                router.push(`/${data.cafe.slug}/dashboard`);
            } else {
                console.error('Login successful but no slug found:', data);
                // instead of redirecting to 404 /dashboard, show an error or fallback
                setError('Login successful, but Cafe data is missing. Please contact support.');
                // router.push('/dashboard'); // Removed 404 trigger
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-in zoom-in-95 duration-300">
                <h2 className="text-3xl font-bold text-wood mb-2 text-center">Welcome Back</h2>
                <p className="text-center text-dark/60 mb-8">Sign in to manage your cafe</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-dark/80 mb-1" htmlFor="email">
                            Cafe ID / Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="w-full px-4 py-3 rounded-lg border border-wood/20 focus:border-wood focus:ring-1 focus:ring-wood focus:outline-none transition-all bg-cream/30"
                            placeholder="e.g. CAFE001"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark/80 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 rounded-lg border border-wood/20 focus:border-wood focus:ring-1 focus:ring-wood focus:outline-none transition-all bg-cream/30"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-wood text-cream py-3 rounded-lg font-medium hover:opacity-90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-dark/40">
                    Need help? <a href="#" className="text-wood hover:underline">Contact Support</a>
                </div>
            </div>
        </div>
    );
}
