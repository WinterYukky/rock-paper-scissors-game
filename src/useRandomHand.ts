import { ref } from '@vue/runtime-core'
import { Hand } from './useHandClassification'

export const useRandomHand = (interval = 5000) => {
  const currentHand = ref<Hand>('グー')
  const hands = ['グー', 'チョキ', 'パー'] as const
  setInterval(() => {
    const nextOptions = hands.filter((hand) => hand !== currentHand.value)
    const nextIndex = Math.floor(Math.random() * nextOptions.length)
    currentHand.value = nextOptions[nextIndex]
  }, interval)
  return {
    currentHand,
  }
}
