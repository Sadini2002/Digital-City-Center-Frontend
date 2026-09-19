import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuthToken } from "../../utils/authStorage";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import ProductTable from "../components/ProductTable";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = getAuthToken();
  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Token comes from authStorage (dcc_token, local or session storage)
      const authToken = getAuthToken();

      // The seller is identified by the token, so no sellerId is sent from the client
      const res = await axios.get(`${apiBase}/products/my-listings`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      const rawData = res.data?.data || [];

      const normalizedList = rawData.map((item) => ({
        ...item,
        _id: item._id || String(item.id),
        productId: item.productId || item.sku || `PRD-${item.id || item._id}`,
        name: item.name || item.title,
        status: item.status?.toLowerCase() || "active",
        isAvailable:
          item.isAvailable !== undefined
            ? item.isAvailable
            : item.type === "SERVICE" || item.stock > 0,
        image: Array.isArray(item.image)
          ? item.image
          : item.image
            ? [item.image]
            : [],
            allVariants: item.allVariants || item.variants || [],
      }));

      setProducts(normalizedList);
    } catch (err) {
      console.error("API error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    // 1. Lock the background interaction
    setIsDeleting(true);

    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Delete Listing?
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              This action cannot be undone. Are you sure?
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            {/* Cancel Button */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setIsDeleting(false); // Unlock screen on cancel
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            {/* Confirm Delete Button */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(id); // Execute deletion
              }}
              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          borderRadius: "12px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          padding: "12px 16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          zIndex: 9999, // Ensure toast renders above backdrop overlay
        },
      },
    );
  };

  const executeDelete = async (id) => {
    toast
      .promise(
        axios.delete(`${apiBase}/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        {
          loading: "Deleting listing...",
          success: "Listing deleted successfully! 🗑️",
          error: "Failed to delete listing from server.",
        },
      )
      .then(() => {
        setProducts((prev) =>
          prev.filter((p) => (p._id || String(p.id)) !== String(id)),
        );
      })
      .catch((err) => {
        console.warn("API error deleting product, running fallback...", err);

        const local = JSON.parse(
          localStorage.getItem("dcc_seller_products") || "[]",
        );
        const updated = local.filter(
          (p) => (p._id || String(p.id)) !== String(id),
        );
        localStorage.setItem("dcc_seller_products", JSON.stringify(updated));

        setProducts((prev) =>
          prev.filter((p) => (p._id || String(p.id)) !== String(id)),
        );
        toast.success("Listing removed from local storage");
      })
      .finally(() => {
        // 2. Unlock the background interaction once completed
        setIsDeleting(false);
      });
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      // 1. Search Query Matching
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product._id?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Availability Calculation
      const isAvailable =
        product.type === "SERVICE"
          ? product.status === "active"
          : product.status === "active" && product.stock > 0;

      const currentStatus = product.status?.toLowerCase() || "active";

      // 3. Status Filter Matching
      if (statusFilter === "all" || !statusFilter) {
        return true;
      }

      if (statusFilter === "available") {
        return isAvailable;
      }

      if (statusFilter === "outofstock") {
        return (
          product.type !== "SERVICE" &&
          product.stock <= 0 &&
          currentStatus === "active"
        );
      }
      // Direct status matches ("active", "paused", "draft")
      return currentStatus === statusFilter;
    },
  );

  return (
    <div className="space-y-6 relative">
      {/* Screen Overlay Backdrop to block background clicks */}
      {isDeleting && (
        <div
          className="fixed inset-0 z-[9990] bg-slate-900/20 backdrop-blur-[1px] transition-opacity"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by name or product ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status:
            </span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          >
            <option value="all">All Listings</option>
            <option value="available">Available</option>
            <option value="outofstock">Out of Stock</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>

          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Listing
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-dcc-primary" />
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={handleDelete} />
      )}
    </div>
  );
}
