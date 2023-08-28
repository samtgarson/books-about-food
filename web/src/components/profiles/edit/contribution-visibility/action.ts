'use server'

import {
  ToggleContributionVisibilityInput,
  toggleContributionVisibility
} from 'src/services/profiles/toggle-contribution-visilibity'
import { callWithUser } from 'src/utils/call-with-user'

export const action = async (input: ToggleContributionVisibilityInput) => {
  return callWithUser(toggleContributionVisibility, input)
}
