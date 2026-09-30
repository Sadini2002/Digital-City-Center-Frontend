import { getActionClasses } from '../../utils/Sellerstatus'

export default function SellerActionButton({
  action,
  onClick,
  disabled = false,
  compact = false,
  iconOnly = false,
}) {
  const Icon = action.icon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={action.label}
      aria-label={action.label}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
      } ${getActionClasses(action.variant)}`}
    >
      <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      {!iconOnly && action.label}
    </button>
  )
}