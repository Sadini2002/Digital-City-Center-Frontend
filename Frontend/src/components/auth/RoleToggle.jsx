export default function RoleToggle({ value, onChange }) {
  const options = [
    { id: 'buyer', label: 'Buyer' },
    { id: 'seller', label: 'Seller' },
    { id: 'delivery', label: 'Delivery' },
  ]

  return (
    <div className="flex rounded-full bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            value === option.id
              ? 'bg-dcc-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
