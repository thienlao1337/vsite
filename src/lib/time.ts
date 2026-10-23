/** Interpret a calendar date at midnight in an IANA timezone, including DST. */
export function zonedMidnight(date: string, timeZone: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [year, month, day] = date.split('-').map(Number)
  const desired = Date.UTC(year, month - 1, day)
  if (new Date(desired).toISOString().slice(0, 10) !== date) return null
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    let result = desired
    for (let i = 0; i < 4; i++) {
      const parts = Object.fromEntries(fmt.formatToParts(result).map((p) => [p.type, p.value]))
      const represented = Date.UTC(
        +parts.year,
        +parts.month - 1,
        +parts.day,
        +parts.hour,
        +parts.minute,
        +parts.second,
      )
      const delta = desired - represented
      result += delta
      if (!delta) break
    }
    return result
  } catch {
    return null
  }
}
export function elapsed(startDate: string, timeZone: string, now = Date.now()) {
  const start = zonedMidnight(startDate, timeZone)
  if (start === null) return null
  const minutes = Math.floor(Math.max(0, now - start) / 60000)
  return {
    days: Math.floor(minutes / 1440),
    hours: Math.floor(minutes / 60) % 24,
    minutes: minutes % 60,
  }
}
