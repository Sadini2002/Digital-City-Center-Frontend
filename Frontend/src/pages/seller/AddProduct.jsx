import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({});

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5">
        Add Product
      </h1>

      <input
        type="text"
        placeholder="Product Name"
        className="w-full border p-3 mb-3"
      />

      <textarea
        placeholder="Description"
        className="w-full border p-3 mb-3"
      />

      <input
        type="number"
        placeholder="Price"
        className="w-full border p-3 mb-3"
      />

      <button className="bg-green-600 text-white px-6 py-3 rounded">
        Save Product
      </button>
    </div>
  );
}