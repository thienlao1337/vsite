import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react'
import { giftConfig } from '../config'
import { sound } from '../lib/audio'
import { elapsed } from '../lib/time'
import { Character, Doodle, Friends, WorldIllustration } from './Art'
import { PrimaryButton } from './UI'

export function TimeWidget() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(id)
  }, [])
  const time = elapsed(giftConfig.startDate, giftConfig.timeZone, now)
  return (
    <div className="time-widget">
      <Doodle name="heart" size={23} />
      {time ? (
        <div>
          <span>с нашего знакомства</span>
          <p>
            <strong>{time.days}</strong> дн. <strong>{time.hours}</strong> ч.{' '}
            <strong>{time.minutes}</strong> мин.
          </p>
        </div>
      ) : (
        <div>
          <span>у каждой истории своё начало</span>
          <p>
            а у нашей — <strong>1 месяц общения</strong>
          </p>
        </div>
      )}
      <span className="tiny-spark">✧</span>
    </div>
  )
}

function shuffled(size: number) {
  const values = Array.from({ length: size }, (_, i) => i)
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  return values
}
export function ComplimentMachine({ notify }: { notify: (s: string) => void }) {
  const [index, setIndex] = useState<number | null>(null),
    [count, setCount] = useState(0)
  const bag = useRef<number[]>([]),
    previous = useRef(-1)
  const dispense = () => {
    if (!bag.current.length) {
      bag.current = shuffled(giftConfig.compliments.length)
      if (bag.current[bag.current.length - 1] === previous.current && bag.current.length > 1)
        [bag.current[0], bag.current[bag.current.length - 1]] = [
          bag.current[bag.current.length - 1],
          bag.current[0],
        ]
    }
    const next = bag.current.pop() ?? 0
    previous.current = next
    setIndex(next)
    setCount((c) => c + 1)
    void sound('letter')
  }
  return (
    <div className="compliment-area">
      <div className="compliment-machine">
        <div className="machine-top">
          <Doodle name="heart" size={42} />
          <span>
            хорошее
            <br />
            настроение
          </span>
          <button
            className="bear-secret"
            aria-label="Спросить комплимент у мишки"
            onClick={() => {
              dispense()
              notify('мишка нашёл для тебя добрые слова ♡')
            }}
          >
            <Doodle name="bear" size={40} />
          </button>
        </div>
        <div className="machine-slot" />
        <div className="machine-paper-area">
          <AnimatePresence mode="wait">
            {index !== null ? (
              <motion.div
                role="status"
                key={count}
                className="compliment-ticket"
                data-serial={count}
                initial={{ y: -16, opacity: 0, scaleY: 0.8 }}
                animate={{ y: 0, opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0 }}
              >
                <Doodle name="spark" size={21} />
                <p>{giftConfig.compliments[index]}</p>
                <span>действительно бессрочно ♡</span>
              </motion.div>
            ) : (
              <div className="compliment-placeholder">
                одна кнопочка —<br />
                одна маленькая улыбка
              </div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={dispense} className="machine-button">
          получить комплиментик <Heart size={15} />
        </button>
        <span className="machine-feet" />
      </div>
    </div>
  )
}

export function GardenScene({
  onLetter,
  notify,
}: {
  onLetter: () => void
  notify: (s: string) => void
}) {
  const [opening, setOpening] = useState(false)
  return (
    <section className="garden-scene">
      <div className="garden-intro">
        <span className="eyebrow">ПЯТЬ ЗВЁЗДОЧЕК. ОДИН ОСОБЕННЫЙ ПОДАРОК.</span>
        <h1 tabIndex={-1}>
          Всё самое тёплое — <em>для тебя</em>
        </h1>
        <p>
          Ты нашла все звёздочки! Они привели нас в секретный сад.
          <br />
          Здесь тебя ждёт то, ради чего всё и затевалось.
        </p>
      </div>
      <div className="garden-main">
        <div className={`garden-world ${opening ? 'gift-opening' : ''}`}>
          <WorldIllustration garden onSecret={notify} />
          {opening && (
            <div className="gift-opening-glow">
              <Doodle name="heart" size={55} />
              <Doodle name="star" size={40} />
            </div>
          )}
          <span className="garden-caption">тут даже цветы немного волнуются…</span>
        </div>
        <div className="garden-gift">
          <span className="handwritten">это тебе, маленькое чудо</span>
          <motion.button
            className="big-gift"
            aria-label="Открыть главный подарок"
            animate={opening ? { rotate: [-2, 2, -2, 0], scale: 1.08 } : { rotate: [-2, 2, -2] }}
            transition={{ duration: opening ? 0.5 : 5, repeat: opening ? 0 : Infinity }}
            onClick={() => {
              if (opening) return
              setOpening(true)
              void sound('gift')
              setTimeout(onLetter, 600)
            }}
          >
            <Doodle name="gift" size={156} />
            <span className="gift-spark spark-a">✧</span>
            <span className="gift-spark spark-b">✦</span>
          </motion.button>
          <h2>
            Осталось открыть
            <br />
            самое главное
          </h2>
          <p>
            Маленькое письмо.
            <br />И много-много тепла внутри.
          </p>
          <PrimaryButton
            disabled={opening}
            onClick={() => {
              setOpening(true)
              void sound('gift')
              setTimeout(onLetter, 600)
            }}
          >
            открыть последний подарочек
          </PrimaryButton>
        </div>
      </div>
      <div className="garden-extras">
        <div>
          <span className="eyebrow">ЕЩЁ ОДИН МАЛЕНЬКИЙ СЮРПРИЗ</span>
          <h2>Запас добрых слов</h2>
          <p>
            Когда хочется ещё капельку тепла.
            <br />
            Можно возвращаться сколько угодно.
          </p>
          <TimeWidget />
        </div>
        <ComplimentMachine notify={notify} />
      </div>
      {giftConfig.femboyStyle && (
        <div className="hit-rik-club">
          <div>
            <span className="eyebrow">БАНТИКИ НАДЕТЫ. МОЖНО БЫТЬ СОБОЙ.</span>
            <h2>{giftConfig.vocabulary.clubTitle}</h2>
            <p>{giftConfig.vocabulary.clubText}</p>
            <button
              className="text-button"
              onClick={() => notify('хитруня, тебе здесь всегда рады. мур-мур ♡')}
            >
              секретное приветствие хитриков <Heart size={15} />
            </button>
          </div>
          <div className="club-cat">
            <Character onSecret={notify} />
            <span>{giftConfig.vocabulary.petCat} ♡</span>
          </div>
        </div>
      )}
    </section>
  )
}

export function LetterScene({
  onFinish,
  onBack,
  notify,
}: {
  onFinish: () => void
  onBack: () => void
  notify: (s: string) => void
}) {
  return (
    <section className="letter-scene">
      <button className="text-button letter-back" onClick={onBack}>
        <ArrowLeft size={15} />в секретный сад
      </button>
      <article className="main-letter">
        <div className="letter-flower flower-left">
          <Doodle name="flower" size={70} />
        </div>
        <div className="letter-flower flower-right">
          <Doodle name="flower" size={55} />
        </div>
        <span className="eyebrow">НЕБОЛЬШОЕ ПИСЬМО. ОТ ВСЕГО СЕРДЦА.</span>
        <h1 tabIndex={-1}>
          {giftConfig.girlName
            ? `Для тебя, ${giftConfig.girlName}`
            : `Для тебя, ${giftConfig.girlNickname}`}
        </h1>
        <div className="letter-divider">
          <span />
          <Doodle name="heart" size={24} />
          <span />
        </div>
        <div className="letter-paragraphs">
          {giftConfig.letterText.split(/\n\s*\n/).map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px 30px 0px' }}
              transition={{ duration: 0.35 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        <p className="letter-signature">{giftConfig.senderName} ♡</p>
        <Friends onSecret={notify} />
        <span className="letter-postscript">некоторые люди делают мир чуточку уютнее</span>
      </article>
      <PrimaryButton onClick={onFinish}>бережно сохранить в сердечке</PrimaryButton>
    </section>
  )
}

export function FinaleScene({
  onLetter,
  onMap,
  onArcade,
  notify,
}: {
  onLetter: () => void
  onMap: () => void
  onArcade?: () => void
  notify: (s: string) => void
}) {
  const [hug, setHug] = useState(0)
  return (
    <section className="finale-scene">
      <span className="eyebrow">ЭТО ТОЛЬКО НАЧАЛО НАШЕЙ МАЛЕНЬКОЙ ИСТОРИИ</span>
      <h1 tabIndex={-1}>
        С нашим первым
        <br />
        <em>месяцем общения</em> ♡
      </h1>
      <p>Спасибо, что ты появилась в моей жизни, {giftConfig.girlNickname}.</p>
      <div className="finale-friends" key={hug}>
        <Friends sleeping={!hug} hug={hug > 0} onSecret={notify} />
        <span className="finale-star star-left">✧</span>
        <span className="finale-star star-right">✧</span>
      </div>
      <p className="hug-message" aria-live="polite">
        {hug ? 'обнимашка успешно доставлена! ♡' : 'кажется, кое-чего ещё не хватает…'}
      </p>
      <PrimaryButton
        onClick={() => {
          setHug((h) => h + 1)
          void sound('star')
        }}
      >
        {hug ? 'ещё раз обнять котиков' : 'отправить обнимашку'}
        <Heart size={17} />
      </PrimaryButton>
      <div className="finale-actions">
        <button className="text-button" onClick={onLetter}>
          <Doodle name="mail" size={20} />
          перечитать письмецо
        </button>
        <button className="text-button" onClick={onMap}>
          <RotateCcw size={16} />
          погулять по нашему миру
        </button>
      </div>
      {onArcade && (
        <button className="text-button finale-arcade" onClick={onArcade}>
          <Doodle name="shield" size={21} />
          {giftConfig.arcade.invitationTitle}
        </button>
      )}
      <TimeWidget />
      <span className="finale-note">
        это всего лишь маленький сайт,
        <br />
        но я делал его с большой теплотой
      </span>
      <Character className="finale-tiny-cat" onSecret={notify} />
    </section>
  )
}
