import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MapPin, DollarSign, ShieldCheck, Save, Plus, Trash2, Map } from 'lucide-react'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryAlert from '../components/ui/DeliveryAlert'
import { readDeliveryUser } from '../utils/readDeliveryUser'
import { deliveryApi } from '../services/deliveryApi'

const DEFAULT_AREAS = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Negombo']

export default function DeliverySettingsPage() {
  const user = readDeliveryUser()
  const [coverageAreas, setCoverageAreas] = useState([])
  const [newArea, setNewArea] = useState('')
  const [pricingModel, setPricingModel] = useState('distance') // 'distance' or 'flat'
  const [baseFee, setBaseFee] = useState(250)
  const [perKmFee, setPerKmFee] = useState(50)
  const [freeThreshold, setFreeThreshold] = useState(10000)
  const [flatFee, setFlatFee] = useState(450)
  const [isApproved, setIsApproved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const parsed = await deliveryApi.getSettings()
        if (cancelled) return
        setCoverageAreas(parsed.coverageAreas || DEFAULT_AREAS)
        setPricingModel(parsed.pricingModel || 'distance')
        setBaseFee(parsed.baseFee ?? 250)
        setPerKmFee(parsed.perKmFee ?? 50)
        setFreeThreshold(parsed.freeThreshold ?? 10000)
        setFlatFee(parsed.flatFee ?? 450)
        setIsApproved(parsed.status === 'ACTIVE' || parsed.status === 'APPROVED')
      } catch {
        if (!cancelled) setCoverageAreas(DEFAULT_AREAS)
        if (!cancelled && user?.deliveryProvider) {
          setIsApproved(user.deliveryProvider.status === 'ACTIVE' || user.deliveryProvider.status === 'APPROVED')
        } else if (!cancelled) {
          setIsApproved(true)
        }
      }
    }
    loadSettings()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleAddArea = (e) => {
    e.preventDefault()
    const trimmed = newArea.trim()
    if (!trimmed) return
    if (coverageAreas.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Area is already in your coverage list.')
      return
    }
    setCoverageAreas([...coverageAreas, trimmed])
    setNewArea('')
    toast.success(`${trimmed} added to coverage areas.`)
  }

  const handleRemoveArea = (areaName) => {
    setCoverageAreas(coverageAreas.filter(a => a !== areaName))
    toast.success(`${areaName} removed from coverage areas.`)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const settings = {
        coverageAreas,
        pricingModel,
        baseFee: Number(baseFee),
        perKmFee: Number(perKmFee),
        freeThreshold: Number(freeThreshold),
        flatFee: Number(flatFee),
      }
      const saved = await deliveryApi.updateSettings(settings)
      if (saved?.coverageAreas) setCoverageAreas(saved.coverageAreas)
      if (saved?.pricingModel) setPricingModel(saved.pricingModel)
      if (saved?.baseFee != null) setBaseFee(saved.baseFee)
      if (saved?.perKmFee != null) setPerKmFee(saved.perKmFee)
      if (saved?.freeThreshold != null) setFreeThreshold(saved.freeThreshold)
      if (saved?.flatFee != null) setFlatFee(saved.flatFee)
      if (saved?.status) setIsApproved(saved.status === 'ACTIVE' || saved.status === 'APPROVED')
      toast.success('Delivery settings saved successfully!')
    } catch (err) {
      toast.error(err.message || 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Approval Status Banner */}
      {isApproved ? (
        <DeliveryAlert variant="success" className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-800">Account Activated:</span> Your delivery company is approved. You can accept active job dispatches and customize rates below.
          </div>
        </DeliveryAlert>
      ) : (
        <DeliveryAlert variant="warning" className="flex items-start gap-2.5">
          <div>
            <span className="font-bold text-amber-800">Pending Admin Approval:</span> Your registration has been received. You can configure your profile settings, but the platform admin must approve your provider account before you can receive job assignments or go active.
          </div>
        </DeliveryAlert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Coverage Areas Panel */}
        <DeliveryPanel 
          title="Coverage Areas" 
          subtitle="Add the cities and districts where your riders can pick up or drop off orders."
        >
          <form onSubmit={handleAddArea} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Kalutara, Negombo..."
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Coverage List</h3>
            {coverageAreas.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-2">No coverage areas defined. You will not receive any jobs.</p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                {coverageAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between px-4 py-3 bg-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-dcc-primary" />
                      <span className="text-sm font-semibold text-slate-800">{area}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(area)}
                      className="rounded-lg p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      aria-label={`Remove ${area}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DeliveryPanel>

        {/* Delivery Pricing Rates Panel */}
        <DeliveryPanel 
          title="Delivery Pricing Model" 
          subtitle="Configure how delivery fees are calculated for buyer checkouts."
        >
          {/* Segmented Control */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setPricingModel('distance')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                pricingModel === 'distance'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Distance Based (Base + Per-Km)
            </button>
            <button
              type="button"
              onClick={() => setPricingModel('flat')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                pricingModel === 'flat'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flat Fee
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {pricingModel === 'distance' ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Base Fee (LKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        value={baseFee}
                        onChange={(e) => setBaseFee(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Rate Per Km (LKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        value={perKmFee}
                        onChange={(e) => setPerKmFee(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Calculated as: <strong>Base Fee + (Distance * Rate Per Km)</strong>.
                </p>
              </>
            ) : (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Flat Rate Fee (LKR)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={flatFee}
                    onChange={(e) => setFlatFee(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  All dispatches within coverage areas will be billed at a uniform flat rate.
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Free Delivery Subtotal Threshold (LKR)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Orders with a basket size above this value will qualify for free delivery (we absorb or bill merchant).
              </p>
            </div>
          </div>
        </DeliveryPanel>
      </div>

      {/* Save Settings Bar */}
      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-dcc-primary-hover transition disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving changes...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
