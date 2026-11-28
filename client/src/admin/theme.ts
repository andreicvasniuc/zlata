import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

// Aura with the blue accent of the old admin (SB Admin 2) instead of Aura's green.
export const AdminPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
})
