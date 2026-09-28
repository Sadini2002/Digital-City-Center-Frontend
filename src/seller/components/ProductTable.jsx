import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, ChevronDown, ChevronRight, Layers } from "lucide-react";

export default function ProductTable({ products, onDelete }) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">No listings found.</p>
        <Link
          to="/seller/listings/new"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-3 py-3 w-10"></th> {/* Expand/Collapse Toggle */}
            <th className="px-4 py-3 font-semibold w-20">Image</th>
            <th className="px-5 py-3 font-semibold w-24">Product ID</th>
            <th className="px-5 py-3 font-semibold">Name</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Stock</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold text-right w-44">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const id = product._id || product.id;
            const isExpanded = !!expandedRows[id];
            const variants = product.allVariants || [];
            const hasVariants = variants.length > 0;

            const imageUrl = Array.isArray(product.image)
              ? product.image[0]
              : product.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60";

            // Check if item is a SERVICE or a PRODUCT
            const isService = product.type === "SERVICE";

            // Availability check
            const isAvailable = isService
              ? true
              : product.isAvailable !== undefined
                ? product.isAvailable
                : product.stock > 0;

            return (
              <React.Fragment key={id}>
                {/* Main Product Row */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="px-3 py-3.5 text-center">
                    {hasVariants ? (
                      <button
                        type="button"
                        onClick={() => toggleRow(id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-dcc-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 object-cover shadow-sm"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60";
                      }}
                    />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-500 text-xs">
                    {product.productId || id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {product.name}
                      </span>
                      {isService && (
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                          SERVICE
                        </span>
                      )}
                      {hasVariants && (
                        <button
                          type="button"
                          onClick={() => toggleRow(id)}
                          className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600 hover:bg-purple-100 transition cursor-pointer"
                        >
                          <Layers className="h-3 w-3" />
                          {variants.length} Variants
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    LKR {Number(product.price || 0).toLocaleString("en-LK")}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {isService ? (
                      <span className="text-slate-400 italic">N/A</span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {(() => {
                      const status = product.status?.toLowerCase() || "active";
                      let badgeStyles =
                        "bg-slate-100 text-slate-700 ring-slate-200";
                      let label = status;

                      if (status === "active") {
                        badgeStyles = isAvailable
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
                          : "bg-amber-50 text-amber-700 ring-amber-200/80";
                        label = isAvailable ? "Active" : "Out of Stock";
                      } else if (status === "paused") {
                        badgeStyles =
                          "bg-amber-50 text-amber-700 ring-amber-200/80";
                        label = "Paused";
                      } else if (status === "draft") {
                        badgeStyles =
                          "bg-slate-100 text-slate-600 ring-slate-200";
                        label = "Draft";
                      }

                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 capitalize ${badgeStyles}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        to={`/seller/listings/${id}/edit`}
                        state={product}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-dcc-primary"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100/80"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Sub-Table for Variants Details */}
                {isExpanded && hasVariants && (
                  <tr className="bg-slate-50/60">
                    <td colSpan={8} className="px-8 py-3">
                      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-purple-600" />
                          Variant Breakdown
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500">
                                <th className="pb-2 font-semibold">SKU</th>
                                <th className="pb-2 font-semibold">
                                  Attributes
                                </th>
                                <th className="pb-2 font-semibold">Price</th>
                                <th className="pb-2 font-semibold">Stock</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {variants.map((v) => (
                                <tr key={v.id || v.sku}>
                                  <td className="py-2 font-mono text-slate-600">
                                    {v.sku || "N/A"}
                                  </td>
                                  <td className="py-2">
                                    <div className="flex flex-wrap gap-1">
                                      {v.attributes &&
                                      typeof v.attributes === "object" ? (
                                        Object.entries(v.attributes).map(
                                          ([key, val]) => (
                                            <span
                                              key={key}
                                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 border border-slate-200"
                                            >
                                              <strong className="capitalize">
                                                {key}:
                                              </strong>{" "}
                                              {String(val)}
                                            </span>
                                          ),
                                        )
                                      ) : (
                                        <span className="text-slate-400 italic">
                                          None
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2 font-semibold text-slate-800">
                                    LKR{" "}
                                    {Number(v.price || 0).toLocaleString(
                                      "en-LK",
                                    )}
                                  </td>
                                  <td className="py-2 text-slate-700">
                                    {v.stock}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
