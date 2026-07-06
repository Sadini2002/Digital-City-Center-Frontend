import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import ProductBreadcrumbs from "../components/product/ProductBreadcrumbs";
import ShopCard from "../components/shop/ShopCard";
import { getAllShops } from "../services/shopService";

const breadcrumbs = [
  { label: "Home", to: "/" },
  { label: "Shops", to: null },
];

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const response = await getAllShops();
      setShops(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  // Sorting
  const sorted = [...shops];

  switch (sort) {
    case "rating":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;

    case "products":
      sorted.sort(
        (a, b) => (b.productCount || 0) - (a.productCount || 0)
      );
      break;

    case "reviews":
      sorted.sort(
        (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
      );
      break;

    case "views":
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;

    default:
      break;
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Marketplace Shops
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Browse verified sellers across Sri Lanka.
        </p>

        {/* Sort Dropdown */}
       <div className="mt-6 flex items-center justify-end gap-3">
  <span className="text-sm font-medium text-slate-600">
    Sort by
  </span>

  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="
      rounded-xl
      border border-slate-200
      bg-white
      px-4 py-2.5
      text-sm font-medium
      text-slate-700
      shadow-sm
      outline-none
      transition
      hover:border-dcc-primary
      focus:border-dcc-primary
      focus:ring-2
      focus:ring-dcc-primary/20
    "
  >
    <option value="rating">Highest Rated</option>
    <option value="products">Most Products</option>
    <option value="reviews">Most Reviews</option>
    <option value="views">Most Viewed</option>
  </select>
</div>

        {/* Shop Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
            />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}