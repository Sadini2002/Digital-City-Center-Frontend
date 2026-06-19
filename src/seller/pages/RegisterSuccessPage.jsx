import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Mail } from 'lucide-react'
import AuthPageLayout from '../../components/auth/AuthPageLayout'
import AuthFormCard from '../../components/auth/AuthFormCard'
import { getLastSellerApplication } from '../utils/sellerApplicationStorage'

export default function SellerRegisterSuccessPage() {
  const location = useLocation()
  const application = getLastSellerApplication()

  const applicationId = location.state?.applicationId ?? application?.id

  return (
    <AuthPageLayout variant="register">
      <div className="mx-auto w-full max-w-lg px-3 py-8 sm:px-6">
        <AuthFormCard title="Application submitted" subtitle="Thank you for applying to sell on DCC.">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {applicationId && (
                <>
                  Reference: <span className="font-semibold text-slate-900">{applicationId}</span>
                  <br />
                </>
              )}
              We will review your shop details and email you within 2–3 business days.
            </p>
          </div>

          {application && (
            <dl className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex justify-between py-1.5">
                <dt className="text-slate-500">Shop</dt>
                <dd className="font-medium text-slate-900">{application.shopName}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{application.email}</dd>
              </div>
            </dl>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <Mail className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              A confirmation was sent to{' '}
              <span className="font-semibold">{application?.email ?? 'your email'}</span> (simulated
              for demo).
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login?portal=seller"
              className="flex items-center justify-center rounded-xl bg-dcc-primary py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Sign in when approved
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to marketplace
            </Link>
          </div>
        </AuthFormCard>
      </div>
    </AuthPageLayout>
  )
}
