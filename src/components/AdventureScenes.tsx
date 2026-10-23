import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { giftConfig } from '../config'
import type { Adventure } from '../config'
import type { Progress } from '../lib/progress'
import { sound } from '../lib/audio'
import { Character, Doodle, EnvelopeArt, Friends, KnightDrawing } from './Art'
import { ChapterHeading, Completed, Dialog, PrimaryButton } from './UI'

type SceneProps = {
  award: (id: Adventure, show?: boolean) => void
  progress: Progress
  notify: (s: string) => void
}
export function StoryScene({ award, progress }: SceneProps) {
  const [opened, setOpened] = useState(false),
    [page, setPage] = useState(0)
  const memory = giftConfig.memories[page]
  return (
    <section className="scene story-scene">
      <ChapterHeading
        number="01"
        title="С одного маленького «привет»"
        text="У каждой истории есть первая страничка. Заглянем в нашу?"
      />
      {!opened ? (
        <div className="book-intro">
          <motion.button
            className="closed-book"
            whileHover={{ rotate: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setOpened(true)
              void sound('letter')
            }}
            aria-label="Открыть книгу знакомства"
          >
            <span className="book-spine" />
            <Doodle name="flower" size={86} />
            <span>
              наша маленькая
              <br />
              история
            </span>
            <span className="book-ribbon" />
            <small>нажми, чтобы открыть</small>
          </motion.button>
          <div className="book-cat">
            <Character />
            <div className="speech-mini">а помнишь, с чего всё началось?</div>
          </div>
        </div>
      ) : (
        <div className="storybook">
          <div className="book-page book-left">
            <span className="book-corner">♡</span>
            <Doodle name={['flower', 'mail', 'heart', 'cloud', 'star'][page % 5]} size={112} />
            <p>{memory?.label}</p>
            <span className="book-page-number">{page * 2 + 1}</span>
          </div>
          <div className="book-page book-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="eyebrow">
                  СТРАНИЧКА {page + 1} ИЗ {giftConfig.memories.length}
                </span>
                <h2>{memory?.title || 'У нашей истории есть начало'}</h2>
                <p>{memory?.text || 'Этот месяц — маленькое хорошее начало.'}</p>
              </motion.div>
            </AnimatePresence>
            <span className="book-page-number">{page * 2 + 2}</span>
          </div>
        </div>
      )}
      {opened && (
        <>
          <div className="page-controls">
            <button
              className="circle-button"
              aria-label="Предыдущая страница истории"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={19} />
            </button>
            <div className="page-dots">
              {giftConfig.memories.map((_, i) => (
                <span key={i} className={i === page ? 'active' : ''} />
              ))}
            </div>
            {page < giftConfig.memories.length - 1 ? (
              <button
                className="circle-button"
                aria-label="Следующая страница истории"
                onClick={() => {
                  setPage((p) => p + 1)
                  void sound('letter')
                }}
              >
                <ChevronRight size={19} />
              </button>
            ) : (
              <PrimaryButton onClick={() => award('story')}>
                {progress.stars.includes('story') ? 'ещё раз улыбнуться' : 'забрать звёздочку'}
              </PrimaryButton>
            )}
          </div>
          <p className="scene-footnote">всего месяц. а уже столько тепла.</p>
        </>
      )}
    </section>
  )
}

type Drop = { id: number; x: number; kind: string; duration: number; delay: number }
export function CatchGame({ award, progress, notify }: SceneProps) {
  const [running, setRunning] = useState(false),
    [count, setCount] = useState(0),
    [round, setRound] = useState(0),
    [basket, setBasket] = useState(50),
    [drops, setDrops] = useState<Drop[]>([])
  const field = useRef<HTMLDivElement>(null),
    nextId = useRef(0),
    catching = useRef(new Set<number>()),
    dragging = useRef(false),
    liveCount = useRef(0)
  const reduce = useReducedMotion()
  const caught = (id: number) => {
    if (!running || catching.current.has(id) || liveCount.current >= 10) return
    catching.current.add(id)
    liveCount.current += 1
    setCount(liveCount.current)
    setDrops((items) => items.filter((d) => d.id !== id))
    void sound('click')
  }
  useEffect(() => {
    if (!running || count >= 10) return
    const spawn = () =>
      setDrops((items) => [
        ...items,
        {
          id: nextId.current++,
          x: 8 + Math.random() * 80,
          kind: ['heart', 'berry', 'star', 'flower'][nextId.current % 4],
          duration: reduce ? 30 : 7.5,
          delay: 0,
        },
      ])
    spawn()
    const id = setInterval(spawn, 650)
    return () => clearInterval(id)
  }, [running, reduce, round, count >= 10])
  useEffect(() => {
    if (running && count >= 10) {
      setRunning(false)
      setDrops([])
      void sound('star')
    }
  }, [count, running])
  const move = (clientX: number) => {
    const rect = field.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(7, Math.min(93, ((clientX - rect.left) / rect.width) * 100))
    setBasket(x)
  }
  const start = () => {
    setCount(0)
    liveCount.current = 0
    catching.current.clear()
    setDrops([])
    setRunning(true)
    setRound((r) => r + 1)
  }
  return (
    <section className="scene game-scene">
      <ChapterHeading
        number="02"
        title="Поймай немножко счастья"
        text="Биби собирает маленькие радости. Поможешь ей поймать десять?"
      />
      <div className="game-shell">
        <div className="game-topline">
          <span>
            <Doodle name="berry" size={21} />
            корзинка хорошего настроения
          </span>
          <strong aria-live="polite">
            {count} <span>/ 10</span>
          </strong>
        </div>
        <div
          className={`game-field ${running ? 'is-playing' : ''}`}
          ref={field}
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest('button')) return
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            move(e.clientX)
          }}
          onPointerMove={(e) => {
            if (dragging.current) move(e.clientX)
          }}
          onPointerUp={() => {
            dragging.current = false
          }}
          onPointerCancel={() => {
            dragging.current = false
          }}
        >
          <div className="game-cloud cloud-one">
            <Doodle name="cloud" size={88} />
          </div>
          <div className="game-cloud cloud-two">
            <Doodle name="cloud" size={65} />
          </div>
          {running &&
            drops.map((item) => (
              <motion.button
                key={item.id}
                className="falling-item"
                aria-label="Поймать радость"
                style={{ left: `${item.x}%` }}
                initial={{ top: 2, rotate: -12 }}
                animate={{ top: '82%', rotate: 15 }}
                transition={{ duration: item.duration, ease: 'linear' }}
                onClick={(e) => {
                  e.stopPropagation()
                  caught(item.id)
                }}
                onAnimationComplete={() => {
                  if (Math.abs(item.x - basket) < 15) caught(item.id)
                  setDrops((items) => items.filter((d) => d.id !== item.id))
                }}
              >
                <Doodle name={item.kind} size={40} />
              </motion.button>
            ))}
          {!running && count < 10 && (
            <div className="game-start">
              <Doodle name="heart" size={60} />
              <h2>Счастье уже близко!</h2>
              <p>
                Нажимай на падающие фигурки
                <br />
                или двигай корзинку пальцем.
              </p>
              <PrimaryButton onClick={start}>давай ловить</PrimaryButton>
              <small>промахи не считаются. здесь только радость ♡</small>
            </div>
          )}
          {count >= 10 && (
            <div className="game-start game-win">
              <Doodle name="star" size={68} />
              <h2>Десять маленьких радостей!</h2>
              <p>А самая большая — наше знакомство ♡</p>
              <PrimaryButton onClick={() => award('game')}>забрать звёздочку</PrimaryButton>
              <button className="text-button" onClick={start}>
                <RotateCcw size={14} />
                поймать ещё немножко
              </button>
            </div>
          )}
          <div className="basket-character" style={{ left: `${basket}%` }}>
            <Character kind="bunny" onSecret={notify} />
            <svg viewBox="0 0 100 57" className="basket" aria-hidden="true">
              <path d="M16 16Q50-18 84 16" fill="none" stroke="#c8a78f" strokeWidth="5" />
              <path d="m5 14 12 38h66l12-38Z" fill="#ead4b4" stroke="#b79a82" strokeWidth="2" />
              <path
                d="M12 24h76m-71 9h66m-62 9h58M23 15l9 37m7-37 5 37m15-37-4 37m21-37-9 37"
                stroke="#c3a687"
                strokeWidth="1.4"
              />
              <path d="M49 40c-16-10-7-21 1-11 8-10 17 1-1 11" fill="#e4adba" />
            </svg>
          </div>
          <div className="game-grass" />
        </div>
      </div>
      <p className="scene-footnote">можно играть одной рукой, а другой — держать чай</p>
      <button
        className="text-button skip-button"
        onClick={() => {
          setRunning(false)
          award('game')
        }}
      >
        пропустить игру и получить звёздочку <ArrowRight size={14} />
      </button>
      {progress.stars.includes('game') && <Completed />}
    </section>
  )
}

export function MailScene({
  award,
  progress,
  notify,
  markLetter,
}: SceneProps & { markLetter: (i: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const note = selected !== null ? giftConfig.notes[selected] : null
  const open = (i: number) => {
    setSelected(i)
    markLetter(i)
    award('mail', false)
    void sound('letter')
  }
  return (
    <section className="scene mail-scene">
      <ChapterHeading
        number="03"
        title="Почта маленьких нежностей"
        text="Некоторые слова лучше сохранить. На тот самый случай."
      />
      <div className="mail-roof">
        <Doodle name="flower" size={38} />
        <span>МАЛЕНЬКАЯ ПОЧТА · РАБОТАЕТ С ТЕПЛОМ</span>
        <Doodle name="flower" size={38} />
      </div>
      <div className="mail-grid">
        {giftConfig.notes.map((item, i) => (
          <motion.button
            whileHover={{ y: -7, rotate: i % 2 ? 2 : -2 }}
            whileTap={{ scale: 0.97 }}
            key={item.title}
            onClick={() => open(i)}
            className={`mail-envelope mail-${i}`}
          >
            <span className="mail-number">0{i + 1}</span>
            <EnvelopeArt open={progress.letters.includes(i)} />
            <span className="envelope-label">
              открой,
              <br />
              <strong>{item.title}</strong>
            </span>
            {progress.letters.includes(i) && (
              <span className="read-badge">
                <Check size={12} />
                прочитано
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mail-caption">
        <Doodle name="mail" size={24} />
        <p>Никаких марок. Только добрые слова.</p>
      </div>
      {progress.stars.includes('mail') ? (
        <Completed>звёздочка найдена · письма можно читать снова</Completed>
      ) : (
        <p className="scene-footnote">открой любой конвертик — внутри прячется звёздочка</p>
      )}
      {note && (
        <Dialog
          title={note.title}
          onClose={() => setSelected(null)}
          className={`note-dialog note-${note.art}`}
        >
          <span className="eyebrow">ПИСЬМЕЦО ДЛЯ ТЕБЯ</span>
          <Doodle
            name={note.art === 'flower' ? 'flower' : note.art === 'spark' ? 'spark' : 'heart'}
            size={54}
          />
          <h2>{note.title}</h2>
          <p>{note.text}</p>
          <Character onSecret={notify} />
          <span className="note-signature">из нашего маленького мира</span>
          <button className="text-button" onClick={() => setSelected(null)}>
            бережно сложить обратно <Check size={15} />
          </button>
        </Dialog>
      )}
    </section>
  )
}

function PhotoCard({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)
  return error ? (
    <div className="photo-fallback">
      <Doodle name="flower" size={100} />
      <span>здесь хранится тёплый момент</span>
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setError(true)} />
  )
}
export function AlbumScene({ award, progress, notify }: SceneProps) {
  const [page, setPage] = useState(0)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const total = Math.max(
    1,
    giftConfig.album.length + giftConfig.photos.length + giftConfig.insideJokes.length,
  )
  const item = giftConfig.album[page],
    photo = giftConfig.photos[page - giftConfig.album.length],
    joke = giftConfig.insideJokes[page - giftConfig.album.length - giftConfig.photos.length]
  const turn = (delta: number) => {
    setPage((p) => Math.max(0, Math.min(total - 1, p + delta)))
    void sound('letter')
  }
  return (
    <section className="scene album-scene">
      <ChapterHeading
        number="04"
        title="То, что хочется сохранить"
        text="Не фотографии, а маленькие кусочки тепла. Здесь им будет уютно."
      />
      <div
        className="scrapbook"
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }}
        onTouchEnd={(e) => {
          if (touch.current) {
            const x = e.changedTouches[0].clientX - touch.current.x,
              y = e.changedTouches[0].clientY - touch.current.y
            if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.3) turn(x < 0 ? 1 : -1)
            touch.current = null
          }
        }}
      >
        <div className="scrapbook-rings">
          <i />
          <i />
          <i />
        </div>
        <span className="tape tape-one" />
        <span className="tape tape-two" />
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            className="album-spread"
            initial={{ opacity: 0, rotateY: -8, x: 12 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="polaroid">
              <div className={`polaroid-image polaroid-${item?.art || 'flowers'}`}>
                {photo ? (
                  <PhotoCard src={photo.src} alt={photo.alt} />
                ) : joke ? (
                  <Doodle name="bear" size={130} />
                ) : item?.art === 'knight' ? (
                  <svg
                    className="album-knight"
                    viewBox="0 0 220 240"
                    aria-label="Золотистый котик-рыцарь с бантиком, мечом и плащом"
                  >
                    <KnightDrawing />
                  </svg>
                ) : item?.art === 'friends' ? (
                  <Friends onSecret={notify} />
                ) : (
                  <Doodle name={item?.art === 'mail' ? 'mail' : 'flower'} size={136} />
                )}
              </div>
              <span>{photo?.caption || item?.caption || 'маленький момент — большая улыбка'}</span>
            </div>
            <div className="scrap-note">
              <Doodle name="heart" size={29} />
              <span className="eyebrow">В НАШУ КОПИЛОЧКУ</span>
              <h2>{item?.title || (photo ? 'Один тёплый кадр' : 'Понятно только нам')}</h2>
              <p>{item?.text || photo?.caption || joke}</p>
              <small>бережно сохранено ♡</small>
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          className="sticker sticker-flower"
          aria-label="Погладить цветочек-наклейку"
          onClick={() => notify('цветочек расцвёл от твоего прикосновения ♡')}
        >
          <Doodle name="flower" size={68} />
        </button>
        <button
          className="sticker sticker-berry"
          aria-label="Открыть клубничную открытку"
          onClick={() => notify('клубничная открытка: пусть день будет сладким!')}
        >
          <Doodle name="berry" size={44} />
        </button>
      </div>
      <div className="page-controls">
        <button
          className="circle-button"
          aria-label="Предыдущая страница альбома"
          disabled={page === 0}
          onClick={() => turn(-1)}
        >
          <ChevronLeft size={19} />
        </button>
        <span className="page-counter">
          {page + 1} <span>/ {total}</span>
        </span>
        <button
          className="circle-button"
          aria-label="Следующая страница альбома"
          disabled={page === total - 1}
          onClick={() => turn(1)}
        >
          <ChevronRight size={19} />
        </button>
      </div>
      {page === total - 1 ? (
        <PrimaryButton onClick={() => award('album')}>
          {progress.stars.includes('album')
            ? 'ещё одна тёплая улыбка'
            : 'сохранить тепло и забрать звёздочку'}
        </PrimaryButton>
      ) : (
        <p className="scene-footnote">листай пальцем или нажимай на стрелочки</p>
      )}
    </section>
  )
}

const skyPositions = [
  { x: 16, y: 23 },
  { x: 34, y: 43 },
  { x: 55, y: 18 },
  { x: 78, y: 32 },
  { x: 62, y: 56 },
]
export function SkyScene({ award, progress, notify }: SceneProps) {
  const [note, setNote] = useState('посмотри, сколько здесь звёздочек… но одна из них особенная'),
    [found, setFound] = useState(progress.stars.includes('sky'))
  return (
    <section className="scene sky-scene">
      <ChapterHeading
        number="05"
        title="Из стольких звёзд — одна"
        text="Иногда самые хорошие случайности сияют чуть-чуть ярче."
      />
      <div className={`night-sky ${found ? 'constellation-found' : ''}`}>
        <div className="sky-moon">
          <Doodle name="moon" size={123} />
        </div>
        <div className="sky-speckles" />
        <svg
          className="constellation"
          viewBox="0 0 800 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M400 135C290 10 123 126 235 230L400 348 567 230C680 126 514 10 400 135Z"
            fill="none"
            stroke="#fff2ca"
            strokeWidth="1.4"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={found ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.4 }}
          />
        </svg>
        {skyPositions.map((pos, i) => (
          <button
            key={i}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className={`sky-star sky-star-${i} ${i === 4 ? 'special-star' : ''}`}
            aria-label={i === 4 ? 'Особенная звезда' : `Прочитать звёздную записку ${i + 1}`}
            onClick={() => {
              setNote(giftConfig.skyNotes[i] || 'спасибо за этот месяц')
              if (i === 4) {
                setFound(true)
                award('sky', false)
              } else void sound('click')
            }}
          >
            <Doodle name="star" size={i === 4 ? 49 : 32} />
          </button>
        ))}
        <Friends onSecret={notify} />
        <div className="sky-cloud-small">
          <Doodle name="cloud" size={90} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={found ? 'found' : note}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="sky-message"
        >
          {found
            ? 'из стольких случайностей случилась одна очень хорошая… мы познакомились ♡'
            : note}
        </motion.p>
      </AnimatePresence>
      {found ? (
        <PrimaryButton onClick={() => award('sky')}>забрать звёздочку</PrimaryButton>
      ) : (
        <span className="scene-footnote">прикоснись к звёздочкам. им есть что тебе сказать.</span>
      )}
    </section>
  )
}

export function SceneNavigation({ onBack, next }: { onBack: () => void; next?: () => void }) {
  return (
    <div className="scene-bottom-nav">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={15} />к нашему миру
      </button>
      {next && (
        <button className="text-button" onClick={next}>
          дальше
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  )
}
