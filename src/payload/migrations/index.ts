import * as migration_20260328_120804 from './20260328_120804'
import * as migration_20261022_131307_add_import_export from './20261022_131307_add_import_export'
import * as migration_20261103_135931_add_magazines from './20261103_135931_add_magazines'

export const migrations = [
  {
    up: migration_20260328_120804.up,
    down: migration_20260328_120804.down,
    name: '20260328_120804'
  },
  {
    up: migration_20261022_131307_add_import_export.up,
    down: migration_20261022_131307_add_import_export.down,
    name: '20261022_131307_add_import_export'
  },
  {
    up: migration_20261103_135931_add_magazines.up,
    down: migration_20261103_135931_add_magazines.down,
    name: '20261103_135931_add_magazines'
  }
]
