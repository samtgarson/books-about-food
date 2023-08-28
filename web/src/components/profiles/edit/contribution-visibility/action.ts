'use server'

import {
  FetchContributionsInput,
  fetchContributions
} from 'src/services/profiles/fetch-contributions'
import { ToggleContributionVisibilityInput } from 'src/services/profiles/toggle-contribution-visilibity'
import { callWithUser } from 'src/utils/call-with-user'

export const fetch = async (input: FetchContributionsInput) => {
  return callWithUser(fetchContributions, input)
}

export const action = async (input: ToggleContributionVisibilityInput) => {
  return callWithUser(fetchContributions, input)
}
