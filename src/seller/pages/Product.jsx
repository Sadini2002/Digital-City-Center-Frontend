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
      isAvailable:
        item.isAvailable !== undefined
          ? item.isAvailable
          : item.type === "SERVICE" || item.stock > 0,
      image: Array.isArray(item.image)
        ? item.image
        : item.image
          ? [item.image]
          : [],
    }));

    setProducts(normalizedList);
  } catch (err) {
    console.error("API error fetching products:", err);
    // DO NOT load global mock items on error
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await axios.delete(`${apiBase}/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.warn(
        "API error deleting product, falling back to local storage",
        err,
      );
      const local = JSON.parse(
        localStorage.getItem("dcc_seller_products") || "[]",
      );
      const updated = local.filter((p) => (p._id || p.id) !== id);
      localStorage.setItem("dcc_seller_products", JSON.stringify(updated));
      toast.success("Product deleted successfully (local)");
      fetchProducts();
    }
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product._id?.toLowerCase().includes(searchQuery.toLowerCase());

      const isAvailable =
        product.type === "SERVICE"
          ? true
          : product.isAvailable && product.stock > 0;
      if (statusFilter === "available") {
        return matchesSearch && isAvailable;
      } else if (statusFilter === "outofstock") {
        return matchesSearch && !isAvailable;
      }
      return matchesSearch;
    },
  );

  return (
    <div className="space-y-6">
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
