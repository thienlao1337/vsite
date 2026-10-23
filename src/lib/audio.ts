import { giftConfig } from '../config'
let context: AudioContext | null = null
let timer: ReturnType<typeof setInterval> | undefined
let master: GainNode | undefined
let music = false
let effects = false
let step = 0
const melody = [72, 76, 79, 83, 81, 79, 76, 74, 72, 76, 79, 84, 83, 79, 76, 74]
function getContext() {
  if (!context) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = 0.16
    master.connect(context.destination)
  }
  return context
}
function tone(note: number, duration = 1.2, volume = 0.17) {
  const ctx = getContext()
  if (ctx.state !== 'running') return
  const oscillator = ctx.createOscillator(),
    gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12)
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(master!)
  oscillator.start()
  oscillator.stop(ctx.currentTime + duration)
}
export async function setMusic(enabled: boolean) {
  music = enabled
  clearInterval(timer)
  if (!enabled) {
    if (context) await context.suspend()
    return
  }
  const ctx = getContext()
  await ctx.resume()
  const play = () => {
    tone(melody[step++ % melody.length] - (giftConfig.musicTheme === 'piano' ? 12 : 0), 2.2, 0.2)
    if (step % 4 === 0) tone(48, 2.5, 0.1)
  }
  play()
  timer = setInterval(play, 700)
}
export function setEffects(enabled: boolean) {
  effects = enabled
}
export async function sound(kind: 'click' | 'star' | 'letter' | 'gift' = 'click') {
  if (!effects || document.hidden) return
  try {
    await getContext().resume()
    const notes =
      kind === 'star' || kind === 'gift' ? [72, 76, 79, 84] : kind === 'letter' ? [76, 79] : [84]
    notes.forEach((n, i) =>
      setTimeout(() => {
        if (effects && !document.hidden) tone(n, 0.5, 0.12)
      }, i * 80),
    )
  } catch {
    /* Audio is optional. */
  }
}
if (typeof document !== 'undefined')
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer)
      void context?.suspend()
    } else if (music) void setMusic(true).catch(() => {})
  })
