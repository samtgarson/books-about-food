import * as migration_20260209_105304 from './20260209_105304'

export const migrations = [
  {
    up: migration_20260209_105304.up,
    down: migration_20260209_105304.down,
    name: '20260209_105304'
  }
]
