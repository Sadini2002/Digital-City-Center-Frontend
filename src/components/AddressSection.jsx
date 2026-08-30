import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSavedAddresses, saveAddress } from '../buyer/utils/addressStorage';

export default function AddressSection({ setSelectedDeliveryAddress }) {
    // States
    const [mode, setMode] = useState('SAVED'); // 'SAVED' or 'NEW'
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    // New address form states
    const [newAddr, setNewAddr] = useState({ label: 'Home', addressLine: '', city: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);

    // 1. PAGE LOAD: Fetch saved addresses from Backend or local storage
    useEffect(() => {
        axios.get('/api/addresses')
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setSavedAddresses(res.data);
                    const firstAddrId = res.data[0].id.toString();
                    setSelectedId(firstAddrId);
                    setSelectedDeliveryAddress?.(firstAddrId);
                } else {
                    const fallback = getSavedAddresses();
                    if (fallback.length > 0) {
                        setSavedAddresses(fallback);
                        const firstId = fallback[0].id.toString();
                        setSelectedId(firstId);
                        setSelectedDeliveryAddress?.(firstId);
                    } else {
                        setSavedAddresses([]);
                        setMode('NEW');
                    }
                }
            })
            .catch(err => {
                console.log("Using local storage fallback for saved addresses:", err);
                const fallback = getSavedAddresses();
                if (fallback.length > 0) {
                    setSavedAddresses(fallback);
                    const firstId = fallback[0].id.toString();
                    setSelectedId(firstId);
                    setSelectedDeliveryAddress?.(firstId);
                } else {
                    setSavedAddresses([]);
                    setMode('NEW');
                }
            });
    }, []);

    // 2. SAVED ADDRESS CLICK: Pass selected ID to parent
    const handleSelectSaved = (id) => {
        const idStr = id.toString();
        setSelectedId(idStr);
        setSelectedDeliveryAddress?.(idStr);
    };

    // 3. NEW ADDRESS SAVE: POST to Backend & update list (or fallback to local storage)
    const handleSaveNewAddress = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!newAddr.addressLine?.trim() || !newAddr.city?.trim() || !newAddr.phone?.trim()) {
            return alert("Please fill in Address, City, and Phone");
        }

        setIsSaving(true);
        try {
            let created;
            try {
                const response = await axios.post('/api/addresses', newAddr);
                created = response.data;
            } catch (err) {
                console.warn("Backend API unavailable, saving locally:", err);
            }

            const { createdAddress, updatedList } = saveAddress({
                label: newAddr.label || 'Home',
                phone: newAddr.phone,
                line1: newAddr.addressLine,
                city: newAddr.city,
                district: newAddr.city,
            });

            if (created && created.id) {
                createdAddress.id = created.id;
            }

            setSavedAddresses(updatedList);

            const newId = (createdAddress?.id || Date.now()).toString();

            // Auto select the newly created address
            setSelectedId(newId);
            setSelectedDeliveryAddress?.(newId);

            // Return mode to 'SAVED' and clear form
            setMode('SAVED');
            setNewAddr({ label: 'Home', addressLine: '', city: '', phone: '' });

        } catch (error) {
            console.error("Save address error:", error);
            alert("Failed to save address. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-lg font-bold mb-4">1. Delivery Address</h2>

            {/* TOGGLE BUTTONS */}
            <div className="flex gap-3 mb-5">
                <button
                    type="button"
                    onClick={() => setMode('SAVED')}
                    className={`px-4 py-2 rounded font-medium border transition ${mode === 'SAVED' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}
                >
                    📍 Saved Addresses {savedAddresses.length > 0 && `(${savedAddresses.length})`}
                </button>
                <button
                    type="button"
                    onClick={() => setMode('NEW')}
                    className={`px-4 py-2 rounded font-medium border transition ${mode === 'NEW' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}
                >
                    ✏️ Add New Address
                </button>
            </div>

            {/* --- MODE 1: SAVED ADDRESSES --- */}
            {mode === 'SAVED' && (
                <div className="space-y-3">
                    {savedAddresses.length > 0 ? (
                        savedAddresses.map(addr => {
                            const addrIdStr = addr.id.toString();
                            const isSelected = selectedId === addrIdStr;
                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => handleSelectSaved(addr.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer flex justify-between items-center transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <div>
                                        <span className="font-bold text-gray-800">{addr.label || 'Address'}</span>
                                        <p className="text-sm text-gray-600 mt-1">{addr.addressLine || addr.line1}, {addr.city}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>{addr.phone}</p>
                                        {isSelected && <span className="text-blue-600 font-bold mt-1 block">Selected ✓</span>}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 border border-dashed rounded bg-gray-50">
                            <p className="text-gray-500 mb-3">No saved addresses found.</p>
                            <button
                                type="button"
                                onClick={() => setMode('NEW')}
                                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                            >
                                + Add Your First Address
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- MODE 2: NEW ADDRESS FORM --- */}
            {mode === 'NEW' && (
                <form onSubmit={handleSaveNewAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">

                    <div>
                        <label className="text-sm font-medium text-gray-700">Label</label>
                        <select
                            value={newAddr.label}
                            onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                            className="w-full border p-2 mt-1 rounded bg-white"
                        >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            placeholder="07X XXXXXXX"
                            required
                            className="w-full border p-2 mt-1 rounded bg-white"
                            value={newAddr.phone}
                            onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address Line</label>
                        <input
                            type="text"
                            placeholder="No 47/A, Main Street..."
                            required
                            className="w-full border p-2 mt-1 rounded bg-white"
                            value={newAddr.addressLine}
                            onChange={e => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            placeholder="Colombo / Kandy / Gampaha"
                            required
                            className="w-full border p-2 mt-1 rounded bg-white"
                            value={newAddr.city}
                            onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                        />
                    </div>

                    {/* SAVE & CANCEL BUTTONS */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        {savedAddresses.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setMode('SAVED')}
                                className="px-6 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
                        >
                            {isSaving ? 'Saving...' : '💾 Save Address'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}