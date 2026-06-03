import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/media";


export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state;

  if (!product) {
    toast.error("No product data found");
    navigate("/seller/listings");
    return null;
  }

  const [productId, setProductId] = useState(product.productId || "");
  const [name, setName] = useState(product.name || "");
  const [altName, setAltName] = useState(product.altName || [","]);
  const [price, setPrice] = useState(product.price || 0);
  const [description, setDescription] = useState(product.description || "");
  const [existingImages, setExistingImages] = useState(product.image || []);
  const [newImages, setNewImages] = useState([]);
  const [labelPrice, setLabelPrice] = useState(product.labelPrice || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable ?? true);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please sign in as a seller");

    let uploadedNewImages = [];
    if (newImages.length) {
      try {
        uploadedNewImages = await Promise.all(newImages.map((file) => mediaUpload(file)));
      } catch {
        return toast.error("Image upload failed");
      }
    }

    const apiBase = (
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      'http://localhost:5000/api'
    ).replace(/\/+$/, '');

    try {
      await axios.put(
        `${apiBase}/products/${product._id}`,
        {
          productId,
          name,
          altName,
          price: Number(price),
          description,
          image: [...existingImages, ...uploadedNewImages],
          labelPrice: Number(labelPrice),
          stock: Number(stock),
          isAvailable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product updated successfully");
      navigate("/seller/listings");
    } catch (err) {
      console.warn("API update product failed, updating local storage fallback", err);
      // Fallback
      const local = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]');
      const updated = local.map((p) => {
        if ((p._id || p.id) === (product._id || product.id)) {
          return {
            ...p,
            productId,
            name,
            altName,
            price: Number(price),
            description,
            image: [...existingImages, ...newImages.map(f => typeof f === 'string' ? f : URL.createObjectURL(f))],
            labelPrice: Number(labelPrice),
            stock: Number(stock),
            isAvailable,
          };
        }
        return p;
      });
      localStorage.setItem('dcc_seller_products', JSON.stringify(updated));

      toast.success("Product updated successfully (local storage)");
      navigate("/seller/listings");
    }
  }

  return (
    <div className="mx-auto max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-fadeIn">

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Edit Product
        </h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          Update product details carefully
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Input */}
          {[
            ["Product ID", productId, setProductId],
            ["Product Name", name, setName],
          ].map(([label, value, setter], i) => (
            <div key={i}>
              <label className="text-sm text-gray-600">{label}</label>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
              />
            </div>
          ))}

          {/* Alt Names */}
          <div>
            <label className="text-sm text-gray-600">Alternative Names</label>
            <input
              value={altName.join(",")}
              onChange={(e) =>
                setAltName(
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Price", price, setPrice],
              ["Label Price", labelPrice, setLabelPrice],
            ].map(([label, value, setter], i) => (
              <div key={i}>
                <label className="text-sm text-gray-600">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
            />
          </div>

          {/* Images */}
          <div className="flex gap-3 flex-wrap">
            {existingImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-16 h-16 rounded-xl object-cover shadow"
              />
            ))}
          </div>

          <input
            type="file"
            multiple
            className="w-full text-sm"
            onChange={(e) => setNewImages(Array.from(e.target.files))}
          />

          {/* Stock + Toggle */}
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
              className="w-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
            />

            <label className="flex items-center gap-3 text-sm">
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
              to="/seller/listings"
              className="px-6 py-3 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
  );
}
