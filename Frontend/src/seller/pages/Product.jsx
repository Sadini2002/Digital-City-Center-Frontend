import { Link } from 'react-router-dom'
import SellerPagePlaceholder from '../components/SellerPagePlaceholder'

export default function Product() {
  return (
    <div className="space-y-4">
      <SellerPagePlaceholder
        title="Listings"
        description="Product list, filters, and listing actions will be built here."
      />
      <p className="text-center text-sm text-slate-500">
        <Link to="/seller/listings/new" className="font-semibold text-dcc-primary hover:underline">
          Add listing
        </Link>
        {' '}
        (teammate flow)
      </p>
    </div>
  )
}
