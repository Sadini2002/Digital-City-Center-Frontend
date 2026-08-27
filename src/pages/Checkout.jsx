import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ cartItems: [], addresses: [] });

    const [selectedAddress, setSelectedAddress] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('PLATFORM');
    const [paymentMethod, setPaymentMethod] = useState('PAYHERE');

    // Modal States
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', addressLine: '', city: '', province: '', phone: '' });

    useEffect(() => {
        axios.get('/api/checkout/details').then(res => {
            setData(res.data);
            if (res.data.addresses.length > 0) setSelectedAddress(res.data.addresses[0].id.toString());
        }).catch(err => console.error(err));
    }, []);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/addresses', newAddress);
            setData(prev => ({ ...prev, addresses: [res.data, ...prev.addresses] }));
            setSelectedAddress(res.data.id.toString());
            setShowAddressModal(false);
            setNewAddress({ label: '', addressLine: '', city: '', province: '', phone: '' });
        } catch (error) {
            alert("Failed to save address");
        }
    };
}

const groupedItems = data.cartItems.reduce((acc, item) => {
    const shopName = item.listing.seller.shopName;
    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(item);
    return acc;
}, {});

const subtotal = data.cartItems.reduce((sum, item) => sum + (item.listing.price * item.quantity), 0);
const deliveryFee = deliveryMethod === 'SELLER_PICKUP' ? 0 : (deliveryMethod === 'PLATFORM' ? 350 : 500);
const total = subtotal + deliveryFee;

const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Please select a delivery address");
    setLoading(true);
    try {
        const response = await axios.post('/api/checkout/create', { addressId: selectedAddress, deliveryMethod, paymentMethod });
        if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl; // Redirect to PayHere
        } else {
            navigate(`/order/${response.data.orderId}/success`); // Redirect for COD
        }
    } catch (error) {
        alert(error.response?.data?.message || "Something went wrong.");
    }
    setLoading(false);
};

return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS SELECTION */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-bold mb-4">1. Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.addresses.map(addr => (
                        <div key={addr.id} onClick={() => setSelectedAddress(addr.id.toString())}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress === addr.id.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <span className="font-semibold">{addr.label || 'Address'}</span>
                            <p className="text-sm text-gray-600 mt-1">{addr.addressLine}, {addr.city}</p>
                            <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
                        </div>
                    ))}
                    <button onClick={() => setShowAddressModal(true)} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-500">
                        + Add New Address
                    </button>
                </div>
            </div>

            {/* DELIVERY METHOD */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-bold mb-4">2. Delivery Method</h2>
                <div className="space-y-3">
                    {[
                        { id: 'PLATFORM', label: 'Platform Delivery', fee: 350 },
                        { id: 'SELLER_PICKUP', label: 'Seller Pickup', fee: 0 },
                        { id: 'THIRD_PARTY', label: 'Third Party Courier', fee: 500 }
                    ].map(method => (
                        <label key={method.id} className={`flex justify-between p-4 border rounded-lg cursor-pointer ${deliveryMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <div className="flex items-center">
                                <input type="radio" name="delivery" value={method.id} checked={deliveryMethod === method.id} onChange={(e) => setDeliveryMethod(e.target.value)} className="mr-4" />
                                <span className="font-medium">{method.label}</span>
                            </div>
                            <span className="font-semibold">Rs. {method.fee}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-bold mb-4">3. Payment Method</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['PAYHERE', 'KOKO', 'ONEPAY', 'MINTPAY', 'COD'].map(method => (
                        <div key={method} onClick={() => setPaymentMethod(method)} className={`p-3 border-2 rounded-lg text-center cursor-pointer font-medium ${paymentMethod === method ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                            {method === 'COD' ? '💵 Cash on Delivery' : method}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h2>
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                    {Object.entries(groupedItems).map(([shopName, items]) => (
                        <div key={shopName}>
                            <p className="text-sm font-bold text-gray-500 uppercase">{shopName}</p>
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm py-1">
                                    <span className="text-gray-700 truncate mr-2">{item.listing.title} x {item.quantity}</span>
                                    <span>Rs. {(item.listing.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span>Rs. {deliveryFee.toFixed(2)}</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
                </div>
                <button onClick={handlePlaceOrder} disabled={!selectedAddress || loading} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-400">
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>

        {/* MODAL FOR NEW ADDRESS */}
        {showAddressModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                        <input type="text" placeholder="Label (e.g. Home)" required className="w-full border p-2 rounded" value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} />
                        <input type="text" placeholder="Address Line" required className="w-full border p-2 rounded" value={newAddress.addressLine} onChange={e => setNewAddress({ ...newAddress, addressLine: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="City" required className="w-full border p-2 rounded" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                            <input type="text" placeholder="Province" required className="w-full border p-2 rounded" value={newAddress.province} onChange={e => setNewAddress({ ...newAddress, province: e.target.value })} />
                        </div>
                        <input type="text" placeholder="Phone" required className="w-full border p-2 rounded" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 border py-2 rounded">Cancel</button>
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);
