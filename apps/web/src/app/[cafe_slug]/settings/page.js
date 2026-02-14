export default async function SettingsPage({ params }) {
    const { cafe_slug } = await params;

    return (
        <div>
            <h1 className="text-3xl font-bold text-wood mb-4">Settings</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-wood/5">
                <p className="text-dark/60">Configure settings for {cafe_slug}</p>
                <div className="mt-4 border-t border-wood/10 pt-4">
                    <div className="h-32 bg-cream/50 rounded-lg flex items-center justify-center text-dark/40">
                        Settings Implementation Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
}
