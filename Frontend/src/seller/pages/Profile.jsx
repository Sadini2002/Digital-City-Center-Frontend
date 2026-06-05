import React from "react";

export default function SellerProfile() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Seller Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
          />

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              John Seller
            </h1>
            <p className="text-gray-600">johnseller@example.com</p>
            <p className="text-gray-600">+94 71 234 5678</p>

            <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Active Seller
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Store Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm">
                Store Name
              </label>
              <input
                type="text"
                value="Digital City Store"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Store Category
              </label>
              <input
                type="text"
                value="Electronics"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Address
              </label>
              <textarea
                rows="3"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
                value="Colombo, Sri Lanka"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm">
                Full Name
              </label>
              <input
                type="text"
                value="John Seller"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Email
              </label>
              <input
                type="email"
                value="johnseller@example.com"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Phone Number
              </label>
              <input
                type="text"
                value="+94 71 234 5678"
                readOnly
                className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}