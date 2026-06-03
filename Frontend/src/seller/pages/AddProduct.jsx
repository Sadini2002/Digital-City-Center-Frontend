import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/media";
import axios from "axios";

export default function AddProduct() {
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
    if (!token) return toast.error("Please sign in as a seller");

    if (!productId || !name) {
      return toast.error("Product ID and Name are required");
    }

    if (!image.length) {
      return toast.error("Please upload at least one image");
    }

    try {
      const imageUrls = image.length > 0
        ? await Promise.all(image.map(mediaUpload))
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'];

      const apiBase = (
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        'http://localhost:5000/api'
      ).replace(/\/+$/, '')

      await axios.post(
        `${apiBase}/products`,
        {
          productId,
          name,
          altName,
          price: Number(price),
          description,
          image: imageUrls,
          labelPrice: Number(labelPrice),
          stock: Number(stock),
          isAvailable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product added successfully");
      navigate("/seller/listings");
    } catch (err) {
      console.warn("API add product failed, saving to local storage fallback", err);
      // Fallback
      const newProduct = {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        productId: productId || 'prod_' + Math.random().toString(36).substr(2, 9),
        name,
        altName,
        price: Number(price),
        description,
        image: image.length > 0 ? image.map(f => typeof f === 'string' ? f : URL.createObjectURL(f)) : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'],
        labelPrice: Number(labelPrice),
        stock: Number(stock),
        isAvailable,
      };
      const local = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]');
      local.push(newProduct);
      localStorage.setItem('dcc_seller_products', JSON.stringify(local));

      toast.success("Product added successfully (local storage)");
      navigate("/seller/listings");
    }
  }
 
    
  

  return (
    <div className="mx-auto max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-fadeIn">

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Add Product
        </h2>
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
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
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
              to="/seller/listings"
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover transition"
            >
              Add Product
            </button>
          </div>

        </form>
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
        className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none"
      />
    </div>
  );
}


  
