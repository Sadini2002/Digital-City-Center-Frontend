/** Renders an image only when a CDN URL is available. */
export default function CdnImage({ src, alt = '', className }) {
  if (!src) return null
  return <img src={src} alt={alt} className={className} />
}
