import { expect, test } from '@playwright/test'
import {
  adjacent,
  ARCADE_KEY,
  createMatchBoard,
  createMergeBoard,
  findMatches,
  mergeItems,
  addMergeItem,
  possibleMove,
  refillBoard,
  swapTiles,
} from '../src/lib/arcade'
import type { Tile } from '../src/lib/arcade'

async function openArcade(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'открыть подарочек', exact: true }).click()
  await page.getByRole('button', { name: 'в игровой уголок', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Уютный игровой уголок')
}

test('match-three hints produce a match, score persists, shuffle preserves score', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await openArcade(page)
  await page.getByRole('button', { name: 'подсказка', exact: true }).click()
  const hints = await page
    .locator('.match-tile.hinted')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-match-index')))
  expect(hints).toHaveLength(2)
  for (const i of hints) {
    const cell = page.locator(`[data-match-index="${i}"]`)
    if (isMobile) await cell.tap()
    else await cell.click()
  }
  await expect.poll(() => page.getByTestId('match-score').textContent()).not.toBe('0')
  await expect(page.locator('.match-board')).toHaveAttribute('aria-busy', 'false')
  const score = await page.getByTestId('match-score').textContent()
  await page.getByRole('button', { name: 'перемешать', exact: true }).click()
  await expect(page.getByTestId('match-score')).toHaveText(score!)
  const tiles = await page
    .locator('.match-tile')
    .evaluateAll((nodes) =>
      nodes.map((n, id) => ({ id, type: Number(n.getAttribute('data-tile-type')) })),
    )
  const invalid = tiles.flatMap((_, i) =>
    [i + 1, i + 6]
      .filter((j) => j < 36 && adjacent(i, j) && !findMatches(swapTiles(tiles, i, j)).length)
      .map((j) => [i, j]),
  )[0]
  for (const index of invalid) await page.locator(`[data-match-index="${index}"]`).click()
  await expect(page.locator('.match-board')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByTestId('match-score')).toHaveText(score!)
  await page.reload()
  await page.getByRole('button', { name: 'в игровой уголок', exact: true }).click()
  await expect(page.getByTestId('match-score')).toHaveText(score!)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('merge via taps, move to empty space, generate items and restore', async ({
  page,
  isMobile,
}) => {
  await openArcade(page)
  await page.getByRole('tab', { name: 'уютный merge' }).click()
  const act = async (index: number) => {
    const cell = page.locator(`[data-merge-index="${index}"]`)
    if (isMobile) await cell.tap()
    else await cell.click()
  }
  await act(0)
  await act(1)
  await expect(page.locator('[data-merge-index="0"]')).toHaveAttribute('data-merge-level', 'empty')
  await expect(page.locator('[data-merge-index="1"]')).toHaveAttribute('data-merge-level', '1')
  await act(1)
  await act(3)
  await expect(page.locator('[data-merge-index="3"]')).toHaveAttribute('data-merge-level', '2')
  await act(3)
  await act(9)
  await expect(page.locator('[data-merge-index="9"]')).toHaveAttribute('data-merge-level', '3')
  await act(9)
  await act(0)
  await expect(page.locator('[data-merge-index="0"]')).toHaveAttribute('data-merge-level', '3')
  const occupied = await page.locator('.merge-tile:not(.is-empty)').count()
  await page.getByRole('button', { name: 'достать находку' }).click()
  await expect(page.locator('.merge-tile:not(.is-empty)')).toHaveCount(occupied + 1)
  const score = await page.getByTestId('merge-score').textContent()
  expect(Number(score)).toBeGreaterThan(0)
  await page.reload()
  await page.getByRole('button', { name: 'в игровой уголок', exact: true }).click()
  await page.getByRole('tab', { name: 'уютный merge' }).click()
  await expect(page.getByTestId('merge-score')).toHaveText(score!)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('merging crowns unlocks her knight, drag works and saved malformed data recovers', async ({
  page,
}) => {
  await page.addInitScript(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          match: [],
          merge: [
            5,
            5,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          matchScore: -1,
          mergeScore: 0,
        }),
      ),
    ARCADE_KEY,
  )
  await openArcade(page)
  await page.getByRole('tab', { name: 'уютный merge' }).click()
  await page.locator('[data-merge-index="0"]').click()
  await page.locator('[data-merge-index="1"]').click()
  await expect(page.locator('[data-merge-index="1"]')).toHaveAttribute('data-merge-level', '6')
  await expect(page.getByRole('status').first()).toContainText('рыцарка готова')
  const start = await page.locator('[data-merge-index="1"]').boundingBox(),
    end = await page.locator('[data-merge-index="2"]').boundingBox()
  await page.mouse.move(start!.x + start!.width / 2, start!.y + start!.height / 2)
  await page.mouse.down()
  await page.mouse.move(end!.x + end!.width / 2, end!.y + end!.height / 2, { steps: 8 })
  await page.mouse.up()
  await expect(page.locator('[data-merge-index="2"]')).toHaveAttribute('data-merge-level', '6')
  await expect(page.locator('[data-merge-index="1"]')).toHaveAttribute('data-merge-level', 'empty')
})

test('game engines: playable boards, crossings, falling columns and merge rules', () => {
  for (let n = 0; n < 75; n++) {
    const b = createMatchBoard()
    expect(findMatches(b)).toEqual([])
    const m = possibleMove(b)!
    expect(m).not.toBeNull()
    expect(adjacent(...m)).toBe(true)
    expect(findMatches(swapTiles(b, ...m)).length).toBeGreaterThanOrEqual(3)
  }
  expect(findMatches(createMatchBoard(() => 0))).toEqual([])
  expect(adjacent(5, 6)).toBe(false)
  const crossing: Tile[] = Array.from({ length: 36 }, (_, id) => ({
    id,
    type: (id + Math.floor(id / 6)) % 6,
  }))
  for (const i of [7, 8, 9, 2, 14]) crossing[i].type = 5
  const matches = findMatches(crossing)
  for (const i of [7, 8, 9, 2, 14]) expect(matches).toContain(i)
  const original = createMatchBoard(),
    fallen = refillBoard(original, [0, 6, 12])
  expect(fallen).toHaveLength(36)
  expect(fallen[35]).toEqual(original[35])
  expect(new Set(fallen.map((t) => t.id)).size).toBe(36)
  const merge = createMergeBoard(),
    merged = mergeItems(merge, 0, 1)!
  expect(merged.board[0]).toBeNull()
  expect(merged.board[1]).toBe(1)
  expect(merge[0]).toBe(0)
  expect(mergeItems(merge, 0, 3)).toBeNull()
  expect(mergeItems(merge, 0, 0)).toBeNull()
  expect(mergeItems(merge, 0, 2)?.merged).toBe(false)
  expect(addMergeItem(Array(16).fill(0))).toBeNull()
  for (let level = 0; level <= 6; level++) {
    const b = Array(16).fill(null)
    b[0] = level
    b[1] = level
    expect(mergeItems(b, 0, 1)?.level).toBe(Math.min(6, level + 1))
  }
})
