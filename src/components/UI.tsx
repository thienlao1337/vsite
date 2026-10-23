import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Music2, Volume2, VolumeX, X } from 'lucide-react'
import { destinations, giftConfig } from '../config'
import type { Adventure } from '../config'
import { Doodle } from './Art'
import { setEffects, setMusic } from '../lib/audio'

export function PrimaryButton({
  children,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`primary-button ${className}`}
    >
      {children}
      <ArrowRight size={17} strokeWidth={1.7} />
    </motion.button>
  )
}
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-button" onClick={onClick}>
      <ArrowLeft size={16} /> на карту
    </button>
  )
}
export function Stars({ stars, small = false }: { stars: Adventure[]; small?: boolean }) {
  return (
    <div
      className={`star-collection ${small ? 'small' : ''}`}
      aria-label={`Собрано ${stars.length} из ${destinations.filter((d) => giftConfig.scenes[d.id]).length} звёздочек`}
    >
      {destinations
        .filter((d) => giftConfig.scenes[d.id])
        .map((d) => (
          <motion.span
            key={d.id}
            animate={stars.includes(d.id) ? { scale: [1, 1.25, 1], opacity: 1 } : { opacity: 0.48 }}
            className={stars.includes(d.id) ? 'collected' : 'empty'}
          >
            <Doodle name="star" size={small ? 20 : 35} />
          </motion.span>
        ))}
    </div>
  )
}
export function SoundControls({ notify }: { notify: (s: string) => void }) {
  const [open, setOpen] = useState(false),
    [music, toggleMusic] = useState(false),
    [effects, toggleEffects] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [])
  return (
    <div className="sound-control" ref={ref}>
      <button
        className={`sound-button ${music ? 'on' : ''}`}
        aria-label="Настройки музыки и звуков"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {music ? <Volume2 size={18} /> : <Music2 size={18} />}
        <span>{music ? 'музыка вкл.' : 'тихий режим'}</span>
        <span className={`sound-dot ${music ? 'active' : ''}`} />
      </button>
      {open && (
        <div className="sound-popover">
          <p>Немного волшебства</p>
          <label>
            <span>
              <Music2 size={16} />
              Музыкальная шкатулка
            </span>
            <input
              type="checkbox"
              role="switch"
              aria-label="Музыка"
              checked={music}
              onChange={(e) => {
                const value = e.target.checked
                toggleMusic(value)
                void setMusic(value).catch(() => {
                  toggleMusic(false)
                  notify('Браузер не разрешил звук. Можно продолжать в тишине ♡')
                })
              }}
            />
          </label>
          <label>
            <span>{effects ? <Volume2 size={16} /> : <VolumeX size={16} />}Тихие звуки</span>
            <input
              type="checkbox"
              role="switch"
              aria-label="Звуковые эффекты"
              checked={effects}
              onChange={(e) => {
                toggleEffects(e.target.checked)
                setEffects(e.target.checked)
              }}
            />
          </label>
          <small>Здесь хорошо и без звука ♡</small>
        </div>
      )}
    </div>
  )
}
export function Dialog({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    el?.showModal()
    return () => {
      el?.close()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`dialog ${className}`}
      aria-label={title}
    >
      <div className="dialog-inside">
        <button className="close-button" aria-label="Закрыть" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  )
}
export function Reward({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <Dialog title="Звёздочка найдена" onClose={onClose} className="reward-dialog">
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], scale: [0.6, 1.15, 1] }}
        transition={{ duration: 0.7 }}
        className="reward-star"
      >
        <Doodle name="star" size={104} />
      </motion.div>
      <span className="eyebrow">ЕЩЁ ЧУТОЧКУ ВОЛШЕБСТВА</span>
      <h2>Звёздочка наша!</h2>
      <p>{name}</p>
      <p className="muted">{giftConfig.catName} бережно положил её в коллекцию.</p>
      <PrimaryButton onClick={onClose}>продолжить приключение</PrimaryButton>
    </Dialog>
  )
}
export function Toast({ message }: { message: string }) {
  return (
    <div className="toast-container" aria-live="polite" role="status">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="toast"
          >
            <Doodle name="heart" size={21} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export function ChapterHeading({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="chapter-heading">
      <span className="eyebrow">МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ {number}</span>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{text}</p>
    </div>
  )
}
export function Completed({ children }: { children?: React.ReactNode }) {
  return (
    <span className="completed">
      <Check size={15} />
      {children || 'звёздочка уже в коллекции'}
    </span>
  )
}
export function Confetti({ seed }: { seed: number }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {seed > 0 && !reduce && (
        <div className="confetti" key={seed} aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ x: `${(i * 43) % 100}vw`, y: -50, rotate: 0, opacity: 0 }}
              animate={{
                y: '95dvh',
                x: `${((i * 43) % 100) + (i % 2 ? 6 : -6)}vw`,
                rotate: i % 2 ? 160 : -140,
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{ duration: 3.6 + (i % 3) * 0.4, delay: (i % 5) * 0.15 }}
            >
              <Doodle name={i % 3 ? 'heart' : 'flower'} size={i % 2 ? 18 : 27} />
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
