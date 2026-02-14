export default async function Dashboard({ params }) {
    const { cafe_slug } = await params;

    return (
        <div className="min-h-screen bg-cream font-sans">
            {/* Sidebar is in Layout, so we just focus on content */}

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
                <p className="text-dark/60">Overview for {cafe_slug}</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Orders" value="128" change="+12%" />
                <StatCard title="Revenue" value="₹12,450" change="+8.5%" />
                <StatCard title="Active Tables" value="5/12" change="Busy" />
            </div>

            {/* Placeholder Content */}
            <div className="bg-white rounded-2xl p-8 mt-8 shadow-sm border border-wood/5 min-h-[400px] flex items-center justify-center text-dark/40">
                Chart / Recent Orders will go here
            </div>
        </div>
    );
}

function StatCard({ title, value, change }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-wood/5 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-dark/60">{title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-wood">{value}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>
            </div>
        </div>
    );
}
