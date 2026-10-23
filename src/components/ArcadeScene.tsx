import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Lightbulb, Plus, RotateCcw, Shuffle, Trophy } from 'lucide-react'
import { giftConfig } from '../config'
import { sound } from '../lib/audio'
import {
  addMergeItem,
  adjacent,
  ARCADE_KEY,
  createMatchBoard,
  createMergeBoard,
  findMatches,
  loadArcade,
  mergeItems,
  possibleMove,
  refillBoard,
  swapTiles,
} from '../lib/arcade'
import type { ArcadeSave, MatchBoard, MergeBoard } from '../lib/arcade'
import { Character, Doodle, Friends, KnightDrawing } from './Art'

const matchIcons = ['berry', 'flower', 'star', 'bow', 'shield', 'paw']
const matchNames = ['клубничка', 'цветочек', 'звёздочка', 'бантик', 'щит', 'лапка']
const mergeIcons = ['heart', 'berry', 'flower', 'bow', 'gem', 'crown', 'knight']
const mergeNames = [
  'сердечко',
  'клубничка',
  'цветочек',
  'бантик',
  'кристалл',
  'корона',
  'котик-рыцарь',
]
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

type MatchProps = { initial: ArcadeSave; onSave: (board: MatchBoard, score: number) => void }
function MatchGame({ initial, onSave }: MatchProps) {
  const [board, setBoard] = useState(initial.match),
    [selected, setSelected] = useState<number | null>(null),
    [score, setScore] = useState(initial.matchScore),
    [clearing, setClearing] = useState<number[]>([]),
    [hint, setHint] = useState<number[]>([]),
    [locked, setLocked] = useState(false),
    [message, setMessage] = useState(
      'Выбери фигурку, а потом соседнюю. Собери три одинаковые в линию.',
    )
  const busy = useRef(false),
    mounted = useRef(true),
    reduce = useReducedMotion()
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const save = (next: MatchBoard, points: number) => {
    if (mounted.current) onSave(next, points)
  }
  const select = async (index: number) => {
    if (busy.current) return
    setHint([])
    if (selected === null || !adjacent(selected, index)) {
      setSelected(selected === index ? null : index)
      return
    }
    const a = selected
    setSelected(null)
    busy.current = true
    setLocked(true)
    let next = swapTiles(board, a, index),
      points = score
    setBoard(next)
    await wait(reduce ? 10 : 190)
    if (!mounted.current) return
    if (!findMatches(next).length) {
      setBoard(board)
      setMessage('Эта пара пока не складывается. Попробуем другую? Ничего не потерялось ♡')
      busy.current = false
      setLocked(false)
      return
    }
    let chain = 0
    while (findMatches(next).length && chain < 12) {
      const matches = findMatches(next)
      chain++
      setClearing(matches)
      points += matches.length * 10 * chain
      setScore(points)
      setMessage(
        chain > 1
          ? `Каскад ×${chain}! Хитрики устроили маленький праздник.`
          : `Мур-р! Собрано ${matches.length} фигурки. +${matches.length * 10} тепла`,
      )
      void sound(chain > 1 ? 'star' : 'click')
      await wait(reduce ? 10 : 260)
      if (!mounted.current) return
      next = refillBoard(next, matches)
      setClearing([])
      setBoard(next)
      await wait(reduce ? 10 : 220)
      if (!mounted.current) return
    }
    if (findMatches(next).length || !possibleMove(next)) {
      next = createMatchBoard()
      setBoard(next)
      setMessage('Полянка мягко перемешалась. Все твои очки остались с тобой ♡')
    }
    save(next, points)
    busy.current = false
    setLocked(false)
  }
  const shuffle = () => {
    if (busy.current) return
    const next = createMatchBoard()
    setBoard(next)
    setSelected(null)
    setHint([])
    save(next, score)
    setMessage('Новая россыпь фигурок. Ни одного потерянного очка ♡')
  }
  const restart = () => {
    if (busy.current) return
    const next = createMatchBoard()
    setBoard(next)
    setScore(0)
    setHint([])
    setSelected(null)
    save(next, 0)
    setMessage('Новая маленькая партия. Рекорд бережно сохранён.')
  }
  const goal = giftConfig.arcade.matchGoal
  return (
    <div className="match-game">
      <div className="arcade-scorebar">
        <div>
          <span>собрано тепла</span>
          <strong data-testid="match-score">{score}</strong>
        </div>
        <div className="score-best">
          <Trophy size={16} />
          <span>
            рекорд <strong>{Math.max(initial.bestMatch, score)}</strong>
          </span>
        </div>
      </div>
      <div
        className="match-board"
        role="group"
        aria-label="Три в ряд: поле 6 на 6"
        aria-busy={locked}
      >
        {board.map((item, i) => (
          <motion.button
            layout={!reduce}
            transition={{ duration: 0.16 }}
            key={item.id}
            data-match-index={i}
            data-tile-type={item.type}
            className={`match-tile tile-type-${item.type} ${selected === i ? 'selected' : ''} ${clearing.includes(i) ? 'clearing' : ''} ${hint.includes(i) ? 'hinted' : ''}`}
            aria-label={`${matchNames[item.type]}, строка ${Math.floor(i / 6) + 1}, столбец ${(i % 6) + 1}`}
            aria-pressed={selected === i}
            disabled={locked}
            onClick={() => {
              void select(i)
            }}
            onKeyDown={(e) => {
              const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -6, ArrowDown: 6 }[e.key]
              if (delta !== undefined) {
                e.preventDefault()
                document
                  .querySelector<HTMLButtonElement>(
                    `[data-match-index="${Math.max(0, Math.min(35, i + delta))}"]`,
                  )
                  ?.focus()
              }
            }}
          >
            <Doodle name={matchIcons[item.type]} size={40} />
          </motion.button>
        ))}
      </div>
      <div className="arcade-tools">
        <button
          disabled={locked}
          onClick={() => {
            const move = possibleMove(board)
            if (move) {
              setHint(move)
              setMessage('Вот две соседние фигурки — попробуй поменять их местами ♡')
            }
          }}
        >
          <Lightbulb size={16} />
          подсказка
        </button>
        <button disabled={locked} onClick={shuffle}>
          <Shuffle size={15} />
          перемешать
        </button>
        <button disabled={locked} onClick={restart} aria-label="Новая партия три в ряд">
          <RotateCcw size={15} />
          заново
        </button>
      </div>
      <p className="arcade-feedback" role="status">
        {message}
      </p>
      <div className="cozy-goal">
        <div>
          <Doodle name={score >= goal ? 'crown' : 'heart'} size={22} />
          <span>
            {score >= goal
              ? 'Кубок маленьких хитриков твой! Можно играть дальше.'
              : `Собери ${goal} тепла для маленького кубка`}
          </span>
        </div>
        <span className="goal-track">
          <span style={{ width: `${Math.min(100, (score / goal) * 100)}%` }} />
        </span>
      </div>
    </div>
  )
}

type MergeProps = {
  initial: ArcadeSave
  onSave: (board: MergeBoard, score: number, trophies: number) => void
}
function MergeGame({ initial, onSave }: MergeProps) {
  const [board, setBoard] = useState(initial.merge),
    [selected, setSelected] = useState<number | null>(null),
    [score, setScore] = useState(initial.mergeScore),
    [trophies, setTrophies] = useState(initial.trophies),
    [result, setResult] = useState<number | null>(null),
    [message, setMessage] = useState(
      'Соедини два одинаковых предмета. Их можно перетаскивать или выбирать по очереди.',
    ),
    [dragOver, setDragOver] = useState<number | null>(null)
  const drag = useRef<{ from: number; x: number; y: number; moved: boolean } | null>(null),
    suppressClick = useRef(false)
  const perform = (source: number, target: number) => {
    const next = mergeItems(board, source, target)
    if (!next) {
      setSelected(board[target] === null ? null : target)
      setMessage(
        'Нужны два одинаковых предмета. Пустая клеточка тоже пригодится — туда можно перенести находку.',
      )
      return
    }
    setBoard(next.board)
    setSelected(null)
    setResult(next.merged ? target : null)
    let points = score,
      cups = trophies
    if (next.merged) {
      points += 2 ** (next.level + 1)
      if (next.level === 6) cups++
      setScore(points)
      setTrophies(cups)
      setMessage(
        next.level === 6
          ? 'Та-дам! Твоя маленькая рыцарка готова охранять этот уют ♡'
          : `Два предмета — одно маленькое чудо! Получилось: ${mergeNames[next.level]}.`,
      )
      void sound('star')
    } else {
      setMessage('Нашли находке новое уютное местечко.')
      void sound('click')
    }
    onSave(next.board, points, cups)
  }
  const click = (index: number) => {
    if (suppressClick.current) return
    if (selected === null) {
      if (board[index] !== null) setSelected(index)
    } else if (selected === index) setSelected(null)
    else perform(selected, index)
  }
  const generate = () => {
    const next = addMergeItem(board)
    if (!next) {
      setMessage('Корзинка полная! Соедини любую пару одинаковых предметов — и появится место ♡')
      return
    }
    setBoard(next)
    setResult(null)
    onSave(next, score, trophies)
    setMessage('Ещё одна находка для нашей маленькой коллекции.')
  }
  return (
    <div className="merge-game">
      <div className="arcade-scorebar">
        <div>
          <span>маленьких чудес</span>
          <strong data-testid="merge-score">{score}</strong>
        </div>
        <div className="score-best">
          <Trophy size={16} />
          <span>
            рыцарок <strong>{trophies}</strong>
          </span>
        </div>
      </div>
      <div className="merge-board" role="group" aria-label="Merge: поле 4 на 4">
        {board.map((level, i) => (
          <button
            key={i}
            data-merge-index={i}
            data-merge-level={level ?? 'empty'}
            className={`merge-tile ${level === null ? 'is-empty' : `merge-level-${level}`} ${selected === i ? 'selected' : ''} ${dragOver === i ? 'drag-over' : ''} ${result === i ? 'just-merged' : ''}`}
            aria-label={`${level === null ? 'пустая клетка' : mergeNames[level]}, клетка ${i + 1}`}
            aria-pressed={selected === i}
            onClick={() => click(i)}
            onPointerDown={(e) => {
              if (level === null) return
              drag.current = { from: i, x: e.clientX, y: e.clientY, moved: false }
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => {
              if (!drag.current) return
              if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 9)
                drag.current.moved = true
              if (drag.current.moved) {
                const target = document
                  .elementFromPoint(e.clientX, e.clientY)
                  ?.closest<HTMLElement>('[data-merge-index]')
                setDragOver(target ? Number(target.dataset.mergeIndex) : null)
              }
            }}
            onPointerUp={(e) => {
              const current = drag.current
              drag.current = null
              setDragOver(null)
              if (!current?.moved) return
              suppressClick.current = true
              setTimeout(() => {
                suppressClick.current = false
              }, 0)
              const target = document
                .elementFromPoint(e.clientX, e.clientY)
                ?.closest<HTMLElement>('[data-merge-index]')
              if (target) perform(current.from, Number(target.dataset.mergeIndex))
            }}
            onPointerCancel={() => {
              drag.current = null
              setDragOver(null)
            }}
          >
            {level === null ? (
              <Plus size={16} />
            ) : (
              <>
                <span className="merge-item-art" key={`${i}-${level}`}>
                  {level === 6 ? (
                    <svg viewBox="0 0 220 240" aria-hidden="true">
                      <KnightDrawing />
                    </svg>
                  ) : (
                    <Doodle name={mergeIcons[level]} size={49} />
                  )}
                </span>
                <span className="merge-tier">{level + 1}</span>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="merge-actions">
        <button className="generate-item" onClick={generate}>
          <Doodle name="gift" size={24} />
          достать находку <Plus size={15} />
        </button>
        <button
          className="circle-button"
          aria-label="Новая полянка merge"
          onClick={() => {
            const next = createMergeBoard()
            setBoard(next)
            setScore(0)
            setSelected(null)
            setResult(null)
            onSave(next, 0, trophies)
            setMessage('Новая полянка. Найденные рыцарки остались в коллекции.')
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="arcade-feedback" role="status">
        {message}
      </p>
      <div
        className="merge-chain"
        aria-label="Коллекция: сердечко, клубничка, цветок, бантик, кристалл, корона, котик-рыцарь"
      >
        {mergeIcons.map((icon, i) => (
          <span
            key={icon}
            className={
              board.some((level) => level !== null && level >= i) || trophies ? 'discovered' : ''
            }
          >
            {icon === 'knight' ? (
              <svg viewBox="0 0 220 240" aria-hidden="true">
                <KnightDrawing />
              </svg>
            ) : (
              <Doodle name={icon} size={24} />
            )}
            {i < 6 && <ArrowRight size={10} />}
          </span>
        ))}
      </div>
      <span className="merge-goal">из маленького сердечка — в храброе маленькое чудо</span>
    </div>
  )
}

export function ArcadeScene({ notify }: { notify: (s: string) => void }) {
  const [mode, setMode] = useState<'match' | 'merge'>('match'),
    [save, setSave] = useState(loadArcade),
    [storageOkay, setStorageOkay] = useState(true)
  useEffect(() => {
    try {
      localStorage.setItem(ARCADE_KEY, JSON.stringify(save))
      setStorageOkay(true)
    } catch {
      setStorageOkay(false)
    }
  }, [save])
  return (
    <section className="arcade-scene">
      <div className="arcade-intro">
        <span className="eyebrow">ЕЁ МАЛЕНЬКАЯ РЫЦАРКА · ЕГО БОЛЬШОЙ УЮТ</span>
        <h1 tabIndex={-1}>{giftConfig.arcade.title}</h1>
        <p>{giftConfig.arcade.introText}</p>
      </div>
      <div className="arcade-layout">
        <aside className="knight-companion">
          <div className="knight-portrait">
            <Character kind="knight" onSecret={notify} />
            <span className="portrait-star">✧</span>
            <Doodle name="flower" size={42} className="portrait-flower" />
          </div>
          <span className="eyebrow">{giftConfig.knightName}</span>
          <h2>{giftConfig.arcade.companionTitle}</h2>
          <p>{giftConfig.arcade.companionText}</p>
          <p className="knight-whisper">{giftConfig.arcade.companionAside}</p>
          <div className="arcade-mascot">
            <Character onSecret={notify} />
            <span>{giftConfig.arcade.catAside}</span>
          </div>
        </aside>
        <div className="arcade-console">
          <div className="arcade-tabs" role="tablist" aria-label="Выбрать игру">
            <button
              role="tab"
              aria-selected={mode === 'match'}
              aria-controls="match-panel"
              id="match-tab"
              onClick={() => setMode('match')}
            >
              <Doodle name="star" size={20} />
              три в ряд
            </button>
            <button
              role="tab"
              aria-selected={mode === 'merge'}
              aria-controls="merge-panel"
              id="merge-tab"
              onClick={() => setMode('merge')}
            >
              <Doodle name="gem" size={20} />
              уютный merge
            </button>
          </div>
          <div
            role="tabpanel"
            id="match-panel"
            aria-labelledby="match-tab"
            hidden={mode !== 'match'}
          >
            <MatchGame
              initial={save}
              onSave={(match, matchScore) =>
                setSave((s) => ({
                  ...s,
                  match,
                  matchScore,
                  bestMatch: Math.max(s.bestMatch, matchScore),
                }))
              }
            />
          </div>
          <div
            role="tabpanel"
            id="merge-panel"
            aria-labelledby="merge-tab"
            hidden={mode !== 'merge'}
          >
            <MergeGame
              initial={save}
              onSave={(merge, mergeScore, trophies) =>
                setSave((s) => ({
                  ...s,
                  merge,
                  mergeScore,
                  trophies,
                  bestMerge: Math.max(s.bestMerge, mergeScore),
                }))
              }
            />
          </div>
          <div className="arcade-console-note">
            <Doodle name="heart" size={17} />
            <span>без таймера, жизней и спешки. можно просто играть.</span>
          </div>
        </div>
      </div>
      {!storageOkay && (
        <p className="scene-footnote">
          Браузер не разрешил сохранить игровую полянку. В этой вкладке можно продолжать.
        </p>
      )}
      <div className="arcade-endnote">
        <Friends onSecret={notify} />
        <p>ещё одну партию? а потом — обниматься.</p>
      </div>
    </section>
  )
}
