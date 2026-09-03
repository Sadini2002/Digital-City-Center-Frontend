import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderDetails() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);

    useEffect(() => {
        axios.get(`/api/seller/orders`).then(res => {
            // Filter the specific item from the list (or create a specific backend endpoint)
            const foundItem = res.data.find(i => i.id === parseInt(itemId));
            setItem(foundItem);
        });
    }, [itemId]);

    // POINT 12-16: Handle Status Update
    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this as ${newStatus.replace('_', ' ')}?`)) return;

        try {
            await axios.patch(`/api/seller/orders/${itemId}/status`, { newStatus });
            // Refresh data
            setItem(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update");
        }
    };

    // POINT 19: Print Function
    const handlePrint = () => {
        window.print();
    };

    if (!item) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="p-6 print:p-0">
            {/* Print Button */}
            <div className="flex justify-end mb-4 print:hidden">
                <button onClick={handlePrint} className="bg-gray-200 px-4 py-2 rounded flex items-center gap-2">
                    🖨️ Print Summary
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Details (Points 8, 9, 10, 11) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Buyer Info */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Buyer & Delivery Info</h3>
                        <p><span className="text-gray-500">Name:</span> {item.order.buyer.name}</p>
                        <p><span className="text-gray-500">Phone:</span> {item.order.buyer.phone}</p>
                        <p><span className="text-gray-500">Address:</span> {item.order.deliveryAddress.addressLine}, {item.order.deliveryAddress.city}</p>
                        <p><span className="text-gray-500">Payment:</span> {item.order.paymentMethod}</p>
                    </div>

                    {/* Ordered Item */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Ordered Item</h3>
                        <div className="flex items-center gap-4">
                            <img src={item.listing.image} className="w-20 h-20 object-cover rounded" />
                            <div>
                                <h4 className="font-bold">{item.listing.title}</h4>
                                <p className="text-gray-500">Qty: {item.quantity} x Rs. {item.price}</p>
                                <p className="text-xl font-bold mt-2">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Status Actions (Points 12-16) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow border sticky top-6 print:hidden">
                        <h3 className="font-bold text-lg mb-4">Update Status</h3>

                        <div className="text-center mb-6 p-3 bg-gray-50 rounded">
                            <span className="text-sm text-gray-500">Current Status</span>
                            <p className="text-xl font-bold text-blue-600">{item.status.replace('_', ' ')}</p>
                        </div>

                        <div className="space-y-3">
                            {/* Conditional Buttons based on Point 17 Logic */}
                            {item.status === 'PENDING' && (
                                <>
                                    <button onClick={() => handleStatusChange('CONFIRMED')} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Confirm Order</button>
                                    <button onClick={() => handleStatusChange('REJECTED')} className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700">Reject Order</button>
                                </>
                            )}
                            {item.status === 'CONFIRMED' && (
                                <button onClick={() => handleStatusChange('PROCESSING')} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Mark as Processing</button>
                            )}
                            {item.status === 'PROCESSING' && (
                                <button onClick={() => handleStatusChange('READY_FOR_PICKUP')} className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600">Ready for Pickup</button>
                            )}
                            {item.status === 'READY_FOR_PICKUP' && (
                                <button onClick={() => handleStatusChange('DISPATCHED')} className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700">Mark as Dispatched</button>
                            )}

                            {/* Final states - No buttons */}
                            {(item.status === 'DISPATCHED' || item.status === 'REJECTED') && (
                                <p className="text-center text-gray-500 text-sm">No further actions available.</p>
                            )}
                        </div>

                        <button onClick={() => navigate('/seller/orders')} className="w-full mt-4 border py-2 rounded text-gray-700 hover:bg-gray-50">
                            Back to Orders
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}