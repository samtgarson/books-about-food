import { Schema } from '.schema/types'
import { CollectionCustomizer, TCollectionName } from '@forestadmin/agent'

type ResourceActionProps<K extends TCollectionName<Schema>> = {
  collection: CollectionCustomizer<Schema, K>
  name: string
  successMessage?: string
  fn: (id: string | number) => Promise<void>
  multi?: boolean
}

export function resourceAction<K extends TCollectionName<Schema>>({
  collection,
  name,
  successMessage = 'Success',
  multi = false,
  fn
}: ResourceActionProps<K>) {
  async function execute(
    ids: Array<string | number>,
    result: { error(message: string): void; success(message: string): void }
  ) {
    try {
      await Promise.all(ids.map(fn))

      return result.success(`🎉 ${successMessage}`)
    } catch (e) {
      console.log(e)
      return result.error(`Error with action ${name}: ${(e as Error).message}`)
    }
  }

  if (multi) {
    collection.addAction(name, {
      scope: 'Bulk',
      execute: async (context, result) => {
        const ids = await context.getRecordIds()
        return execute(ids, result)
      }
    })
  } else {
    collection.addAction(name, {
      scope: 'Single',
      execute: async (context, result) => {
        const id = await context.getRecordId()
        return execute([id], result)
      }
    })
  }
}
