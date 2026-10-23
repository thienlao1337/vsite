export const MATCH_SIZE = 6
export const MATCH_TYPES = 6
export type Tile = { id: number; type: number }
export type MatchBoard = Tile[]
let serial = Date.now()
const tile = (type: number): Tile => ({ id: ++serial, type })
export function swapTiles(board: MatchBoard, a: number, b: number): MatchBoard {
  const next = [...board]
  ;[next[a], next[b]] = [next[b], next[a]]
  return next
}
export function adjacent(a: number, b: number) {
  return (
    Math.abs(Math.floor(a / MATCH_SIZE) - Math.floor(b / MATCH_SIZE)) +
      Math.abs((a % MATCH_SIZE) - (b % MATCH_SIZE)) ===
    1
  )
}
export function findMatches(board: MatchBoard): number[] {
  const found = new Set<number>()
  for (let y = 0; y < MATCH_SIZE; y++)
    for (let x = 0; x < MATCH_SIZE; x++) {
      const index = y * MATCH_SIZE + x
      if (
        x <= MATCH_SIZE - 3 &&
        board[index].type === board[index + 1].type &&
        board[index].type === board[index + 2].type
      ) {
        let n = x
        while (n < MATCH_SIZE && board[y * MATCH_SIZE + n].type === board[index].type)
          found.add(y * MATCH_SIZE + n++)
      }
      if (
        y <= MATCH_SIZE - 3 &&
        board[index].type === board[index + MATCH_SIZE].type &&
        board[index].type === board[index + MATCH_SIZE * 2].type
      ) {
        let n = y
        while (n < MATCH_SIZE && board[n * MATCH_SIZE + x].type === board[index].type)
          found.add(n++ * MATCH_SIZE + x)
      }
    }
  return [...found]
}
export function possibleMove(board: MatchBoard): [number, number] | null {
  for (let i = 0; i < board.length; i++) {
    for (const j of [i + 1, i + MATCH_SIZE]) {
      if (j < board.length && adjacent(i, j) && findMatches(swapTiles(board, i, j)).length)
        return [i, j]
    }
  }
  return null
}
export function createMatchBoard(random = Math.random): MatchBoard {
  for (let attempt = 0; attempt < 100; attempt++) {
    const board: MatchBoard = []
    for (let i = 0; i < MATCH_SIZE ** 2; i++) {
      const forbidden = new Set<number>()
      if (i % MATCH_SIZE >= 2 && board[i - 1].type === board[i - 2].type)
        forbidden.add(board[i - 1].type)
      if (i >= MATCH_SIZE * 2 && board[i - MATCH_SIZE].type === board[i - MATCH_SIZE * 2].type)
        forbidden.add(board[i - MATCH_SIZE].type)
      const options = Array.from({ length: MATCH_TYPES }, (_, type) => type).filter(
        (type) => !forbidden.has(type),
      )
      board.push(tile(options[Math.floor(random() * options.length)]))
    }
    if (possibleMove(board)) return board
  }
  // A known playable board also makes deterministic/random test sources safe.
  return Array.from({ length: 36 }, (_, i) =>
    tile(
      Math.floor(i / 6) === 0
        ? [0, 1, 0, 2, 3, 4][i]
        : Math.floor(i / 6) === 1
          ? [2, 0, 3, 4, 5, 1][i % 6]
          : ((i % 6) + Math.floor(i / 6)) % 6,
    ),
  )
}
export function refillBoard(
  board: MatchBoard,
  matched: number[],
  random = Math.random,
): MatchBoard {
  const remove = new Set(matched),
    next = [...board]
  for (let x = 0; x < MATCH_SIZE; x++) {
    const remaining = Array.from({ length: MATCH_SIZE }, (_, y) => y * MATCH_SIZE + x)
      .filter((i) => !remove.has(i))
      .map((i) => board[i])
    for (let y = MATCH_SIZE - 1; y >= 0; y--)
      next[y * MATCH_SIZE + x] = remaining.pop() || tile(Math.floor(random() * MATCH_TYPES))
  }
  return next
}

export type MergeBoard = (number | null)[]
export const MERGE_MAX = 6
export function createMergeBoard(): MergeBoard {
  return [0, 0, null, 1, 1, null, 0, null, null, 2, 2, null, 0, null, 1, null]
}
export function mergeItems(
  board: MergeBoard,
  source: number,
  target: number,
): { board: MergeBoard; merged: boolean; level: number } | null {
  if (source === target || board[source] === null) return null
  const next = [...board],
    value = board[source]!
  if (board[target] === null) {
    next[target] = value
    next[source] = null
    return { board: next, merged: false, level: value }
  }
  if (board[target] !== value) return null
  next[source] = null
  next[target] = Math.min(MERGE_MAX, value + 1)
  return { board: next, merged: true, level: next[target]! }
}
export function addMergeItem(board: MergeBoard, random = Math.random): MergeBoard | null {
  const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0)
  if (!empty.length) return null
  const next = [...board]
  next[empty[Math.floor(random() * empty.length)]] = random() < 0.8 ? 0 : 1
  return next
}
export const ARCADE_KEY = 'little-world-arcade-v1'
export type ArcadeSave = {
  match: MatchBoard
  matchScore: number
  merge: MergeBoard
  mergeScore: number
  bestMatch: number
  bestMerge: number
  trophies: number
}
export function newArcade(): ArcadeSave {
  return {
    match: createMatchBoard(),
    matchScore: 0,
    merge: createMergeBoard(),
    mergeScore: 0,
    bestMatch: 0,
    bestMerge: 0,
    trophies: 0,
  }
}
export function loadArcade(): ArcadeSave {
  const fallback = newArcade()
  try {
    const saved = JSON.parse(localStorage.getItem(ARCADE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return fallback
    const number = (value: unknown) =>
      Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0
    const validMatch =
      Array.isArray(saved.match) &&
      saved.match.length === 36 &&
      saved.match.every(
        (t: unknown) =>
          t &&
          typeof t === 'object' &&
          Number.isInteger((t as Tile).type) &&
          (t as Tile).type >= 0 &&
          (t as Tile).type < MATCH_TYPES,
      )
    // Regenerate IDs so restored boards can never collide with newly generated tiles.
    const match = validMatch ? saved.match.map((t: Tile) => tile(t.type)) : fallback.match
    const validMerge =
      Array.isArray(saved.merge) &&
      saved.merge.length === 16 &&
      saved.merge.every(
        (v: unknown) =>
          v === null || (Number.isInteger(v) && Number(v) >= 0 && Number(v) <= MERGE_MAX),
      )
    return {
      match: findMatches(match).length || !possibleMove(match) ? createMatchBoard() : match,
      matchScore: number(saved.matchScore),
      merge: validMerge ? saved.merge : fallback.merge,
      mergeScore: number(saved.mergeScore),
      bestMatch: number(saved.bestMatch),
      bestMerge: number(saved.bestMerge),
      trophies: number(saved.trophies),
    }
  } catch {
    return fallback
  }
}
