import Sidebar from '@/components/Sidebar';

export default async function CafeLayout({ children, params }) {
    const { cafe_slug } = await params;

    return (
        <div className="flex bg-cream min-h-screen font-sans">
            <Sidebar cafeSlug={cafe_slug} />
            <main className="flex-1 md:ml-64 p-4 md:p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    );
}
