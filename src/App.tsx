import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  LockKeyhole,
  Map,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { destinations, giftConfig } from './config'
import type { Adventure } from './config'
import { emptyProgress, loadProgress, persistProgress } from './lib/progress'
import type { Progress } from './lib/progress'
import { sound } from './lib/audio'
import { Character, CharacterDrawing, Doodle, WorldIllustration } from './components/Art'
import {
  AlbumScene,
  CatchGame,
  MailScene,
  SkyScene,
  StoryScene,
} from './components/AdventureScenes'
import { FinaleScene, GardenScene, LetterScene } from './components/GardenScenes'
import {
  BackButton,
  Confetti,
  Dialog,
  PrimaryButton,
  Reward,
  SoundControls,
  Stars,
  Toast,
} from './components/UI'

const ArcadeScene = lazy(() =>
  import('./components/ArcadeScene').then((module) => ({ default: module.ArcadeScene })),
)

type Screen = 'arcade' | 'welcome' | 'world' | Adventure | 'garden' | 'letter' | 'finale'
const validScreens: Screen[] = [
  'arcade',
  'welcome',
  'world',
  'story',
  'game',
  'mail',
  'album',
  'sky',
  'garden',
  'letter',
  'finale',
]
export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [screen, setScreen] = useState<Screen>(() => (loadProgress().started ? 'world' : 'welcome'))
  const [toast, setToast] = useState(''),
    [reward, setReward] = useState(''),
    [resetOpen, setResetOpen] = useState(false),
    [confetti, setConfetti] = useState(0),
    [opening, setOpening] = useState(false)
  const [storageOkay, setStorageOkay] = useState(true)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reduce = useReducedMotion()
  const active = destinations.filter((d) => giftConfig.scenes[d.id])
  const complete = active.every((d) => progress.stars.includes(d.id))
  const count = active.filter((d) => progress.stars.includes(d.id)).length
  const isWelcome = screen === 'welcome',
    isMap = screen === 'world'
  const notify = (message: string) => {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(''), 3500)
  }
  useEffect(() => {
    setStorageOkay(persistProgress(progress))
  }, [progress])
  useEffect(() => {
    document.title = `${giftConfig.siteTitle} ♡ — для тебя`
    document.documentElement.style.setProperty('--pink', giftConfig.theme.pink)
    document.documentElement.style.setProperty('--cream', giftConfig.theme.cream)
    document.documentElement.style.setProperty('--lavender', giftConfig.theme.lavender)
    document.documentElement.style.setProperty('--ink', giftConfig.theme.text)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    clearTimeout(focusTimer.current)
    focusTimer.current = setTimeout(
      () => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }),
      330,
    )
    return () => clearTimeout(focusTimer.current)
  }, [screen])
  useEffect(() => () => clearTimeout(toastTimer.current), [])
  const navigate = (to: Screen) => {
    if (!validScreens.includes(to)) return
    if (to === 'arcade' && !giftConfig.arcade.enabled) return
    if (['garden', 'letter', 'finale'].includes(to) && !complete) {
      notify('сначала найдём маленькие звёздочки — и сад откроется ♡')
      return
    }
    if (destinations.some((d) => d.id === to) && !giftConfig.scenes[to as Adventure]) return
    setScreen(to)
    void sound('click')
  }
  const start = () => {
    if (opening) return
    setOpening(true)
    void sound('letter')
    setProgress((p) => ({ ...p, started: true }))
    setTimeout(
      () => {
        setScreen('world')
        setOpening(false)
      },
      reduce ? 0 : 500,
    )
  }
  const award = (id: Adventure, show = true) => {
    const already = progress.stars.includes(id)
    setProgress((p) => ({ ...p, stars: p.stars.includes(id) ? p.stars : [...p.stars, id] }))
    if (!already) {
      void sound('star')
      if (!show) notify('ещё одна звёздочка в твоей коллекции ♡')
    }
    if (show) setReward(destinations.find((d) => d.id === id)?.name || 'Маленькое чудо')
  }
  const finish = () => {
    setProgress((p) => ({ ...p, finished: true, celebrated: true }))
    setScreen('finale')
    if (!progress.celebrated) setConfetti((c) => c + 1)
  }
  const sceneProps = { award, progress, notify }
  const next = active.find((d) => !progress.stars.includes(d.id))
  return (
    <div className={`app screen-${screen}`}>
      <div className="page-grain" aria-hidden="true" />
      <header className="site-header">
        <button
          className="brand"
          onClick={() => {
            if (progress.started) navigate('world')
            else notify('это твой маленький мир. он уже ждёт тебя ♡')
          }}
          aria-label="Наш маленький мир — главная"
        >
          <svg viewBox="0 0 220 240" aria-hidden="true">
            <CharacterDrawing />
          </svg>
          <span>
            {giftConfig.siteTitle}
            <small>МАЛЕНЬКАЯ ИСТОРИЯ С БОЛЬШИМ ТЕПЛОМ</small>
          </span>
        </button>
        <div className="header-right">
          {progress.started && (
            <button
              className="header-progress"
              onClick={() => navigate('world')}
              aria-label="Открыть карту и коллекцию звёзд"
            >
              <Stars stars={progress.stars.filter((s) => giftConfig.scenes[s])} small />
              <span>
                {count}/{active.length}
              </span>
            </button>
          )}
          <SoundControls notify={notify} />
        </div>
      </header>
      <main id="main-content">
        {!isWelcome && !isMap && (
          <div className="chapter-bar">
            <BackButton onClick={() => navigate('world')} />
            <span>
              {screen === 'garden' || screen === 'letter' || screen === 'finale'
                ? 'ТВОЙ СЕКРЕТНЫЙ САД'
                : screen === 'arcade'
                  ? giftConfig.arcade.title
                  : active.find((d) => d.id === screen)?.subtitle}
            </span>
            <Stars stars={progress.stars.filter((s) => giftConfig.scenes[s])} small />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0.01 : 0.23 }}
          >
            {(isWelcome || isMap) && (
              <>
                <section className={`world-hero ${isWelcome ? 'welcome-hero' : 'map-hero'}`}>
                  <div className="hero-copy">
                    <span className="eyebrow hero-eyebrow">
                      <span />
                      {isWelcome
                        ? 'ОДИН МЕСЯЦ. МНОГО МАЛЕНЬКИХ ЧУДЕС.'
                        : 'ТВОЁ МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ'}
                    </span>
                    <h1 tabIndex={-1}>
                      {isWelcome ? (
                        <>
                          Наш маленький
                          <br />
                          <em>мир</em>
                          <span className="title-heart">♡</span>
                        </>
                      ) : (
                        <>
                          Этот мир —<br />
                          <em>благодаря тебе</em>
                        </>
                      )}
                    </h1>
                    <p className="hero-lead">
                      {isWelcome
                        ? giftConfig.vocabulary.greeting
                        : complete
                          ? 'Ты нашла все звёздочки. И кое-что особенное уже ждёт тебя в секретном саду.'
                          : 'Представляешь, уже целый месяц, как мы общаемся? За это время появился один маленький волшебный мир…'}
                    </p>
                    <p className="hero-description">
                      {isWelcome ? (
                        <>
                          Я тут кое-что для тебя приготовил.
                          <br />
                          Мир, где живут тёплые слова, маленькие
                          <br className="desktop-break" /> хитрики и два очень пушистых друга.
                        </>
                      ) : complete ? (
                        `${giftConfig.catName} и котик-рыцарь немного волнуются. Говорят, там прячется самый тёплый подарок.`
                      ) : (
                        `${giftConfig.catName} потерял звёздочки. Поможешь найти их все? Прикоснись к любому месту на карте.`
                      )}
                    </p>
                    {isWelcome ? (
                      <>
                        <PrimaryButton
                          onClick={start}
                          disabled={opening}
                          className="open-gift-button"
                        >
                          <Doodle name="gift" size={23} />
                          {opening ? 'открываем маленькое чудо…' : 'открыть подарочек'}
                        </PrimaryButton>
                        <span className="hero-microcopy">
                          <Heart size={12} />
                          сделано с теплом. специально для тебя.
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="map-progress">
                          <Stars stars={progress.stars.filter((s) => giftConfig.scenes[s])} />
                          <span>
                            {count} из {active.length} звёздочек найдено
                          </span>
                        </div>
                        {complete ? (
                          <PrimaryButton onClick={() => navigate('garden')}>
                            <Doodle name="gift" size={24} />в секретный сад
                          </PrimaryButton>
                        ) : (
                          next && (
                            <PrimaryButton onClick={() => navigate(next.id)}>
                              {count === 0
                                ? `конечно, ${giftConfig.catName}!`
                                : 'за следующей звёздочкой'}
                            </PrimaryButton>
                          )
                        )}
                      </>
                    )}
                    <div className="little-postscript">
                      <span className="postscript-line" />
                      <span>
                        {isWelcome
                          ? 'небольшое приключение, которое хочется обнять'
                          : 'здесь можно никуда не торопиться'}
                      </span>
                    </div>
                  </div>
                  <div className={`hero-world ${opening ? 'envelope-opening' : ''}`}>
                    <span className="world-orbit orbit-one" />
                    <span className="world-orbit orbit-two" />
                    <div className="world-note top-note">
                      <span>место, где тебе рады</span>
                      <svg viewBox="0 0 67 40" aria-hidden="true">
                        <path d="M2 3q52-2 55 29m-10-8 10 9 7-11" />
                      </svg>
                    </div>
                    <WorldIllustration welcome={isWelcome} onSecret={notify} />
                    {isWelcome ? (
                      <>
                        <div className="khitrik-name">
                          <span>это {giftConfig.catName}</span>
                          <small>он очень ждал тебя</small>
                          <svg viewBox="0 0 58 47" aria-hidden="true">
                            <path d="M53 42Q6 47 8 5m-6 8 6-9 9 7" />
                          </svg>
                        </div>
                        <div className="world-badge">
                          <Doodle name="mail" size={25} />
                          <span>
                            особенная доставка
                            <br />
                            <strong>для тебя ♡</strong>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="map-hotspots">
                        {active.map((d) => (
                          <button
                            key={d.id}
                            className={`map-pin pin-${d.id} ${progress.stars.includes(d.id) ? 'visited' : ''}`}
                            onClick={() => navigate(d.id)}
                            aria-label={`Посетить: ${d.name}`}
                          >
                            <Doodle name={d.icon} size={20} />
                            <span>{d.subtitle}</span>
                            {progress.stars.includes(d.id) ? (
                              <Check size={12} />
                            ) : (
                              <span className="pin-dot" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="world-coordinate">
                      52° ТЕПЛОТЫ · 100% МАЛЕНЬКОГО ВОЛШЕБСТВА
                    </span>
                  </div>
                </section>
                <section className="journey" aria-label="Карта приключения">
                  <div className="journey-heading">
                    <span>
                      <Sparkles size={15} />
                      {isWelcome ? 'Впереди — пять маленьких чудес' : 'Куда отправимся?'}
                    </span>
                    <span>
                      {isWelcome
                        ? 'И один очень тёплый секрет'
                        : 'можно исследовать в любом порядке'}
                      <span className="handwritten-arrow">↴</span>
                    </span>
                  </div>
                  <div className="journey-path">
                    {active.map((d, i) => (
                      <button
                        key={d.id}
                        className={`journey-stop ${progress.stars.includes(d.id) ? 'done' : ''}`}
                        onClick={() => {
                          if (!progress.started) setProgress((p) => ({ ...p, started: true }))
                          navigate(d.id)
                        }}
                      >
                        <span
                          className="stop-illustration"
                          style={{ '--stop-color': d.color } as React.CSSProperties}
                        >
                          <Doodle name={d.icon} size={39} />
                          {progress.stars.includes(d.id) && (
                            <span className="stop-check">
                              <Check size={10} />
                            </span>
                          )}
                        </span>
                        <span className="stop-copy">
                          <span className="stop-number">0{i + 1}</span>
                          <strong>{d.name}</strong>
                        </span>
                        <ChevronRight size={13} className="stop-arrow" />
                      </button>
                    ))}
                    <button
                      className={`journey-garden ${complete ? 'unlocked' : ''}`}
                      onClick={() =>
                        complete
                          ? navigate('garden')
                          : notify('Секретный сад откроется, когда найдутся все звёздочки ♡')
                      }
                      aria-label={
                        complete ? 'Открыть секретный сад' : 'Секретный сад: нужны все звёздочки'
                      }
                    >
                      <Doodle name="gift" size={34} />
                      <span>
                        {complete ? 'Секретный сад' : 'Твой секрет'}
                        {complete ? <ArrowRight size={12} /> : <LockKeyhole size={12} />}
                      </span>
                    </button>
                  </div>
                </section>
                {isMap && (
                  <div className="map-lower">
                    <span>
                      <Doodle name="flower" size={24} />
                      Маленькая подсказка: у этого мира есть секретики. Попробуй потрогать облачко.
                    </span>
                    {progress.finished && (
                      <button className="text-button" onClick={() => navigate('letter')}>
                        перечитать главное письмо <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            {screen === 'arcade' && (
              <Suspense
                fallback={
                  <div className="arcade-loading">
                    <Doodle name="shield" size={70} />
                    <p>рыцарка раскладывает клубнички…</p>
                  </div>
                }
              >
                <ArcadeScene notify={notify} />
              </Suspense>
            )}
            {isMap && giftConfig.arcade.enabled && (
              <section className="world-bonus" aria-label="Игровой уголок котика-рыцаря">
                <div className="bonus-knight">
                  <Character kind="knight" onSecret={notify} />
                </div>
                <div>
                  <span className="eyebrow">ЕЩЁ НЕМНОГО ВРЕМЕНИ ДЛЯ НАС</span>
                  <h2>{giftConfig.arcade.invitationTitle}</h2>
                  <p>{giftConfig.arcade.invitationText}</p>
                </div>
                <PrimaryButton onClick={() => navigate('arcade')}>в игровой уголок</PrimaryButton>
              </section>
            )}
            {screen === 'story' && <StoryScene {...sceneProps} />}
            {screen === 'game' && <CatchGame {...sceneProps} />}
            {screen === 'mail' && (
              <MailScene
                {...sceneProps}
                markLetter={(i) =>
                  setProgress((p) => ({
                    ...p,
                    letters: p.letters.includes(i) ? p.letters : [...p.letters, i],
                  }))
                }
              />
            )}
            {screen === 'album' && <AlbumScene {...sceneProps} />}
            {screen === 'sky' && <SkyScene {...sceneProps} />}
            {screen === 'garden' && (
              <GardenScene onLetter={() => navigate('letter')} notify={notify} />
            )}
            {screen === 'letter' && (
              <LetterScene onFinish={finish} onBack={() => navigate('garden')} notify={notify} />
            )}
            {screen === 'finale' && (
              <FinaleScene
                onArcade={giftConfig.arcade.enabled ? () => navigate('arcade') : undefined}
                onLetter={() => navigate('letter')}
                onMap={() => navigate('world')}
                notify={notify}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="site-footer">
        <span>
          <Heart size={12} />1 месяц общения · маленькое начало чего-то хорошего
        </span>
        <div>
          {progress.started ? (
            <>
              <button onClick={() => navigate('world')}>
                <Map size={13} />
                карта мира
              </button>
              <span className="footer-dot">·</span>
              <button onClick={() => setResetOpen(true)}>
                <RotateCcw size={12} />
                посмотреть всё сначала
              </button>
            </>
          ) : (
            <span>
              {giftConfig.catName} и твоя маленькая рыцарка уже здесь. Не хватает только тебя.
            </span>
          )}
        </div>
      </footer>
      {!storageOkay && (
        <p className="storage-warning" role="status">
          Браузер не разрешил сохранить прогресс. В этой вкладке всё работает; после закрытия
          звёздочки могут потеряться.
        </p>
      )}
      <Toast message={toast} />
      <Confetti seed={confetti} />
      {reward && (
        <Reward
          name={reward}
          onClose={() => {
            setReward('')
            navigate('world')
          }}
        />
      )}
      {resetOpen && (
        <Dialog
          title="Начать сначала?"
          onClose={() => setResetOpen(false)}
          className="reset-dialog"
        >
          <Doodle name="cloud" size={68} />
          <h2>Ещё одно маленькое начало?</h2>
          <p>
            Звёздочки и отметки о прочитанных письмах исчезнут. Сам мир и все сюрпризы останутся на
            месте.
          </p>
          <PrimaryButton
            onClick={() => {
              setProgress({ ...emptyProgress, stars: [], letters: [] })
              setScreen('welcome')
              setResetOpen(false)
              setConfetti(0)
            }}
          >
            да, начнём сначала
          </PrimaryButton>
          <button className="text-button" onClick={() => setResetOpen(false)}>
            оставить мои звёздочки
          </button>
        </Dialog>
      )}
    </div>
  )
}
