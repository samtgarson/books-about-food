import {
  FunctionArgs,
  FunctionKey,
  FunctionReturn
} from 'src/pages/api/data/[fn]'

export const fetcherData = <K extends FunctionKey>(
  key: K,
  data: FunctionReturn<K>,
  args?: FunctionArgs<K>
) => ({
  key: { key, args },
  data
})
