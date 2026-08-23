export default function TopBar() {
  return (
    <div className="bg-[#0f1730] py-2 text-[11px] text-white">
      <div className="container-dcc flex items-center justify-between">
        <p>Welcome to Digital City Center - Your All-in-One Marketplace in Sri Lanka!</p>
        <div className="hidden items-center gap-4 text-slate-200 sm:flex">
          <span>Track Order</span>
          <span>Help Center</span>
          <span>English</span>
        </div>
      </div>
    </div>
  )
}
