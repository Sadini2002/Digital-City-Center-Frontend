import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/media";
import { Sparkles } from "lucide-react";

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

  // Requirement parameters
  const [itemType, setItemType] = useState(product.itemType || "physical")
  const [sizes, setSizes] = useState(product.variants?.sizes?.join(",") || "")
  const [colors, setColors] = useState(product.variants?.colors?.join(",") || "")
  const [discountPercent, setDiscountPercent] = useState(product.discount?.percent || 0)
  const [discountStart, setDiscountStart] = useState(product.discount?.startDate || "")
  const [discountEnd, setDiscountEnd] = useState(product.discount?.endDate || "")

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (existingImages.length + files.length > 8) {
      toast.error("You can upload a maximum of 8 images.")
      return
    }
    setNewImages(files)
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please sign in as a seller");

    if (Number(price) < 0) {
      return toast.error("Price cannot be negative");
    }

    if (Number(labelPrice) < 0) {
      return toast.error("Label price cannot be negative");
    }

    if (itemType === 'physical' && Number(stock) < 0) {
      return toast.error("Stock quantity cannot be negative");
    }

    if (Number(discountPercent) < 0 || Number(discountPercent) > 100) {
      return toast.error("Discount percentage must be between 0 and 100");
    }

    const variantSizes = sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const variantColors = colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    if (new Set(variantSizes.map((s) => s.toLowerCase())).size !== variantSizes.length) {
      return toast.error('Duplicate size variants are not allowed');
    }

    if (new Set(variantColors.map((c) => c.toLowerCase())).size !== variantColors.length) {
      return toast.error('Duplicate color variants are not allowed');
    }

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
          stock: itemType === 'service' ? 9999 : Number(stock),
          isAvailable,
          itemType,
          variants: {
            sizes: variantSizes,
            colors: variantColors,
          },
          discount: {
            percent: Number(discountPercent),
            startDate: discountStart,
            endDate: discountEnd,
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product updated successfully");
      navigate("/seller/listings");
    } catch (err) {
      console.warn("API update product failed, updating local storage fallback", err);
      
      const savedSettings = JSON.parse(localStorage.getItem('dcc_shop_settings') || '{}');
      const currentShopName = savedSettings.shopName || 'Tech World LK';
      const currentShopSlug = currentShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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
            stock: itemType === 'service' ? 9999 : Number(stock),
            isAvailable,
            itemType,
            variants: {
              sizes: variantSizes,
              colors: variantColors,
            },
            discount: {
              percent: Number(discountPercent),
              startDate: discountStart,
              endDate: discountEnd,
            },
            shopId: p.shopId || currentShopSlug,
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
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Edit Listing
        </h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          Update your product or service details carefully
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Listing Type Selection */}
          <div className="flex gap-4 p-1 rounded-xl bg-slate-100">
            <button
              type="button"
              onClick={() => setItemType("physical")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                itemType === 'physical' ? 'bg-white text-dcc-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Physical Product
            </button>
            <button
              type="button"
              onClick={() => setItemType("service")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                itemType === 'service' ? 'bg-white text-dcc-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Service (Non-physical)
            </button>
          </div>

          {/* Product ID and Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Listing ID</label>
              <input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Listing Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Alt Names */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Alternative Names</label>
            <input
              value={altName.join(",")}
              onChange={(e) =>
                setAltName(
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Price (Rs.)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Label Price</label>
              <input
                type="number"
                min="0"
                value={labelPrice}
                onChange={(e) => setLabelPrice(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Existing Images</label>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden shadow">
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-red-600/70 text-white font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div>
            <label className="text-sm text-gray-600 font-medium block">Upload New Images (Max 8 Total)</label>
            <input
              type="file"
              multiple
              className="w-full mt-2 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 transition"
              onChange={handleImageChange}
            />
          </div>

          {/* Variants */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-dcc-primary" /> Listing Variants
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 font-medium">Sizes</label>
                <input
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="e.g. S, M, L"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-xs transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Colors</label>
                <input
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="e.g. Red, Blue"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-xs transition"
                />
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Discounts & Promotion
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600 font-medium">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-xs transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Start Date</label>
                <input
                  type="date"
                  value={discountStart}
                  onChange={(e) => setDiscountStart(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-xs transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">End Date</label>
                <input
                  type="date"
                  value={discountEnd}
                  onChange={(e) => setDiscountEnd(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-xs transition"
                />
              </div>
            </div>
          </div>

          {/* Stock + Toggle */}
          <div className="flex items-center justify-between pt-2">
            {itemType === 'physical' ? (
              <div>
                <label className="text-sm text-gray-600 font-medium">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-32 mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
                />
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No stock tracking needed for Services</span>
            )}

            <label className="flex items-center gap-3 text-sm font-medium">
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
          <div className="flex justify-between pt-6 border-t border-slate-100">
            <Link
              to="/seller/listings"
              className="px-6 py-3 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover transition"
            >
              Update Listing
            </button>
          </div>
        </form>
      </div>
  );
}
