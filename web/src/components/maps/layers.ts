import type { LayerProps } from 'react-map-gl/mapbox'

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'locations',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'sum'],
      '#51bbd6',
      10,
      '#f1f075',
      50,
      '#f28cb1'
    ],
    'circle-radius': ['step', ['get', 'sum'], 20, 10, 25, 50, 35]
  }
}

export const countLayer: LayerProps = {
  id: 'count',
  type: 'symbol',
  source: 'locations',
  layout: {
    'text-field': [
      'case',
      ['has', 'point_count'],
      ['get', 'sum'],
      ['get', 'profileCount']
    ],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
}

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'locations',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': ['step', ['get', 'profileCount'], 10, 5, 12, 20, 16],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
}
