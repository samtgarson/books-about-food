import { Schema } from '.schema/types'
import {
  ActionBulk,
  ActionContext,
  CollectionCustomizer,
  TCollectionName
} from '@forestadmin/agent'

type ResourceActionProps<K extends TCollectionName<Schema>> = {
  collection: CollectionCustomizer<Schema, K>
  name: string
  successMessage?: string
  fn: (id: string | number, context: ActionContext<Schema, K>) => Promise<void>
} & Pick<ActionBulk<Schema, K>, 'submitButtonLabel' | 'form'>

export function resourceAction<K extends TCollectionName<Schema>>({
  collection,
  name,
  successMessage = 'Success',
  fn,
  ...opts
}: ResourceActionProps<K>) {
  async function execute(
    ids: Array<string | number>,
    context: ActionContext<Schema, K>,
    result: { error(message: string): void; success(message: string): void }
  ) {
    try {
      await Promise.all(ids.map((id) => fn(id, context)))

      return result.success(`🎉 ${successMessage}`)
    } catch (e) {
      console.log(e)
      return result.error((e as Error).message)
    }
  }

  collection.addAction(name, {
    ...opts,
    scope: 'Bulk',
    async execute(context, result) {
      const ids = await context.getRecordIds()
      return execute(ids, context, result)
    }
  })
}
