import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api/client";

export default function AddProduct() {
  const navigate = useNavigate();

  const [sellerId, setSellerId] = useState(null);
  const [categories, setCategories] = useState([]);
  // Basic Info
  const [type, setType] = useState("PRODUCT"); // "PRODUCT" or "SERVICE"
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);

  // Discount
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountStart, setDiscountStart] = useState("");
  const [discountEnd, setDiscountEnd] = useState("");

  const [imageFiles, setImageFiles] = useState([]);

  // Dynamic Variants (e.g. Size, Color)
  const [variants, setVariants] = useState([
    { color: "", size: "", price: "", stock: 0 },
  ]);

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

  // Image handers
  // Handle image selection & generation of local blob previews
  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (imageFiles.length + selectedFiles.length > 8) {
      return toast.error("You can upload a maximum of 8 images.");
    }

    const newEntries = selectedFiles
      .map((file) => {
        // Validate file size limit (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`);
          return null;
        }
        return {
          file,
          previewUrl: URL.createObjectURL(file),
        };
      })
      .filter(Boolean);

    setImageFiles((prev) => [...prev, ...newEntries]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl); // Cleanup memory
      return prev.filter((_, i) => i !== index);
    });
  };

  // Variant handlers
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", price: price || "", stock: stock || 0 },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!sellerId) return toast.error("Seller profile not loaded yet.");
    if (!categoryId) return toast.error("Please select a category.");
    if (!title.trim()) return toast.error("Title name is required.");

    if (imageFiles.length === 0) {
      return toast.error("Please select at least 1 product image.");
    }
    const numericPrice = Number(price);
    if (!numericPrice || numericPrice <= 0) {
      return toast.error("Price must be a positive number.");
    }

    if (type === "PRODUCT" && Number(stock) < 0) {
      return toast.error("Stock cannot be negative.");
    }

    setSubmitting(true);
    try {
      // 1. Upload raw Image Files to backend
      const formData = new FormData();
      imageFiles.forEach((item) => formData.append("images", item.file));

      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedImageUrls = uploadRes.data?.urls || [];

      // 2. Build final payload for Product API
      const formattedVariants = variants
        .filter((v) => v.color || v.size)
        .map((v) => ({
          price: v.price ? Number(v.price) : numericPrice,
          stock: type === "SERVICE" ? 0 : Number(v.stock),
          attributes: {
            ...(v.color && { Color: v.color }),
            ...(v.size && { Size: v.size }),
          },
        }));

      const payload = {
        sellerId: Number(sellerId),
        categoryId: Number(categoryId),
        title: title.trim(),
        description,
        type,
        price: numericPrice,
        stock: type === "SERVICE" ? 0 : Number(stock),
        images: uploadedImageUrls,
        variants: formattedVariants,
        discount: discountPrice
          ? {
              price: Number(discountPrice),
              startDate: discountStart || null,
              endDate: discountEnd || null,
            }
          : null,
      };
      await api.post("/products", payload);
      toast.success("Listing created successfully");
      navigate("/seller/listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing.");
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
    <div className="mx-auto max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 my-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
        Add New Listing
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        Create a product or service listing
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type selection */}

        <div>
          <label className="text-sm text-gray-600 font-medium block mb-2">
            Listing Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Physical Product Card */}
            <button
              type="button"
              onClick={() => setType("PRODUCT")}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                type === "PRODUCT"
                  ? "border-dcc-primary bg-dcc-primary/5 ring-2 ring-dcc-primary/20"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-semibold text-sm ${
                    type === "PRODUCT" ? "text-dcc-primary" : "text-slate-800"
                  }`}
                >
                  Physical Product
                </span>
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    type === "PRODUCT"
                      ? "border-dcc-primary bg-dcc-primary"
                      : "border-gray-300"
                  }`}
                >
                  {type === "PRODUCT" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Items requiring inventory, physical stock, or shipping
              </p>
            </button>

            {/* Service Card */}
            <button
              type="button"
              onClick={() => setType("SERVICE")}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                type === "SERVICE"
                  ? "border-dcc-primary bg-dcc-primary/5 ring-2 ring-dcc-primary/20"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-semibold text-sm ${
                    type === "SERVICE" ? "text-dcc-primary" : "text-slate-800"
                  }`}
                >
                  Service
                </span>
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    type === "SERVICE"
                      ? "border-dcc-primary bg-dcc-primary"
                      : "border-gray-300"
                  }`}
                >
                  {type === "SERVICE" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Non-physical offerings like tutoring, repairs, or delivery
              </p>
            </button>
          </div>
        </div>

        {/* Title and Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-dcc-primary text-sm"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-dcc-primary text-sm"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Price (Rs.)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-dcc-primary text-sm"
              required
            />
          </div>
          {type === "PRODUCT" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-dcc-primary text-sm"
                required
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-dcc-primary text-sm"
          />
        </div>

        {/* Image Upload Area with Thumbnail Previews */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {type === "SERVICE"
              ? "Service Banners / Promotional Images"
              : "Product Images"}{" "}
            ({imageFiles.length}/8)
          </label>

          <div className="grid grid-cols-4 gap-3 mt-2">
            {/* Image Preview Grid */}
            {imageFiles.map((item, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200"
              >
                <img
                  src={item.previewUrl}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow-sm"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {imageFiles.length < 8 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl aspect-square cursor-pointer hover:border-dcc-primary hover:bg-dcc-primary/5 transition-all">
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-xs text-gray-500 mt-1">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {type === "SERVICE"
              ? "Upload 1 to 8 images showcasing your service, portfolio, or promotional flyer."
              : "Upload 1 to 8 high-quality product images."}
          </p>
        </div>

        {/* Dynamic Product Variants */}
        {type === "PRODUCT" && (
          <div className="border-t pt-4">
            <label className="text-sm font-semibold text-gray-800 block mb-2">
              Variants (Optional)
            </label>
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 mb-2 items-center"
              >
                <input
                  placeholder="Color (e.g. Red)"
                  value={v.color}
                  onChange={(e) =>
                    handleVariantChange(idx, "color", e.target.value)
                  }
                  className="px-3 py-2 border rounded-xl text-sm"
                />
                <input
                  placeholder="Size (e.g. M)"
                  value={v.size}
                  onChange={(e) =>
                    handleVariantChange(idx, "size", e.target.value)
                  }
                  className="px-3 py-2 border rounded-xl text-sm"
                />
                <input
                  type="number"
                  placeholder="Variant Price"
                  value={v.price}
                  onChange={(e) =>
                    handleVariantChange(idx, "price", e.target.value)
                  }
                  className="px-3 py-2 border rounded-xl text-sm"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) =>
                      handleVariantChange(idx, "stock", e.target.value)
                    }
                    className="px-3 py-2 border rounded-xl text-sm w-full"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-500 text-xs px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-xs text-dcc-primary font-medium hover:underline mt-1"
            >
              + Add Product Variant
            </button>
          </div>
        )}

        {/* Optional Discounts */}
        <div className="border-t pt-4">
          <label className="text-sm font-semibold text-gray-800 block mb-2">
            Discount Settings (Optional)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500">Discounted Price</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Discount Price"
                className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                value={discountStart}
                onChange={(e) => setDiscountStart(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                type="date"
                value={discountEnd}
                onChange={(e) => setDiscountEnd(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Footer */}
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <Link
            to="/seller/listings"
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
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
