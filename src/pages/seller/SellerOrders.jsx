import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    // Get initial status from URL or default to 'ALL'
    const activeStatus = searchParams.get('status') || 'ALL';

    useEffect(() => {
        fetchOrders();
    }, [activeStatus]);

    const fetchOrders = async () => {
        const params = {};
        if (activeStatus !== 'ALL') params.status = activeStatus;
        if (search) params.search = search;

        const res = await axios.get('/api/seller/orders', { params });
        setOrders(res.data);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ status: activeStatus, search: search });
    };

    const statusTabs = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'DISPATCHED', 'REJECTED'];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Order Management</h1>

            {/* FILTER TABS (Point 5) */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {statusTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSearchParams({ status: tab })}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeStatus === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* SEARCH BAR (Point 6) */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <button type="submit" className="bg-gray-800 text-white px-6 rounded">Search</button>
            </form>

            {/* ORDERS TABLE (Point 4) */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Buyer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">#{item.orderId.toString().padStart(5, '0')}</td>
                                <td className="p-4">{item.listing.title} x {item.quantity}</td>
                                <td className="p-4">{item.order.buyer.name}</td>
                                <td className="p-4 font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            item.status === 'DISPATCHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link to={`/seller/orders/${item.id}`} className="text-blue-600 hover:underline">View Details</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}