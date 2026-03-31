import * as migration_20260328_120804 from './20260328_120804';

export const migrations = [
  {
    up: migration_20260328_120804.up,
    down: migration_20260328_120804.down,
    name: '20260328_120804'
  },
];
