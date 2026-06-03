import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state;

  if (!product) {
    toast.error("No product data found");
    navigate("/admin/products");
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

  // this is the media upload function that uploads a single file and returns the URL

 /* async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin not logged in");

    let uploadedNewImages = [];
    if (newImages.length) {
      try {
        uploadedNewImages = await Promise.all(
          newImages.map((file) => mediaUpload(file))
        );
      } catch {
        return toast.error("Image upload failed");
      }
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products/${product._id}`,
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
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  }*/

  return (
    
      <div className="w-full flex justify-center items-center bg-gradient-to-br from-green-400 to-green-600 p-6">
    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg animate-fadeIn">

        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-1">
          Edit Product
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
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
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
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
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
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
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
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
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
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
              className="w-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
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
              to="/admin/products"
              className="px-6 py-3 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
