'use client'

import type { Point } from 'geojson'
import type { GeoJSONSource, MapMouseEvent } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRef, useState } from 'react'
import Map, { Layer, MapRef, Source } from 'react-map-gl/mapbox'
import { usePromise } from 'src/hooks/use-promise'
import { fetchGeoJSON } from './action'
import { clusterLayer, countLayer, unclusteredPointLayer } from './layers'
import {
  MapProfilesDrawer,
  MapProfilesDrawerControl
} from './map-profiles-drawer'

export type ProfilesMapProps = {
  className?: string
}

export function ProfilesMap({ className }: ProfilesMapProps) {
  const { value: geojson } = usePromise(fetchGeoJSON, undefined)
  const mapRef = useRef<MapRef>(null)
  const sheetRef = useRef<MapProfilesDrawerControl>(null)
  const [cursor, setCursor] = useState<'grab' | 'pointer'>('grab')

  function handleClick(event: MapMouseEvent) {
    const feature = event.features?.[0]
    if (!feature || !mapRef.current) return

    const clusterId = feature.properties?.cluster_id

    if (typeof clusterId === 'number') {
      const mapboxSource = mapRef.current.getSource(
        'locations'
      ) as GeoJSONSource

      // eslint-disable-next-line promise/prefer-await-to-callbacks
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !mapRef.current || zoom === undefined || zoom === null)
          return

        const coordinates = (feature.geometry as Point).coordinates

        mapRef.current.easeTo({
          center: [coordinates[0], coordinates[1]],
          zoom,
          duration: 500
        })
      })
    } else {
      const location = feature.properties?.id
      const displayText = feature.properties?.displayText
      if (typeof location === 'string' && typeof displayText === 'string') {
        sheetRef.current?.open(location, displayText)
      }
    }
  }

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          latitude: 20,
          longitude: 0,
          zoom: 1.5
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={[
          clusterLayer.id as string,
          unclusteredPointLayer.id as string
        ]}
        cursor={cursor}
        onMouseEnter={() => setCursor('pointer')}
        onMouseLeave={() => setCursor('grab')}
        onClick={handleClick}
      >
        <Source
          id="locations"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterProperties={{
            sum: ['+', ['get', 'profileCount']]
          }}
        >
          <Layer {...clusterLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...countLayer} />
        </Source>
      </Map>
      <MapProfilesDrawer ref={sheetRef} />
    </div>
  )
}
