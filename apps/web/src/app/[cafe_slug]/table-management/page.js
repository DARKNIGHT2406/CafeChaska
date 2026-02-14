'use client';

import { useState, useEffect, use } from 'react';
import { API_URL } from '@/config';

export default function TableManagement({ params }) {
    const { cafe_slug } = use(params);
    const [tables, setTables] = useState([]);
    const [newTableNum, setNewTableNum] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTables();
    }, [cafe_slug]);

    const fetchTables = async () => {
        try {
            const res = await fetch(`${API_URL}/api/tables/${cafe_slug}`);
            const data = await res.json();
            setTables(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch tables', err);
            setLoading(false);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        if (!newTableNum.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/tables/${cafe_slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableNumber: newTableNum })
            });

            if (res.ok) {
                setNewTableNum('');
                fetchTables(); // Refresh list
            } else {
                const err = await res.json();
                alert(err.message || 'Failed to add table');
            }
        } catch (err) {
            alert('Error adding table');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will delete the QR code too.')) return;

        try {
            await fetch(`${API_URL}/api/tables/${id}`, { method: 'DELETE' });
            setTables(tables.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const downloadQR = (qrData, tableNum) => {
        const link = document.createElement('a');
        link.href = qrData;
        link.download = `QR-Table-${tableNum}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-wood mb-2">Table Management</h1>
            <p className="text-wood/60 mb-8">Manage tables and generate specific QR codes for ordering.</p>

            {/* Add Table Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-wood/10 mb-8 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-dark/70 mb-1">New Table Number / Name</label>
                    <input
                        value={newTableNum}
                        onChange={(e) => setNewTableNum(e.target.value)}
                        placeholder="e.g. Table 5 or Window A"
                        className="w-full px-4 py-3 border border-wood/20 rounded-xl focus:ring-wood focus:border-wood outline-none"
                    />
                </div>
                <button
                    onClick={handleAddTable}
                    className="bg-wood text-cream px-8 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium h-[50px"
                >
                    + Add Table
                </button>
            </div>

            {/* Table Grid */}
            {loading ? (
                <div className="text-center py-12 text-wood/40">Loading tables...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map(table => (
                        <div key={table.id} className="bg-white rounded-2xl p-6 shadow-sm border border-wood/10 flex flex-col items-center text-center">
                            <h3 className="text-2xl font-bold text-wood mb-4">Table {table.tableNumber}</h3>

                            <div className="bg-white p-2 border border-wood/10 rounded-lg mb-4">
                                <img src={table.qrCodeData} alt="QR Code" className="w-48 h-48" />
                            </div>

                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => downloadQR(table.qrCodeData, table.tableNumber)}
                                    className="flex-1 bg-cream text-wood py-2 rounded-lg hover:bg-wood/10 transition-colors font-medium border border-wood/20"
                                >
                                    Download QR
                                </button>
                                <button
                                    onClick={() => handleDelete(table.id)}
                                    className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                >
                                    Trash
                                </button>
                            </div>
                            <a href={`/scan/${cafe_slug}/${table.id}`} target="_blank" className="mt-4 text-xs text-wood/40 hover:text-wood underline">
                                Test Link
                            </a>
                        </div>
                    ))}

                    {tables.length === 0 && (
                        <div className="col-span-full text-center py-12 text-wood/40 bg-cream/30 rounded-2xl border border-dashed border-wood/20">
                            No tables added yet. Add one to generate a QR code.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
