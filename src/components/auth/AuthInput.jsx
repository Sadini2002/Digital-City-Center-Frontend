export default function AuthInput({
  id,
  label,
  labelAction,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  rightElement,
  hint,
  required,
  autoComplete,
  variant = 'default',
}) {
  const inputSurface =
    variant === 'auth'
      ? 'border-violet-100/80 bg-violet-50/60 focus:border-dcc-primary/30 focus:bg-white'
      : 'border-slate-200 bg-slate-50 focus:border-dcc-primary focus:bg-white'
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {labelAction && <div className="shrink-0">{labelAction}</div>}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full min-w-0 rounded-lg border py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-dcc-primary/15 sm:py-2.5 sm:text-sm ${inputSurface} ${Icon ? 'pl-10' : 'px-3'} ${rightElement ? 'pr-10' : 'pr-3'}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
