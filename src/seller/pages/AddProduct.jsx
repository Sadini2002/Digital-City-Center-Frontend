import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api/client";

export default function AddProduct() {
  const navigate = useNavigate();

  const [sellerId, setSellerId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch your seller record (to get numeric sellerId) + categories
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [meRes, catRes] = await Promise.all([
          api.get("/seller/me"),
          api.get("/categories"),
        ]);

        const seller = meRes.data?.seller;
        if (!seller?.id) {
          toast.error("Could not find your seller profile.");
          navigate("/seller/dashboard");
          return;
        }
        setSellerId(seller.id);

        const cats = catRes.data?.data || [];
        setCategories(cats);
        if (cats.length) setCategoryId(String(cats[0].id));
      } catch (err) {
        toast.error(err.message || "Failed to load seller/category data.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!sellerId) return toast.error("Seller profile not loaded yet.");
    if (!categoryId) return toast.error("Please select a category.");
    if (!title.trim()) return toast.error("Product name is required.");

    const numericPrice = Number(price);
    if (!numericPrice || numericPrice <= 0) {
      return toast.error("Price must be a positive number.");
    }
    if (Number(stock) < 0) return toast.error("Stock cannot be negative.");

    setSubmitting(true);
    try {
      const attributes = {};
      if (color.trim()) attributes.Color = color.trim();
      if (size.trim()) attributes.Size = size.trim();

      const res = await api.post("/products", {
        sellerId: Number(sellerId),
        categoryId: Number(categoryId),
        title: title.trim(),
        description,
        price: numericPrice,
        stock: Number(stock),
        attributes,
        image: imageUrl.trim() || undefined,
      });

      toast.success("Product added successfully");
      navigate("/seller/listings");
    } catch (err) {
      toast.error(err.message || "Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-dcc-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Add Listing</h2>
      <p className="text-sm text-slate-500 text-center mb-8">
        Create a new product for your store
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-600 font-medium">Product Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Price (Rs.)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 font-medium">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Color (optional)</label>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Black"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Size (optional)</label>
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. M"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 font-medium">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">
            File upload isn't connected to storage yet — paste a direct image link for now.
          </p>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100">
          <Link to="/seller/listings" className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}