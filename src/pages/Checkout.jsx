import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressSection from '../components/AddressSection';

export default function Checkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ cartItems: [], addresses: [] });

    const [selectedAddress, setSelectedAddress] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('PLATFORM');
    const [paymentMethod, setPaymentMethod] = useState('PAYHERE');

    useEffect(() => {
        axios.get('/api/checkout/details').then(res => {
            setData(res.data || { cartItems: [], addresses: [] });
            if (res.data?.addresses?.length > 0) {
                setSelectedAddress(res.data.addresses[0].id.toString());
            }
        }).catch(err => console.error(err));
    }, []);

    const cartItems = data.cartItems || [];

    const groupedItems = cartItems.reduce((acc, item) => {
        const shopName = item.listing?.seller?.shopName || 'Shop';
        if (!acc[shopName]) acc[shopName] = [];
        acc[shopName].push(item);
        return acc;
    }, {});

    const subtotal = cartItems.reduce((sum, item) => sum + ((item.listing?.price || 0) * (item.quantity || 1)), 0);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

                {/* ADDRESS SELECTION */}
                <AddressSection setSelectedDeliveryAddress={setSelectedAddress} />

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
                                        <span className="text-gray-700 truncate mr-2">{item.listing?.title} x {item.quantity}</span>
                                        <span>Rs. {((item.listing?.price || 0) * item.quantity).toFixed(2)}</span>
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
        </div>
    );
}

