import { bubbleSortTrace } from '../algorithms/bubbleSort'
import { selectionSortTrace } from '../algorithms/selectionSort'
import { insertionSortTrace } from '../algorithms/insertionSort'
import { mergeSortTrace } from '../algorithms/mergeSort'
import { quickSortTrace } from '../algorithms/quickSort'

function bubbleBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  return 'bg-slate-300'
}
function selectionBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (index === step.minIndex) return 'bg-purple-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  return 'bg-slate-300'
}
function insertionBarColor(step, index) {
  if (index === step.keyIndex) return 'bg-purple-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  return 'bg-slate-300'
}
function mergeBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (index === step.placed) return 'bg-teal-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.range && index >= step.range[0] && index <= step.range[1]) return 'bg-sky-200'
  return 'bg-slate-300'
}
function quickBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (index === step.pivotIndex) return 'bg-pink-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.range && index >= step.range[0] && index <= step.range[1]) return 'bg-sky-200'
  return 'bg-slate-300'
}

export const sortingAlgorithms = {
  'bubble-sort': { name: 'Bubble Sort', traceFn: bubbleSortTrace, getBarColor: bubbleBarColor },
  'selection-sort': { name: 'Selection Sort', traceFn: selectionSortTrace, getBarColor: selectionBarColor },
  'insertion-sort': { name: 'Insertion Sort', traceFn: insertionSortTrace, getBarColor: insertionBarColor },
  'merge-sort': { name: 'Merge Sort', traceFn: mergeSortTrace, getBarColor: mergeBarColor },
  'quick-sort': { name: 'Quick Sort', traceFn: quickSortTrace, getBarColor: quickBarColor },
}