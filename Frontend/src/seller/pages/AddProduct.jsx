import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/media";
import { getAuthToken } from "../../utils/authStorage";
import { validateUploadFiles } from "../../utils/fileUploadValidation";
import axios from "axios";
import { Plus, Trash, Sparkles } from "lucide-react";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState([]);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [labelPrice, setLabelPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  // New Requirements properties
  const [itemType, setItemType] = useState("physical") // physical vs service
  const [sizes, setSizes] = useState("") // comma separated sizes
  const [colors, setColors] = useState("") // comma separated colors
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountStart, setDiscountStart] = useState("")
  const [discountEnd, setDiscountEnd] = useState("")

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const validation = validateUploadFiles(e.target.files, { label: 'Image' })
    if (!validation.valid) {
      setUploadError(validation.error)
      setImage([])
      toast.error(validation.error)
      e.target.value = ''
      return
    }

    const files = validation.files
    if (files.length > 8) {
      const message = 'You can upload a maximum of 8 images.'
      setUploadError(message)
      setImage([])
      toast.error(message)
      e.target.value = ''
      return
    }
    setUploadError('')
    setImage(files)
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = getAuthToken();
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
          stock: itemType === 'service' ? 9999 : Number(stock),
          isAvailable,
          itemType,
          variants: {
            sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
            colors: colors.split(",").map(c => c.trim()).filter(Boolean),
          },
          discount: {
            percent: Number(discountPercent),
            startDate: discountStart,
            endDate: discountEnd,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product added successfully");
      navigate("/seller/listings");
    } catch (err) {
      console.warn("API add product failed, saving to local storage fallback", err);
      
      const savedSettings = JSON.parse(localStorage.getItem('dcc_shop_settings') || '{}');
      const currentShopName = savedSettings.shopName || 'Tech World LK';
      const currentShopSlug = currentShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newProduct = {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        productId: productId || 'prod_' + Math.random().toString(36).substr(2, 9),
        name,
        altName,
        price: Number(price),
        description,
        image: image.length > 0 ? image.map(f => typeof f === 'string' ? f : URL.createObjectURL(f)) : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'],
        labelPrice: Number(labelPrice),
        stock: itemType === 'service' ? 9999 : Number(stock),
        isAvailable,
        itemType,
        variants: {
          sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
          colors: colors.split(",").map(c => c.trim()).filter(Boolean),
        },
        discount: {
          percent: Number(discountPercent),
          startDate: discountStart,
          endDate: discountEnd,
        },
        shopId: currentShopSlug,
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
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Add Listing
        </h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          Create a new product or service for your store
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

          <div className="grid grid-cols-2 gap-4">
            <Input label="Listing ID" value={productId} onChange={setProductId} placeholder="e.g. prod-1" />
            <Input label="Listing Name" value={name} onChange={setName} placeholder="e.g. T-Shirt" />
          </div>

          <Input
            label="Alternative Names"
            value={altName.join(",")}
            onChange={(v) => setAltName(v.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="Comma separated search keywords"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (Rs.)" type="number" value={price} onChange={setPrice} />
            <Input label="Label Price" type="number" value={labelPrice} onChange={setLabelPrice} />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Description</label>
            <textarea
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of your item..."
            />
          </div>

          {/* Image Upload - Max 8 images */}
          <div>
            <label className="text-sm text-gray-600 font-medium block">Listing Images (Max 8)</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="w-full mt-2 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 transition"
            />
            <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, or GIF only. Max 5MB per file.</p>
            {uploadError && (
              <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                {uploadError}
              </p>
            )}
            {image.length > 0 && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                {image.length} of 8 images uploaded
              </span>
            )}
          </div>

          {/* Product Variants (Sizes & Colors) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-dcc-primary" /> Listing Variants
            </span>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sizes (Optional)"
                value={sizes}
                onChange={setSizes}
                placeholder="e.g. S, M, L"
              />
              <Input
                label="Colors (Optional)"
                value={colors}
                onChange={setColors}
                placeholder="e.g. Red, Blue"
              />
            </div>
          </div>

          {/* Discounts */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Discounts & Promotion
            </span>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Discount (%)"
                type="number"
                value={discountPercent}
                onChange={setDiscountPercent}
              />
              <Input
                label="Start Date"
                type="date"
                value={discountStart}
                onChange={setDiscountStart}
              />
              <Input
                label="End Date"
                type="date"
                value={discountEnd}
                onChange={setDiscountEnd}
              />
            </div>
          </div>

          {/* Stock + Availability */}
          <div className="flex items-center justify-between pt-2">
            {itemType === 'physical' ? (
              <Input
                label="Stock Quantity"
                type="number"
                value={stock}
                onChange={setStock}
                small
              />
            ) : (
              <span className="text-xs text-slate-500 italic">No stock tracking needed for Services</span>
            )}

            <label className="flex items-center gap-3 text-sm text-gray-700 font-medium">
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
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover transition"
            >
              Add Listing
            </button>
          </div>

        </form>
      </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", small }) {
  return (
    <div className={small ? "w-32" : "w-full"}>
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dcc-primary/20 focus:border-dcc-primary focus:outline-none text-sm transition"
      />
    </div>
  );
}
