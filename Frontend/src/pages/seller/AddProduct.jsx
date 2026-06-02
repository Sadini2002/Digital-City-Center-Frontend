import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState([]);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [labelPrice, setLabelPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin not logged in");

    if (!productId || !name) {
      return toast.error("Product ID and Name are required");
    }

    if (!image.length) {
      return toast.error("Please upload at least one image");
    }

    try {
      const imageUrls = await Promise.all(image.map(mediaUpload));

      await axios.post(
        "http://localhost:5000/api/products/add",
        {
          productId,
          name,
          altName,
          price: Number(price),
          description,
          image: imageUrls,
          labalPrice: Number(labelPrice),
          stock: Number(stock),
          isAvailable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product added successfully");
      navigate("/seller/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add product");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200">

        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-1">
          Add Product
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Create a new product for your store
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Product ID */}
          <Input label="Product ID" value={productId} onChange={setProductId} />

          {/* Product Name */}
          <Input label="Product Name" value={name} onChange={setName} />

          {/* Alt Names */}
          <Input
            label="Alternative Names"
            value={altName.join(",")}
            onChange={(v) =>
              setAltName(v.split(",").map(s => s.trim()).filter(Boolean))
            }
            placeholder="Comma separated"
          />

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (Rs.)" type="number" value={price} onChange={setPrice} />
            <Input label="Label Price" type="number" value={labelPrice} onChange={setLabelPrice} />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm text-gray-600">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImage(Array.from(e.target.files))}
              className="w-full mt-2 text-sm"
            />
          </div>

          {/* Stock + Availability */}
          <div className="flex items-center justify-between">
            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={setStock}
              small
            />

            <label className="flex items-center gap-3 text-sm text-gray-700">
              Available
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="toggle toggle-success"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Link
              to="/seller/products"
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
            >
              Add Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* Reusable Apple-style input */
function Input({ label, value, onChange, type = "text", placeholder = "", small }) {
  return (
    <div className={small ? "w-32" : ""}>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
      />
    </div>
  );
}
