import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'

// Corrigir o ícone padrão do Leaflet
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface MapSelectorProps {
  onSelectLocation: (lat: number, lng: number) => void
}

export function MapSelector({ onSelectLocation }: MapSelectorProps) {
  const [position, setPosition] = useState<[number, number] | null>(null)

  function LocationMarker() {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        onSelectLocation(lat, lng)
      },
    })

    return position ? <Marker position={position} /> : null
  }

  return (
    <div style={{ height: '300px', borderRadius: 8, overflow: 'hidden' }}>
      <MapContainer
        center={[-20.7546, -42.8825]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  )
}
