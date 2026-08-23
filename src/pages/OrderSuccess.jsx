import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function OrderSuccess() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`/api/orders/${id}`).then(res => setOrder(res.data)).catch(() => setOrder(null));
    }, [id]);

    if (!order) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-green-100 text-green-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold">✓</div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-500 mb-10 text-lg">Thank you for shopping at Digital City Center. A confirmation email has been sent.</p>

            <div className="bg-white p-8 rounded-xl shadow-sm border text-left mb-10">
                <div className="flex justify-between mb-6 pb-4 border-b">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-bold text-gray-900 text-lg">#ORD-{order.id.toString().padStart(5, '0')}</span>
                </div>
                <div className="flex justify-between mb-6 pb-4 border-b">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-gray-900 text-2xl">Rs. {parseFloat(order.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                        {order.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="border border-gray-300 text-gray-700 px-10 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}