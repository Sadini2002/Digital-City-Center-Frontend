import { Link } from "react-router-dom";

export default function SellerSidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold p-5">
        Seller Panel
      </h1>

      <nav className="flex flex-col gap-3 p-5">
        <Link to="/seller/dashboard">Dashboard</Link>
        <Link to="/seller/listings">Listings</Link>
        <Link to="/seller/orders">Orders</Link>
        <Link to="/seller/earnings">Earnings</Link>
        <Link to="/seller/notifications">Notifications</Link>
        <Link to="/seller/settings">Shop Settings</Link>
      </nav>
    </div>
  );
}