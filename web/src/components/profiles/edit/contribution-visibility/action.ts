'use server'

import {
  ToggleContributionVisibilityInput,
  toggleContributionVisibility
} from 'src/services/profiles/toggle-contribution-visilibity'

export const action = async (input: ToggleContributionVisibilityInput) => {
  return toggleContributionVisibility.call(input)
}
