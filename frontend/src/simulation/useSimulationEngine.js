import { useState, useEffect, useMemo, useCallback } from 'react'

/**
 * Generic simulation engine used by every DBMS / CN / OS visualizer.
 *
 * Each topic supplies a `steps` array of the shape:
 * {
 *   title: string,
 *   explanation: string,
 *   state: any,        // whatever the topic's renderer needs to draw this frame
 *   metrics?: object,   // optional running numbers (e.g. waiting time so far)
 * }
 *
 * This hook owns currentStep / isPlaying / speed and exposes the same
 * play / pause / next / previous / restart controls for every topic, so the
 * whole platform behaves identically no matter which simulation is on screen.
 */
const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 4]
const BASE_DELAY_MS = 1400

export function useSimulationEngine(steps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const totalSteps = steps.length
  const isLastStep = currentIndex >= totalSteps - 1
  const isFirstStep = currentIndex <= 0

  // If the underlying steps array changes (e.g. user reconfigures inputs),
  // snap back to the start rather than pointing at an out-of-range index.
  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
  }, [steps])

  useEffect(() => {
    if (!isPlaying) return undefined
    if (isLastStep) {
      setIsPlaying(false)
      return undefined
    }
    const delay = BASE_DELAY_MS / speed
    const timer = setTimeout(() => {
      setCurrentIndex((i) => Math.min(i + 1, totalSteps - 1))
    }, delay)
    return () => clearTimeout(timer)
  }, [isPlaying, isLastStep, speed, totalSteps, currentIndex])

  const play = useCallback(() => {
    if (isLastStep) {
      // Restart from the top if Play is hit after reaching the end.
      setCurrentIndex(0)
    }
    setIsPlaying(true)
  }, [isLastStep])

  const pause = useCallback(() => setIsPlaying(false), [])

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && isLastStep) setCurrentIndex(0)
      return !p
    })
  }, [isLastStep])

  const next = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((i) => Math.min(i + 1, totalSteps - 1))
  }, [totalSteps])

  const previous = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const restart = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [])

  const goToStep = useCallback((index) => {
    setIsPlaying(false)
    setCurrentIndex(Math.max(0, Math.min(index, totalSteps - 1)))
  }, [totalSteps])

  const currentStep = steps[currentIndex] ?? steps[0]
  const progress = totalSteps > 1 ? currentIndex / (totalSteps - 1) : 1

  return useMemo(() => ({
    currentIndex,
    currentStep,
    totalSteps,
    isPlaying,
    isFirstStep,
    isLastStep,
    speed,
    speedOptions: SPEED_OPTIONS,
    progress,
    setSpeed,
    play,
    pause,
    togglePlay,
    next,
    previous,
    restart,
    goToStep,
  }), [currentIndex, currentStep, totalSteps, isPlaying, isFirstStep, isLastStep, speed, progress, play, pause, togglePlay, next, previous, restart, goToStep])
}
