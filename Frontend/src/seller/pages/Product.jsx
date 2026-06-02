import { Link } from "react-router-dom";

export default function Products() {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          My Products
        </h1>

        <Link
          to="/seller/listings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}