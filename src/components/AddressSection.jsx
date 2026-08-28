import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddressSection({ setSelectedDeliveryAddress }) {
    // States
    const [mode, setMode] = useState('SAVED'); // 'SAVED' or 'NEW'
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    // New address form states
    const [newAddr, setNewAddr] = useState({ label: 'Home', addressLine: '', city: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);

    // 1. PAGE LOAD: Backend eken Saved Addresses ganna
    useEffect(() => {
        axios.get('/api/addresses')
            .then(res => {
                setSavedAddresses(res.data);
                // First address eka auto-select karanna
                if (res.data.length > 0) {
                    const firstAddrId = res.data[0].id.toString();
                    setSelectedId(firstAddrId);
                    setSelectedDeliveryAddress(firstAddrId); // Parent ekata yawanawa
                }
            })
            .catch(err => console.log("No saved addresses yet"));
    }, []);

    // 2. SAVED ADDRESS CLICK: Parent ekata id eka pass karanna
    const handleSelectSaved = (id) => {
        setSelectedId(id);
        setSelectedDeliveryAddress(id.toString());
    };

    // 3. NEW ADDRESS SAVE: Backend ekata save karanna & List eka update karanna
    const handleSaveNewAddress = async (e) => {
        e.preventDefault(); // Form reload prevent

        // Validation
        if (!newAddr.addressLine || !newAddr.city || !newAddr.phone) {
            return alert("Please fill in Address, City, and Phone");
        }

        setIsSaving(true);
        try {
            // Backend API ekata POST
            const response = await axios.post('/api/addresses', newAddr);

            // A. State eka update karanna (List eke instantly pennanawa)
            setSavedAddresses(prev => [response.data, ...prev]);

            // B. New address eka auto-select karanna
            const newId = response.data.id.toString();
            setSelectedId(newId);
            setSelectedDeliveryAddress(newId);

            // C. Mode eka 'SAVED' walata back yanna (Form eka hide karanna)
            setMode('SAVED');

            // D. Form eka clear karanna
            setNewAddr({ label: 'Home', addressLine: '', city: '', phone: '' });

        } catch (error) {
            alert("Failed to save address");
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-lg font-bold mb-4">1. Delivery Address</h2>

            {/* TOGGLE BUTTONS */}
            <div className="flex gap-3 mb-5">
                <button onClick={() => setMode('SAVED')} className={`px-4 py-2 rounded font-medium border transition ${mode === 'SAVED' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}>
                    📍 Saved Addresses
                </button>
                <button onClick={() => setMode('NEW')} className={`px-4 py-2 rounded font-medium border transition ${mode === 'NEW' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}>
                    ✏️ Add New Address
                </button>
            </div>

            {/* --- MODE 1: SAVED ADDRESSES --- */}
            {mode === 'SAVED' && (
                <div className="space-y-3">
                    {savedAddresses.length > 0 ? (
                        savedAddresses.map(addr => (
                            <div key={addr.id} onClick={() => handleSelectSaved(addr.id)}
                                className={`p-4 border-2 rounded-lg cursor-pointer flex justify-between ${selectedId === addr.id.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                <div>
                                    <span className="font-bold text-gray-800">{addr.label}</span>
                                    <p className="text-sm text-gray-600 mt-1">{addr.addressLine}, {addr.city}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p>{addr.phone}</p>
                                    {selectedId === addr.id.toString() && <span className="text-blue-600 font-bold mt-1 block">Selected ✓</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 py-4 text-center border border-dashed rounded">No saved addresses. Please add a new one.</p>
                    )}
                </div>
            )}

            {/* --- MODE 2: NEW ADDRESS FORM --- */}
            {mode === 'NEW' && (
                <form onSubmit={handleSaveNewAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">

                    <div>
                        <label className="text-sm text-gray-600">Label</label>
                        <select value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} className="w-full border p-2 mt-1 rounded">
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phone Number</label>
                        <input type="text" placeholder="07X XXXXXXX" required className="w-full border p-2 mt-1 rounded" value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Address Line</label>
                        <input type="text" placeholder="No 47/A, Yatawara Junction..." required className="w-full border p-2 mt-1 rounded" value={newAddr.addressLine} onChange={e => setNewAddr({ ...newAddr, addressLine: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">City</label>
                        <input type="text" placeholder="Gampaha" required className="w-full border p-2 mt-1 rounded" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} />
                    </div>

                    {/* THIS IS THE SAVE BUTTON */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setMode('SAVED')} className="px-6 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                            {isSaving ? 'Saving...' : '💾 Save Address'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}