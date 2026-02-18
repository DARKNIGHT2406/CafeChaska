import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-dark font-sans p-4 text-center">
            <h2 className="text-4xl font-bold text-wood mb-4">Page Not Found</h2>
            <p className="text-lg text-dark/60 mb-8">Could not find requested resource</p>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-wood/10 mb-8 max-w-md">
                <p className="font-mono text-xs text-left mb-2 text-wood">Debug Info:</p>
                <p className="font-mono text-xs text-left text-gray-500">This is a custom Next.js 404 page.</p>
                <p className="font-mono text-xs text-left text-gray-500">If you see this, the app is running but the route is wrong.</p>
            </div>
            <Link href="/login" className="px-6 py-2 bg-wood text-cream rounded-full hover:opacity-90">
                Return to Login
            </Link>
        </div>
    );
}
