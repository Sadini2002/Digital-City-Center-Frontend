import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import { isGoogleMapsConfigured, loadGoogleMaps } from '../../utils/loadGoogleMaps'
import { getDefaultCenter, mapsLink, routeToPath, toLatLng } from '../../utils/geo'

const MARKER_ICONS = {
  pickup: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  dropoff: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  driver: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
}

/**
 * Live map for delivery tracking.
 * BACKEND: API must return pickup, dropoff, driver location, and route[] with lat/lng.
 * Configure VITE_GOOGLE_MAPS_API_KEY for Google Maps; otherwise OpenStreetMap embed is used.
 */
function OsmFallbackMap({ pickup, dropoff, driverLocation, route, className, height }) {
  const driver = toLatLng(driverLocation)
  const pick = toLatLng(pickup)
  const drop = toLatLng(dropoff)
  const center = driver || drop || pick || getDefaultCenter()
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.05}%2C${center.lat - 0.04}%2C${center.lng + 0.05}%2C${center.lat + 0.04}&layer=mapnik&marker=${center.lat}%2C${center.lng}`

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs text-slate-500">
        Add <code className="rounded bg-slate-100 px-1">VITE_GOOGLE_MAPS_API_KEY</code> for Google Maps.
      </p>
      <div className={`overflow-hidden rounded-xl border border-slate-200 ${height}`}>
        <iframe title="Delivery map" className="h-full w-full" src={embedUrl} loading="lazy" />
      </div>
      <MapLinks pickup={pickup} dropoff={dropoff} driverLocation={driverLocation} route={route} />
    </div>
  )
}

function MapLinks({ pickup, dropoff, driverLocation, route }) {
  const pick = toLatLng(pickup)
  const drop = toLatLng(dropoff)
  const driver = toLatLng(driverLocation)
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {pick && (
        <a href={mapsLink(pickup)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline">
          <MapPin className="h-3.5 w-3.5" /> Pickup <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {drop && (
        <a href={mapsLink(dropoff)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline">
          <MapPin className="h-3.5 w-3.5" /> Drop-off <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {driver && (
        <a href={mapsLink(driverLocation)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-dcc-primary hover:underline">
          <MapPin className="h-3.5 w-3.5" /> Driver <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {route?.length > 0 && (
        <span className="text-slate-500">{route.length} GPS point{route.length !== 1 ? 's' : ''}</span>
      )}
    </div>
  )
}

function GoogleTrackingMap({ pickup, dropoff, driverLocation, route, className, height }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const polylineRef = useRef(null)
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    if (!isGoogleMapsConfigured()) return undefined

    let cancelled = false

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) return

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(containerRef.current, {
            center: getDefaultCenter(),
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          })
        }

        const map = mapRef.current
        markersRef.current.forEach((m) => m.setMap(null))
        markersRef.current = []

        const bounds = new google.maps.LatLngBounds()

        const addMarker = (pos, icon, title) => {
          if (!pos) return
          const marker = new google.maps.Marker({ position: pos, map, title, icon })
          markersRef.current.push(marker)
          bounds.extend(pos)
        }

        addMarker(toLatLng(pickup), MARKER_ICONS.pickup, 'Pickup')
        addMarker(toLatLng(dropoff), MARKER_ICONS.dropoff, 'Delivery')
        addMarker(toLatLng(driverLocation), MARKER_ICONS.driver, 'Driver')

        const path = routeToPath(route)
        if (polylineRef.current) polylineRef.current.setMap(null)
        if (path.length > 1) {
          polylineRef.current = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#5113D7',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map,
          })
          path.forEach((p) => bounds.extend(p))
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { top: 48, bottom: 48, left: 48, right: 48 })
        } else if (driverLocation) {
          map.setCenter(toLatLng(driverLocation))
          map.setZoom(14)
        }

        setMapError(null)
      })
      .catch(() => setMapError('Failed to load Google Maps.'))

    return () => {
      cancelled = true
    }
  }, [pickup, dropoff, driverLocation, route])

  if (mapError) {
    return (
      <OsmFallbackMap
        pickup={pickup}
        dropoff={dropoff}
        driverLocation={driverLocation}
        route={route}
        className={className}
        height={height}
      />
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div ref={containerRef} className={`w-full rounded-xl border border-slate-200 ${height}`} />
      <MapLinks pickup={pickup} dropoff={dropoff} driverLocation={driverLocation} route={route} />
    </div>
  )
}

export default function TrackingMap(props) {
  const { pickup, dropoff, driverLocation, route = [], className = '', height = 'h-80' } = props
  const hasCoords = toLatLng(pickup) || toLatLng(dropoff) || toLatLng(driverLocation)

  if (!hasCoords) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 ${height} ${className}`}
      >
        Map coordinates will appear when the driver starts GPS tracking.
      </div>
    )
  }

  if (isGoogleMapsConfigured()) {
    return <GoogleTrackingMap {...props} className={className} height={height} />
  }

  return <OsmFallbackMap {...props} className={className} height={height} />
}
