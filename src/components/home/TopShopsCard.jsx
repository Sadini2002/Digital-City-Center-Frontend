import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import axios from 'axios'
import CdnImage from '../common/CdnImage'
import { slugifyShopName } from '../../data/shopsData'

export default function TopShopsCard() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/home/featured')
      .then(res => {
        if (res.data && res.data.featured) {
          setShops(res.data.featured) 
        } 
        setLoading(false)
      })  
      .catch(err => {
        console.error("Error fetching featured shops:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" strokeWidth={0} />
          </span>
          <h3 className="text-base font-bold text-slate-900">Top Rated Shops</h3>
        </div>
        <Link
          to="/shops"
          className="shrink-0 text-sm font-semibold text-dcc-primary hover:underline"
        >
          View All Shops
          <span className="ml-0.5 inline-block">&gt;</span>
        </Link>
      </div>


<div className="mt-4 flex flex-col gap-3">
  {loading ? (
    <p className="text-slate-500 text-sm py-4">Loading shops...</p>
  ) : (
    shops.map((shop, index) => {
      const shopName = typeof shop === 'string' ? shop : shop.shopName;
      
      const banner = shop && shop.bannerImage ? shop.bannerImage : null; 
      
      const shopRating = shop && shop.rating ? shop.rating.toFixed(1) : '5.0';
      
      const productCount = shop && shop._count ? shop._count.listings : 0;

      return (
        <Link
          key={index}
          to={`/shop/${slugifyShopName(shopName)}`}
          className="group block overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md"
        >
          <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-32">
            {banner ? (
              <img
                src={banner}
                alt={shopName}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : ( 
              <div className={`h-full w-full bg-gradient-to-br ${index % 2 === 0 ? 'from-purple-500 to-indigo-600' : 'from-emerald-400 to-teal-600'}`} />
            )}
          </div>
          
          <div className="border-t border-slate-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
            <p className="text-sm font-bold text-slate-900">{shopName}</p>
            
            {/* ⭐️ Dynamic Rating */}
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
              <span className="text-sm font-semibold text-slate-800">{shopRating}</span>
            </div>
            
            {/* 📦 Dynamic Product Count */}
            <p className="mt-0.5 text-xs text-slate-500">{productCount}+ products</p>
          </div>
        </Link>
      )
    })
  )}
</div>
    </div>
  )
}