'use server'

import {
  ToggleContributionVisibilityInput,
  toggleContributionVisibility
} from 'src/core/services/profiles/toggle-contribution-visilibity'
import { call } from 'src/utils/service'

export const action = async (input: ToggleContributionVisibilityInput) => {
  return call(toggleContributionVisibility, input)
}
