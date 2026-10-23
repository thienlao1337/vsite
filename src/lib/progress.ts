import type { Adventure } from '../config'
export type Progress = {
  started: boolean
  stars: Adventure[]
  letters: number[]
  finished: boolean
  celebrated: boolean
}
export const STORAGE_KEY = 'little-world-v1'
export const emptyProgress: Progress = {
  started: false,
  stars: [],
  letters: [],
  finished: false,
  celebrated: false,
}
export function loadProgress(): Progress {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!raw || typeof raw !== 'object') return { ...emptyProgress }
    return {
      started: raw.started === true,
      stars: Array.isArray(raw.stars)
        ? [
            ...new Set<Adventure>(
              raw.stars.filter((s: unknown) =>
                ['story', 'game', 'mail', 'album', 'sky'].includes(String(s)),
              ),
            ),
          ]
        : [],
      letters: Array.isArray(raw.letters)
        ? [
            ...new Set<number>(
              raw.letters.filter(
                (s: unknown) => Number.isInteger(s) && Number(s) >= 0 && Number(s) < 5,
              ),
            ),
          ]
        : [],
      finished: raw.finished === true,
      celebrated: raw.celebrated === true,
    }
  } catch {
    return { ...emptyProgress }
  }
}
export function persistProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}
