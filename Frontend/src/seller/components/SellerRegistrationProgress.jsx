import { Shield } from 'lucide-react'
import { SELLER_REGISTER_STEPS } from '../data/sellerConstants'

export default function SellerRegistrationProgress({ currentStep }) {
  return (
    <aside className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Registration Progress</h2>
        <ol className="mt-6 space-y-5">
          {SELLER_REGISTER_STEPS.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = index < currentStep
            return (
              <li key={step.id} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isActive
                      ? 'bg-dcc-primary text-white shadow-md shadow-violet-200'
                      : isComplete
                        ? 'bg-violet-100 text-dcc-primary'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isActive ? 'text-slate-900' : isComplete ? 'text-dcc-primary' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 shrink-0 text-dcc-primary" />
          <div>
            <p className="text-sm font-bold text-slate-900">DCC Guarantee</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Your data is secured with enterprise-grade encryption. Approval typically takes 24–48
              business hours.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
