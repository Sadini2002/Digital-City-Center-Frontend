import { Layers } from 'lucide-react'
import { isImageIcon, resolveAssetUrl } from '../../utils/mediaUrl'
import { ICON_COMPONENTS } from './categoryIcons'

/**
 * Renders a category icon. `icon` is either an icon name ("Shirt") or an
 * uploaded image path/URL. Falls back to a generic layers icon.
 */
export default function CategoryIcon({ icon, name = '', className = 'h-5 w-5', imageClassName }) {
  if (isImageIcon(icon)) {
    return (
      <img
        src={resolveAssetUrl(icon)}
        alt={name ? `${name} icon` : ''}
        className={imageClassName ?? `${className} rounded object-cover`}
        loading="lazy"
      />
    )
  }
  const Component = ICON_COMPONENTS[icon] ?? Layers
  return <Component className={className} aria-hidden="true" />
}