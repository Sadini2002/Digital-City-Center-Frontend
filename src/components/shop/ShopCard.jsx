import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Star,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";

import CdnImage from "../common/CdnImage";

export default function ShopCard({ shop }) {
  const rating = Math.round(shop.rating || 5);

  return (
    <Link
      to={`/shop/${shop.shopUrl}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Banner */}
      <div className="relative h-32 overflow-hidden bg-slate-100">
        {shop.image ? (
          <CdnImage
            src={shop.image}
            alt={shop.shopName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-dcc-primary to-violet-600" />
        )}

        <div className="absolute inset-0 bg-slate-950/10" />
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7">
        {/* Avatar */}
        <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-dcc-primary to-violet-600 text-lg font-bold text-white shadow-md">
          {shop.shopName?.charAt(0)}
        </div>

        {/* Shop Name */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 group-hover:text-dcc-primary transition-colors">
            {shop.shopName}
          </span>

          {shop.user?.verified && (
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-dcc-primary fill-violet-100"
            />
          )}
        </div>

        {/* Business */}
        <div className="mt-2">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                {shop.businessType}
            </span>
            </div>
        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2 text-xs text-slate-500">

          <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5" />
            <span>{shop.productCount || 0} Products</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{shop.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>
             Member since{" "}
            {shop.memberSince
            ? new Date(shop.memberSince).getFullYear()
            : new Date(shop.createdAt).getFullYear()}
            </span>
          </div>
        </div>

        {/* Button */}
        <div className="mt-5">
            <div className="rounded-xl border border-dcc-primary py-2 text-center text-sm font-semibold text-dcc-primary transition-all duration-300 group-hover:bg-dcc-primary group-hover:text-white">
                Visit Shop
            </div>
        </div>
      </div>
    </Link>
  );
}