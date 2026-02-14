import MenuManager from '@/components/MenuManager';

export default async function MenuPage({ params }) {
    const { cafe_slug } = await params;

    return (
        <div>
            <h1 className="text-3xl font-bold text-wood mb-6">Menu Management</h1>
            <MenuManager cafeSlug={cafe_slug} />
        </div>
    );
}
