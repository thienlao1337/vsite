import { expect, test } from '@playwright/test'
import { zonedMidnight, elapsed } from '../src/lib/time'
import { giftConfig } from '../src/config'

const storageKey = 'little-world-v1'
test('complete all five adventures, preserve progress, open gift and hug', async ({
  page,
  isMobile,
}) => {
  test.setTimeout(90000)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Наш маленький')
  await page.getByRole('button', { name: 'открыть подарочек', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Этот мир')
  await page.getByRole('button', { name: 'конечно, Хитрик!' }).click()
  await page.getByRole('button', { name: 'Открыть книгу знакомства' }).click()
  for (let i = 0; i < 4; i++)
    await page.getByRole('button', { name: 'Следующая страница истории' }).click()
  await page.getByRole('button', { name: 'забрать звёздочку', exact: true }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await page.getByRole('button', { name: /02.*Немножко счастья/ }).click()
  await page.getByRole('button', { name: 'давай ловить' }).click()
  for (let i = 0; i < 10; i++) {
    const item = page.getByRole('button', { name: 'Поймать радость' }).first()
    if (isMobile) await item.tap({ force: true })
    else await item.click({ force: true })
  }
  await expect(page.getByText('Десять маленьких радостей!')).toBeVisible()
  await page.getByRole('button', { name: 'забрать звёздочку', exact: true }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await page.getByRole('button', { name: /03.*Волшебная почта/ }).click()
  await page.getByRole('button', { name: /01.*открой,.*когда грустно/ }).click()
  await expect(page.getByRole('dialog')).toContainText('эй, маленькое солнышко')
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click()
  await page.getByRole('button', { name: /02.*открой,.*хочется улыбнуться/ }).click()
  await expect(page.getByRole('dialog')).toContainText('официальное уведомление')
  await page.getByRole('button', { name: 'бережно сложить обратно' }).click()
  await page.getByRole('button', { name: 'на карту', exact: true }).click()
  await page.getByRole('button', { name: /04.*Маленькие моменты/ }).click()
  for (let i = 0; i < giftConfig.album.length - 1; i++)
    await page.getByRole('button', { name: 'Следующая страница альбома' }).click()
  await page.getByRole('button', { name: 'сохранить тепло и забрать звёздочку' }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await page.getByRole('button', { name: /05.*Особенная звезда/ }).click()
  await page.getByRole('button', { name: 'Прочитать звёздную записку 1', exact: true }).click()
  await expect(page.getByText('ты очень милая', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Особенная звезда', exact: true }).click()
  await page.getByRole('button', { name: 'забрать звёздочку', exact: true }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await page.reload()
  await expect(page.getByText('5 из 5 звёздочек найдено')).toBeVisible()
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storageKey)
  expect(stored.stars).toHaveLength(5)
  expect(stored.letters).toEqual([0, 1])
  await page.getByRole('button', { name: 'в секретный сад', exact: true }).click()
  const compliments = new Set<string>()
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'получить комплиментик' }).click()
    const ticket = page.locator('.compliment-ticket p')
    await expect(page.locator('.compliment-ticket')).toHaveAttribute('data-serial', String(i + 1))
    await expect(ticket).toBeVisible()
    compliments.add((await ticket.textContent())!)
  }
  expect(compliments.size).toBe(3)
  await page.getByRole('button', { name: 'открыть последний подарочек' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Для тебя, моя госпожа')
  await expect(page.getByText('знаешь, я даже не заметил', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'бережно сохранить в сердечке' }).click()
  await page.getByRole('button', { name: 'отправить обнимашку' }).click()
  await expect(page.getByText('обнимашка успешно доставлена! ♡')).toBeVisible()
  await page.getByRole('button', { name: 'ещё раз обнять котиков' }).click()
  await page.getByRole('button', { name: 'перечитать письмецо' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Для тебя')
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.evaluate(() => innerWidth),
  )
  expect(errors).toEqual([])
})

test('skip game, sound switches, reset confirmation and blocked garden', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Секретный сад: нужны все звёздочки' }).click()
  await expect(page.getByRole('status')).toContainText('Секретный сад откроется')
  await page.getByRole('button', { name: 'Настройки музыки и звуков' }).click()
  await page.getByRole('switch', { name: 'Музыка', exact: true }).check()
  await expect(page.getByRole('switch', { name: 'Музыка', exact: true })).toBeChecked()
  await page.getByRole('switch', { name: 'Звуковые эффекты' }).check()
  await page.getByRole('switch', { name: 'Музыка', exact: true }).uncheck()
  await page.getByRole('switch', { name: 'Звуковые эффекты' }).uncheck()
  await page.getByRole('button', { name: 'Настройки музыки и звуков' }).click()
  await page.getByRole('button', { name: /02.*Немножко счастья/ }).click()
  await page.getByRole('button', { name: 'пропустить игру и получить звёздочку' }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await expect(page.getByText('1 из 5 звёздочек найдено')).toBeVisible()
  await page.getByRole('button', { name: 'посмотреть всё сначала' }).click()
  await page.getByRole('button', { name: 'оставить мои звёздочки' }).click()
  await expect(page.getByText('1 из 5 звёздочек найдено')).toBeVisible()
  await page.getByRole('button', { name: 'посмотреть всё сначала' }).click()
  await page.getByRole('button', { name: 'да, начнём сначала' }).click()
  await expect(page.getByRole('button', { name: 'открыть подарочек', exact: true })).toBeVisible()
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storageKey)
  expect(stored.stars).toEqual([])
})

test('small screens, reduced motion and corrupt storage remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript((key) => localStorage.setItem(key, '{not-json'), storageKey)
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'открыть подарочек', exact: true })).toBeVisible()
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.setViewportSize({ width: 320, height: 740 })
  await page.getByRole('button', { name: /04.*Маленькие моменты/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('То, что хочется сохранить')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('storage denial does not prevent collecting a star', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage unavailable')
    }
  })
  await page.goto('/')
  await page.getByRole('button', { name: /02.*Немножко счастья/ }).click()
  await page.getByRole('button', { name: 'пропустить игру и получить звёздочку' }).click()
  await page.getByRole('button', { name: 'продолжить приключение' }).click()
  await expect(page.getByText('1 из 5 звёздочек найдено')).toBeVisible()
  await expect(
    page.getByText('Браузер не разрешил сохранить прогресс.', { exact: false }),
  ).toBeVisible()
})

test('timezone midnight, leap dates, DST and unset dates', () => {
  expect(new Date(zonedMidnight('2026-10-23', 'Europe/Budapest')!).toISOString()).toBe(
    '2026-10-22T22:00:00.000Z',
  )
  expect(new Date(zonedMidnight('2026-03-30', 'Europe/Budapest')!).toISOString()).toBe(
    '2026-03-29T22:00:00.000Z',
  )
  expect(zonedMidnight('2026-02-30', 'Europe/Budapest')).toBeNull()
  expect(zonedMidnight('', 'Europe/Budapest')).toBeNull()
  expect(zonedMidnight('2024-02-29', 'bad-zone')).toBeNull()
  expect(elapsed('2026-10-23', 'Europe/Budapest', Date.parse('2026-10-24T00:05:00Z'))).toEqual({
    days: 1,
    hours: 2,
    minutes: 5,
  })
})

test('compliments exhaust a whole set before repeating and Khitrik has a surprise', async ({
  page,
}) => {
  test.setTimeout(90000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          started: true,
          stars: ['story', 'game', 'mail', 'album', 'sky'],
          letters: [],
          finished: false,
        }),
      ),
    storageKey,
  )
  await page.goto('/')
  await page.getByRole('button', { name: 'в секретный сад', exact: true }).click()
  const phrases = new Set<string>()
  for (let i = 0; i < giftConfig.compliments.length; i++) {
    await page.getByRole('button', { name: 'получить комплиментик' }).click()
    const text = page.locator('.compliment-ticket p')
    await expect(page.locator('.compliment-ticket')).toHaveAttribute('data-serial', String(i + 1))
    await expect(text).toBeVisible()
    phrases.add((await text.textContent())!)
  }
  expect(phrases.size).toBe(giftConfig.compliments.length)
  await page
    .locator('.club-cat')
    .getByRole('button', { name: 'няшить Хитрика' })
    .click({ clickCount: 5, delay: 100 })
  await expect(page.getByRole('status').last()).toContainText('клубничный кот')
  await expect(page.locator('.club-cat .character svg .khitrik-outfit')).toHaveCount(0)
})
