import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { giftConfig } from '../config'

type IconName =
  | 'bow'
  | 'gem'
  | 'shield'
  | 'crown'
  | 'paw'
  | 'heart'
  | 'star'
  | 'book'
  | 'berry'
  | 'mail'
  | 'camera'
  | 'moon'
  | 'flower'
  | 'gift'
  | 'cloud'
  | 'bear'
  | 'spark'
export function Doodle({
  name,
  size = 40,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const paths: Record<IconName, React.ReactNode> = {
    bow: (
      <>
        <path d="M21 20Q-2 1 6 30q5 11 17-4 17 20 21-2 3-22-18-4Z" fill="#d9b8df" />
        <circle cx="24" cy="23" r="5" fill="#c59bca" />
        <path d="m20 28-7 16 11-5 7 6-3-17" fill="#e6c6e8" />
      </>
    ),
    gem: (
      <>
        <path d="m13 8 23 0 9 14-21 23L3 22Z" fill="#cdbbe8" />
        <path
          d="m13 8 4 14 7 23 7-23 5-14M3 22h42m-32-14 11 14L36 8"
          fill="none"
          stroke="#af97ce"
        />
        <path d="m11 18 4-6m16 20 6-7" stroke="#f9f2ff" strokeWidth="3" />
      </>
    ),
    shield: (
      <>
        <path d="M24 4 43 13l-3 19q-4 10-16 14Q8 39 6 30L4 13Z" fill="#d4ddd1" />
        <path d="M24 10 36 16l-2 14q-3 7-10 10-11-5-12-13l-1-11Z" fill="#eceddb" />
        <path d="m24 17 3 7 8 1-6 6 1 8-6-5-7 5 1-8-5-6 8-1Z" fill="#dcc58d" strokeWidth="1" />
      </>
    ),
    crown: (
      <>
        <path d="m5 14 11 9 8-17 8 17 11-9-4 27H9Z" fill="#ead39a" />
        <path d="M10 34h29" stroke="#c5a56c" />
        <circle cx="24" cy="28" r="4" fill="#dcadb9" />
        <circle cx="5" cy="13" r="3" fill="#f4e1b6" />
        <circle cx="24" cy="5" r="3" fill="#f4e1b6" />
        <circle cx="43" cy="13" r="3" fill="#f4e1b6" />
      </>
    ),
    paw: (
      <>
        <ellipse cx="24" cy="32" rx="14" ry="11" fill="#9e8caa" />
        <ellipse cx="8" cy="18" rx="5" ry="7" fill="#ad9ab8" transform="rotate(-22 8 18)" />
        <ellipse cx="20" cy="11" rx="5" ry="7" fill="#ad9ab8" />
        <ellipse cx="32" cy="12" rx="5" ry="7" fill="#ad9ab8" />
        <ellipse cx="41" cy="23" rx="5" ry="7" fill="#ad9ab8" transform="rotate(22 41 23)" />
      </>
    ),
    heart: (
      <path
        d="M24 39C18 34 5 25 7 16C9 6 21 8 24 15C28 7 40 7 42 17C44 26 31 35 24 39Z"
        fill="#efb6c7"
      />
    ),
    star: <path d="m24 5 6 12 13 2-10 10 2 14-11-7-12 7 2-14L4 19l14-2Z" fill="#f7dfa1" />,
    book: (
      <>
        <path d="M7 10q10-4 17 2q8-6 17-2v29q-10-5-17 0q-8-5-17 0Z" fill="#fff8ed" />
        <path d="M24 12v27M12 18l7 2m-7 5 7 2m10-7 7-2m-7 9 7-2" />
        <path d="m28 9 4-5 3 5v9l-7 4Z" fill="#edbdcb" />
      </>
    ),
    berry: (
      <>
        <path d="M12 15c-17 8 2 30 12 29s28-24 11-29Z" fill="#eea9b6" />
        <path d="m11 16 9-6 4-8 4 8 10 6-11 1-3 6-5-7Z" fill="#b8cdb0" />
        <path
          d="m15 24 1 2m12-3 1 2m5 4-1 2m-12 4 1 2m-9-6 1 2m11 6 1 1"
          stroke="#fff4de"
          strokeWidth="2.5"
        />
      </>
    ),
    mail: (
      <>
        <rect x="5" y="12" width="38" height="28" rx="5" fill="#f5d6df" />
        <path d="m6 14 18 13 18-13M6 37l14-13m22 13L28 24" />
        <path d="M24 29c-12-7-5-14 0-7 5-7 12 0 0 7Z" fill="#d894aa" />
      </>
    ),
    camera: (
      <>
        <path d="M7 15h9l3-7h11l3 7h8v25H7Z" fill="#c1dacb" />
        <circle cx="24" cy="27" r="9" fill="#fffaf5" />
        <circle cx="24" cy="27" r="5" fill="#d5e5eb" />
        <path d="M35 20h2" />
      </>
    ),
    moon: (
      <>
        <path d="M34 5c-23 10-20 28 6 27C19 54-3 24 17 9c6-4 11-4 17-4Z" fill="#f8e2a6" />
        <path d="m37 9 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1Z" fill="#e1cfe9" />
      </>
    ),
    flower: (
      <>
        <path d="M24 29v16m0-7q-12 1-12-8 8-2 12 8m0-4q8-9 14-6-1 8-14 10" fill="#b6ceb4" />
        <path
          d="M24 9c-7-13-18-1-10 6-14 0-12 15 1 14-7 12 8 18 12 5 8 10 20 0 11-8 14-6 4-20-5-11 0-11-10-14-9-6Z"
          fill="#f2c7d5"
        />
        <circle cx="25" cy="22" r="7" fill="#f5dfad" />
        <path d="M22 22h.1m6 0h.1" strokeWidth="2.5" />
        <path d="M24 25q2 2 4-1" />
      </>
    ),
    gift: (
      <>
        <rect x="9" y="23" width="30" height="22" rx="3" fill="#efc7d8" />
        <rect x="6" y="16" width="36" height="10" rx="3" fill="#f3d7e3" />
        <path d="M21 17C1 10 17-5 24 16c4-21 20-9 4 1M24 17v28" stroke="#c895ae" strokeWidth="3" />
        <path d="m22 18-6 12m10-12 7 12" />
      </>
    ),
    cloud: (
      <>
        <path d="M9 37c-15-3-8-20 1-18C9 4 30 3 33 18c17-2 20 18 4 20Z" fill="#fffaf6" />
        <path d="M18 26q2 3 4 0m7 0q2 3 4 0m-9 6q2 2 4 0" />
        <path d="M13 30h3m19 0h3" stroke="#efb3c7" strokeWidth="3" />
      </>
    ),
    bear: (
      <>
        <circle cx="12" cy="12" r="7" fill="#d9b994" />
        <circle cx="36" cy="12" r="7" fill="#d9b994" />
        <ellipse cx="24" cy="27" rx="20" ry="19" fill="#ebd3ae" />
        <ellipse cx="24" cy="32" rx="10" ry="8" fill="#fff2d9" />
        <path d="M16 25h.1m16 0h.1" strokeWidth="3" />
        <path d="m22 30 2 2 2-2m-2 2v3m-4-1q4 5 8 0" />
      </>
    ),
    spark: (
      <>
        <path d="M24 4q0 20 18 20-18 0-18 20 0-20-18-20Q24 24 24 4Z" fill="#e5c58d" />
        <path d="M40 3v8m-4-4h8" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="#a1867d"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`doodle ${className}`}
      aria-hidden="true"
    >
      {paths[name as IconName] || paths.heart}
    </svg>
  )
}

export function CharacterDrawing({
  bunny = false,
  sleeping = false,
  strawberry = false,
}: {
  bunny?: boolean
  sleeping?: boolean
  strawberry?: boolean
}) {
  return (
    <g
      stroke={bunny ? '#ad9085' : giftConfig.catAppearance.outline}
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {!bunny && (
        <path
          d="M153 188q62 6 32-44-16-12-15 7 25 28-24 19"
          fill={bunny ? '#fffaf0' : giftConfig.catAppearance.fur}
        />
      )}
      <ellipse
        cx="109"
        cy="181"
        rx="51"
        ry="43"
        fill={strawberry ? '#eda7af' : bunny ? '#fff1f0' : giftConfig.catAppearance.fur}
      />
      <ellipse cx="76" cy="213" rx="22" ry="12" fill="#fff8ef" />
      <ellipse cx="139" cy="213" rx="22" ry="12" fill="#fff8ef" />
      {bunny ? (
        <g className="bunny-ears">
          <path d="M63 83C33 2 75-7 85 74" fill="#fff4f1" />
          <path d="M128 74c-2-91 46-74 23 10" fill="#fff4f1" />
          <path
            d="M65 62c-12-39 5-50 10 3m62-2c1-41 16-44 10 1"
            stroke="#edbac9"
            strokeWidth="10"
          />
        </g>
      ) : (
        <>
          <path
            d="M48 88 44 34q-1-13 12-6l39 25m33 0 35-27q11-8 13 8l-1 55"
            fill={giftConfig.catAppearance.fur}
          />
          <path d="m53 63-1-24 23 17m69 0 21-18-1 26" fill="#edb8c4" stroke="none" />
        </>
      )}
      <path
        d="M43 96c3-40 128-52 137 6 13 65-28 81-70 81-48 0-85-21-67-75"
        fill={bunny ? '#fff4f1' : giftConfig.catAppearance.fur}
      />
      <path
        d="m45 124-11 4 10 4m133-8 10 4-10 5"
        fill={bunny ? '#fffaf0' : giftConfig.catAppearance.fur}
      />
      <g className={sleeping ? '' : 'blink'}>
        {sleeping ? (
          <path
            d="M72 117q9 9 18 0m37 0q9 9 18 0"
            fill="none"
            stroke={bunny ? '#ad9085' : '#e6c9dd'}
          />
        ) : (
          <>
            <ellipse
              cx="80"
              cy="113"
              rx="6.5"
              ry="9"
              fill={bunny ? '#614d50' : giftConfig.catAppearance.eyes}
              stroke="none"
            />
            <ellipse
              cx="139"
              cy="113"
              rx="6.5"
              ry="9"
              fill={bunny ? '#614d50' : giftConfig.catAppearance.eyes}
              stroke="none"
            />
            <circle cx="78" cy="110" r="2.2" fill="white" stroke="none" />
            <circle cx="137" cy="110" r="2.2" fill="white" stroke="none" />
          </>
        )}
      </g>
      <ellipse cx="61" cy="131" rx="12" ry="7" fill="#f0b2c0" opacity=".7" stroke="none" />
      <ellipse cx="158" cy="131" rx="12" ry="7" fill="#f0b2c0" opacity=".7" stroke="none" />
      <path d="m106 124 4 3 4-3Z" fill="#cc93a0" stroke="#cc93a0" />
      <path
        d="M110 127v5q-7 9-12 0m12 0q7 9 12 0"
        fill="none"
        stroke={bunny ? '#ad9085' : '#d9b8ce'}
        strokeWidth="2"
      />
      <g fill="#e6a0b5" stroke="#c48d9c">
        <path d="M105 168q-31-23-26 2-4 19 28 1m7-3q29-24 25 2 5 20-27 1" />
        <circle cx="110" cy="170" r="6" />
        <path d="m105 176-9 16 13-5 5 5 1-16" />
      </g>
      <ellipse
        className="waving-paw"
        cx="58"
        cy="171"
        rx="13"
        ry="20"
        transform="rotate(-26 58 171)"
        fill={bunny ? '#fff9f0' : giftConfig.catAppearance.fur}
      />
      <ellipse
        cx="156"
        cy="177"
        rx="12"
        ry="18"
        transform="rotate(25 156 177)"
        fill={bunny ? '#fff9f0' : giftConfig.catAppearance.fur}
      />
      {strawberry && (
        <>
          <path d="m88 163 20-15 24 15-14 1-9 9-8-9Z" fill="#a9bf91" />
          <g stroke="#fff1cf" strokeWidth="3">
            <path d="m85 188 2 3m35-4 2 3m-23 11 2 3m32-5 2 3" />
          </g>
        </>
      )}
      {!bunny && giftConfig.femboyStyle && !strawberry && (
        <g className="khitrik-outfit">
          <path
            d="M77 190q31 10 63 0l18 22q-48 16-99 0Z"
            fill="#d9c6e7"
            stroke="#b49bc4"
            strokeWidth="1.5"
          />
          <path
            d="m84 195-7 18m24-15-2 18m21-18 4 18m12-20 8 17"
            fill="none"
            stroke="#c4acd5"
            strokeWidth="1.5"
          />
          <path d="M62 215h26m-23 6h22m42-6h26m-25 6h21" stroke="#e2afc9" strokeWidth="3" />
          <path
            d="m149 71-13-9v18l13-6 13 7V63Z"
            fill="#dab9da"
            stroke="#b58fae"
            strokeWidth="1.5"
          />
          <circle cx="149" cy="73" r="4" fill="#c298bb" stroke="none" />
        </g>
      )}
      {bunny && (
        <g transform="translate(156 58) rotate(15)">
          <path d="m0 0-15-7v15L0 2l15 6V-6Z" fill="#e4b4c9" />
          <circle r="4" fill="#e4b4c9" />
        </g>
      )}
    </g>
  )
}

/** Golden kitten knight, inspired by the recipient's reference: bow, cape and ceremonial sword. */
export function KnightDrawing({ sleeping = false }: { sleeping?: boolean }) {
  return (
    <g stroke="#9d8c75" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M63 133Q39 143 24 219q34-12 59-3l49-62Z" fill="#e5d6ae" />
      <path d="m56 158-18 45m29-52-13 59" stroke="#c6b78e" fill="none" />
      <ellipse cx="77" cy="219" rx="23" ry="12" fill="#b9c2c0" />
      <ellipse cx="128" cy="219" rx="23" ry="12" fill="#b9c2c0" />
      <path
        d="m64 179-9 30q20 15 42 1l3-25m7 0 1 26q21 13 40-1l-11-32"
        fill="#d1d7ce"
        stroke="#8f9991"
      />
      <path d="m65 198 24 2m27-1 23-2" stroke="#f7f6e4" />
      <path d="M58 142q43-24 83 0l10 55q-46 21-101 1Z" fill="#d5d9cc" stroke="#8b958e" />
      <path d="M72 144q19 28 58 1l3 30q-27 16-62 0Z" fill="#e8e9d9" stroke="#a2a89a" />
      <path d="M56 164q45 24 89 0m-91 21q47 21 92 0" fill="none" stroke="#9a9e8f" />
      <path d="m58 186 82-29 6 11-83 29Z" fill="#9e8064" stroke="#806c56" />
      <rect
        x="88"
        y="178"
        width="15"
        height="12"
        rx="2"
        fill="#dbd2ab"
        stroke="#89765f"
        transform="rotate(-20 95 184)"
      />
      <path
        d="M64 135q-34-8-37 20l23 14q8-9 23-7m56-27q32-9 42 17l-24 16-21-11"
        fill="#d4dacf"
        stroke="#919a92"
      />
      <path d="M35 151q13-7 25-4m79-2 20 5" fill="none" stroke="#f9f6e5" />
      <g fill="#acb4a7" stroke="none">
        <circle cx="42" cy="158" r="2" />
        <circle cx="57" cy="158" r="2" />
        <circle cx="141" cy="155" r="2" />
        <circle cx="156" cy="155" r="2" />
        <circle cx="62" cy="195" r="2" />
        <circle cx="137" cy="193" r="2" />
      </g>
      <path d="M146 146q11 11 28 4l7 13q-26 17-40-1Z" fill="#bcc6bc" stroke="#8d998f" />
      <path d="M45 143q-10 12 1 27l45 8 3-17-32-6" fill="#c5cfc4" stroke="#8d998f" />
      <ellipse cx="102" cy="168" rx="13" ry="11" fill="#b49670" />
      <path d="m94 162 1 12m7-14 1 15m6-13 1 10" stroke="#8b765d" strokeWidth="1.5" />
      <path d="M167 3 176 38l-6 111h-12l1-110Z" fill="#e1e9df" stroke="#899b94" />
      <path d="m167 7-3 132 6 1 4-102Z" fill="#f9faf1" stroke="none" />
      <path d="m145 144 18-7 22 6-2 7-20-3-18 5Z" fill="#c5b585" stroke="#8d815d" />
      <path d="M160 148h9v34h-9Z" fill="#95836a" stroke="#716859" />
      <path d="m160 157 9-4m-9 13 9-4m-9 13 9-4" stroke="#cbb99c" />
      <circle cx="164" cy="185" r="7" fill="#c8ba8c" stroke="#918263" />
      <ellipse cx="158" cy="160" rx="11" ry="12" fill="#b9a07c" />
      <path d="m153 151-1 17m7-18-1 18" stroke="#887459" strokeWidth="1.4" />
      <ellipse cx="48" cy="64" rx="22" ry="26" fill="#b79163" />
      <ellipse cx="127" cy="60" rx="22" ry="25" fill="#b79163" />
      <ellipse cx="48" cy="65" rx="12" ry="16" fill="#dfb8a2" />
      <ellipse cx="127" cy="61" rx="12" ry="16" fill="#dfb8a2" />
      <path
        d="M35 78q1-38 53-37 60-2 67 46 11 56-56 60-66-1-64-50l-8-4 9-7-8-4Z"
        fill="#c6a06c"
        stroke="#a17f59"
      />
      <path
        d="M42 106q7-19 25-8 25 13 55 0 22-9 27 8-9 32-51 33-40-2-56-33Z"
        fill="#eddbb7"
        stroke="none"
      />
      <path
        d="m76 46 5 17m13-19 1 19m14-16-4 16m-70 20 16 4m-17 7 17 3m93-20-12 6m16 3-14 6"
        stroke="#927045"
        strokeWidth="4"
      />
      <g className={sleeping ? '' : 'blink'}>
        {sleeping ? (
          <path d="M56 95q10 8 18 0m38-3q10 8 18-1" fill="none" />
        ) : (
          <>
            <ellipse cx="66" cy="92" rx="10" ry="12" fill="#3c3831" stroke="#ae8b5d" />
            <ellipse cx="119" cy="89" rx="10" ry="12" fill="#3c3831" stroke="#ae8b5d" />
            <circle cx="63" cy="88" r="3" fill="#fffaf1" stroke="none" />
            <circle cx="116" cy="85" r="3" fill="#fffaf1" stroke="none" />
          </>
        )}
      </g>
      <path d="m89 108 5 3 5-4Z" fill="#9e735b" stroke="#9e735b" />
      <path
        d="m94 111 1 5q-6 5-10 1m10-1q6 4 10-2"
        fill="none"
        stroke="#876e58"
        strokeWidth="1.6"
      />
      <ellipse cx="50" cy="109" rx="9" ry="5" fill="#dca5a0" opacity=".7" stroke="none" />
      <ellipse cx="137" cy="105" rx="9" ry="5" fill="#dca5a0" opacity=".7" stroke="none" />
      <g transform="translate(57 53) rotate(-13)" fill="#f5e6c9" stroke="#c4ac88" strokeWidth="1.5">
        <path d="M0 0q-27-19-23 2-3 18 24 1 23-23 24-2 3 20-23 4" />
        <circle r="5" fill="#ecdbb8" />
      </g>
      <path d="m58 130 34 13 32-16 8 8q-39 28-81 6Z" fill="#f0e2c1" stroke="#c9b998" />
    </g>
  )
}

export function Character({
  kind = 'cat',
  sleeping = false,
  className = '',
  onSecret,
}: {
  kind?: 'cat' | 'bunny' | 'knight'
  sleeping?: boolean
  className?: string
  onSecret?: (s: string) => void
}) {
  const [taps, setTaps] = useState(0)
  const [reaction, setReaction] = useState(false)
  const pet = () => {
    setTaps((t) => t + 1)
    setReaction(true)
    onSecret?.(
      kind === 'knight'
        ? 'маленькая рыцарка принимает обнимашку. мр-р ♡'
        : kind === 'bunny'
          ? giftConfig.vocabulary.bunnyReaction
          : (taps + 1) % 5 === 0
            ? 'я теперь клубничный кот!'
            : giftConfig.vocabulary.catReaction,
    )
    setTimeout(() => setReaction(false), 850)
  }
  return (
    <motion.button
      type="button"
      onClick={pet}
      animate={reaction ? { y: [0, -12, 0], rotate: [0, -4, 4, 0] } : { y: 0 }}
      className={`character ${className}`}
      aria-label={
        kind === 'cat'
          ? giftConfig.vocabulary.petCat
          : kind === 'knight'
            ? `Няшить: ${giftConfig.knightName}`
            : 'Потрогать ушко Биби'
      }
    >
      <svg viewBox="0 0 220 240" aria-hidden="true">
        {kind === 'knight' ? (
          <KnightDrawing sleeping={sleeping || reaction} />
        ) : (
          <CharacterDrawing
            bunny={kind === 'bunny'}
            sleeping={sleeping || reaction}
            strawberry={kind === 'cat' && taps > 0 && taps % 5 === 0}
          />
        )}
        {reaction && (
          <g className="pet-heart">
            <path d="M107 52C75 30 94 10 108 29c17-20 36 2-1 23" fill="#e9a7be" stroke="none" />
          </g>
        )}
      </svg>
    </motion.button>
  )
}

function Flower({
  x,
  y,
  scale = 1,
  color = '#edc5d4',
}: {
  x: number
  y: number
  scale?: number
  color?: string
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke="#a8b89b"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 0v30m0-9q-14 2-12-9 11 0 12 9m0-4q10-13 15-8-1 8-15 13" fill="#b5cca6" />
      <g stroke="#c2999c" strokeWidth="1">
        <path
          d="M-1-8C-12-27-27-6-13 0c-22 9-4 25 4 15 7 21 24 7 18-4 22 2 20-17 5-17 3-20-15-17-15-2Z"
          fill={color}
        />
        <circle cy="3" r="8" fill="#f7e0a0" />
        <path d="M-3 2h.1m6 0h.1" stroke="#9e8273" strokeWidth="2.5" />
        <path d="M-2 6q2 2 4 0" fill="none" />
      </g>
    </g>
  )
}
function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 38C-26 27-12-7 13-1 8-41 66-45 74-10c35-13 55 19 37 35 35 0 39 30-3 34L9 59Q-20 58 0 38Z"
        fill="#fffef9"
        stroke="#e8d7ce"
        strokeWidth="1.8"
      />
      <path
        d="M34 25q5 5 10 0m23 0q5 5 10 0m-24 9q4 4 8 0"
        stroke="#b5a29a"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="29" cy="33" rx="7" ry="4" fill="#f2d5d8" />
      <ellipse cx="82" cy="33" rx="7" ry="4" fill="#f2d5d8" />
    </g>
  )
}

export function WorldIllustration({
  onSecret,
  night = false,
  garden = false,
  welcome = false,
}: {
  onSecret?: (s: string) => void
  night?: boolean
  garden?: boolean
  welcome?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const secret = (text: string) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': text,
    onClick: () => onSecret?.(text),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSecret?.(text)
      }
    },
    style: { cursor: 'pointer' },
  })
  return (
    <svg
      className={`world-art ${night ? 'night-art' : ''}`}
      viewBox="0 0 760 600"
      role="img"
      aria-label={
        garden
          ? `Секретный сад с цветущими деревьями, подарком, ${giftConfig.catName}ом и котиком-рыцарем`
          : 'Волшебный остров: клубничный домик, почта, озеро и два пушистых друга'
      }
    >
      <defs>
        <linearGradient id={`${id}-earth`} x2="0" y2="1">
          <stop stopColor="#d9dcb5" />
          <stop offset=".4" stopColor="#c8cda6" />
          <stop offset="1" stopColor="#d9c5b0" />
        </linearGradient>
        <linearGradient id={`${id}-grass`} x2=".2" y2="1">
          <stop stopColor={garden ? '#f1dbd8' : '#e2ebce'} />
          <stop offset="1" stopColor="#cddbb8" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x2="0" y2="1">
          <stop stopColor="#c2ddd9" />
          <stop offset="1" stopColor="#daeae2" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#f5deba" stopOpacity=".45" />
          <stop offset="1" stopColor="#f9e9dc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#b99b9a" floodOpacity=".13" />
        </filter>
      </defs>
      <ellipse cx="390" cy="316" rx="337" ry="260" fill={`url(#${id}-glow)`} />
      <g className="floating-cloud" {...secret('облачко проснулось и посылает сердечко ♡')}>
        <Cloud x={65} y={158} scale={0.66} />
      </g>
      <g className="floating-cloud cloud-delayed" {...secret('ты нашла самое мягкое облачко ♡')}>
        <Cloud x={585} y={90} scale={0.8} />
      </g>
      <g className="tiny-sparkles" fill="#d7bc8e" stroke="#d7bc8e" strokeWidth="1.5">
        <path d="m198 78 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" />
        <path d="m557 157 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
        <path d="m81 315 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        <path d="m651 357 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" />
        <circle cx="280" cy="93" r="2" />
        <circle cx="643" cy="246" r="2.5" />
        <circle cx="120" cy="270" r="2" />
      </g>
      <path d="M121 440c-66 8-45 52 12 52h474c82-4 69-61-9-55Z" fill="#f5e9e5" opacity=".6" />
      <g filter={`url(#${id}-shadow)`}>
        <path
          d="M141 326q-27 87 37 124 70 72 146 76c107 31 160-2 220-58q92-37 73-139Z"
          fill={`url(#${id}-earth)`}
          stroke="#b9c19e"
          strokeWidth="2"
        />
        <path
          d="M153 373q68 15 118 59m-85-3 48 41m284-35 31-33m-268 51 28 47m151-31-21 32"
          stroke="#b8be9f"
          strokeWidth="3"
          opacity=".65"
          strokeLinecap="round"
        />
        <path
          d="M137 310c29-85 133-133 253-123 118-19 218 44 231 112 26 63-82 133-230 139-156 10-286-52-254-128Z"
          fill={`url(#${id}-grass)`}
          stroke="#b5c5a2"
          strokeWidth="2"
        />
        <path
          d="M257 230c63-2 104 26 92 67-18 42-68 65-46 104 15 24 47 27 67 27"
          stroke="#f5e9d3"
          strokeWidth="31"
          fill="none"
        />
        <path d="M348 290q70-38 157-17" stroke="#f5e9d3" strokeWidth="20" fill="none" />
        <path
          d="M311 329c28-4 45 10 61 4s31-18 61-8"
          stroke="#e6d6bb"
          strokeWidth="3"
          fill="none"
          strokeDasharray="1 13"
          strokeLinecap="round"
        />
        <g transform="translate(186 190)" stroke="#ad9185" strokeWidth="2" strokeLinejoin="round">
          <path d="M9 72q7-26 51-29 43 3 51 30v74q-54 28-102-1Z" fill="#ffeddd" />
          <path d="M-2 76c-16-32 8-81 62-88 55 6 80 52 64 86-58-12-64-9-126 2Z" fill="#edacb4" />
          <path
            d="m21 9 18-1L56-11l4 15 18-19-1 25 23-3-14 15-27-9-24 10Z"
            fill="#a9be97"
            stroke="#8fa784"
          />
          <g stroke="#fff0d6" strokeWidth="4" strokeLinecap="round">
            <path d="m15 44 1 3m26-15 1 4m30-10 1 3m29 26 1 4m-46-8 1 4m-38 7 1 4m66 3 1 4" />
          </g>
          <path d="M47 143V104q17-24 32 0v43" fill="#c7d1b4" />
          <path d="M56 114h.1" strokeWidth="4" />
          <rect x="18" y="91" width="21" height="23" rx="10" fill="#f9e9ad" />
          <path d="M28 92v22m-10-11h21" />
          <path d="M90 94v20m-8-10h17" />
          <path d="M0 145q64 17 121-2" fill="none" />
          <path d="M5 148v12m16-7v12m78-13v12m15-16v12" stroke="#d9c9ab" strokeWidth="5" />
        </g>
        <g transform="translate(462 185)" stroke="#a79595" strokeWidth="2" strokeLinejoin="round">
          <path d="M-8 78V34h84v74H-8Z" fill="#fff0e6" />
          <path d="M-24 38 32-12l62 50Z" fill="#c7b5d5" />
          <path d="m-24 38 56-11 62 11" fill="#b7a4c6" />
          <rect x="5" y="53" width="24" height="30" rx="4" fill="#dce7d7" />
          <path d="M17 54v28M6 68h22" />
          <path d="M41 104V68q13-13 24 0v34" fill="#e8bac8" />
          <path d="M53 80h.1" strokeWidth="4" />
          <path d="M20-3V-26h28v33" fill="#f5e7d5" />
          <path d="M17-25h34" />
          <rect x="39" y="42" width="27" height="13" rx="2" fill="#fff6de" />
          <path d="m44 45 9 6 9-6" />
          <path d="M-4 105q17-6 33 3m43-4 12-3" stroke="#96b292" />
        </g>
        <g {...secret('у озера даже мысли становятся тише ♡')}>
          <path
            d="M450 344c-20-32-64-12-68 13-33 9-29 51 17 56 53 20 126-10 127-37-1-32-51-35-76-32Z"
            fill="#adc9bd"
          />
          <path
            d="M448 345c-20-22-54-6-56 16-36 16-16 41 13 42 44 14 101-5 106-25 5-25-37-35-63-33Z"
            fill={`url(#${id}-water)`}
          />
          <path
            d="M403 368h30m25 20h32m-81 2h11m49-33h18"
            stroke="#f5fbf2"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M485 356c-3-10 12-12 13-3 12-6 17 7 5 11Z" fill="#d5e4bd" />
        </g>
        <g transform="translate(554 288)">
          <path d="M0 31V-20" stroke="#ab9581" strokeWidth="8" strokeLinecap="round" />
          <path
            d="M0-48c-41-28-60 24-26 35-18 33 36 44 42 18 42 13 50-38 20-43 15-28-21-37-36-10Z"
            fill="#efc6cd"
            stroke="#ceabad"
            strokeWidth="1.8"
          />
          <g fill="#f9e0dc">
            <circle cx="-12" cy="-22" r="7" />
            <circle cx="21" cy="-29" r="7" />
            <circle cx="7" cy="3" r="6" />
          </g>
        </g>
        <g transform="translate(177 322)">
          <path d="M0 33V-9" stroke="#ab9581" strokeWidth="7" strokeLinecap="round" />
          <path
            d="M-4-38c-31-22-49 16-28 29-12 28 26 37 34 17 37 12 43-28 22-34 10-19-14-33-28-12Z"
            fill="#c2d3ac"
            stroke="#a9bd96"
            strokeWidth="1.8"
          />
          <path d="M-17-11 2-1l17-15" stroke="#a4ba95" strokeWidth="2" fill="none" />
        </g>
        <g {...secret('цветочек танцует специально для тебя ♡')} className="sway-flower">
          <Flower x={225} y={371} scale={0.65} />
        </g>
        <Flower x={245} y={397} scale={0.4} color="#faf0c3" />
        <Flower x={539} y={358} scale={0.55} />
        <Flower x={517} y={408} scale={0.6} color="#faf0c3" />
        <Flower x={577} y={330} scale={0.35} />
        <Flower x={189} y={359} scale={0.35} color="#fff2c6" />
        <Flower x={419} y={236} scale={0.44} />
        <Flower x={373} y={220} scale={0.3} color="#faf0c3" />
        <g fill="#edc9d0" stroke="#c9adb0" strokeWidth="1">
          <path d="M277 370c-13-12-20 3 0 11 20-8 13-23 0-11Z" />
          <path d="M291 396c-10-9-16 2 0 9 16-7 10-18 0-9Z" />
          <path d="M329 411c-10-9-16 2 0 9 16-7 10-18 0-9Z" />
        </g>
        <g transform={welcome ? 'translate(271 226) scale(.68)' : 'translate(296 252) scale(.48)'}>
          <CharacterDrawing />
          <g transform="translate(50 164) rotate(-6)">
            <rect width="113" height="69" rx="7" fill="#f9e6d9" stroke="#bf9d94" strokeWidth="2" />
            <path
              d="m1 3 55 40L112 3M1 67l40-34m70 34L72 32"
              fill="none"
              stroke="#c9aaa0"
              strokeWidth="2"
            />
            <path d="M56 44c-23-14-10-29 0-14 11-15 23 0 0 14Z" fill="#dfa1b6" />
          </g>
        </g>
        <g transform="translate(405 262) scale(.4)">
          <KnightDrawing />
        </g>
        {garden && (
          <g transform="translate(328 300) scale(2.2)">
            <path d="M-14 0h33v28h-33Z" fill="#e6b5c7" stroke="#b48c9e" />
            <path d="M-17-7h39V3h-39Z" fill="#f2d4df" stroke="#b48c9e" />
            <path
              d="M2-7C-20-24-13-30 1-10c8-24 28-14 4 3M2-7v35"
              fill="none"
              stroke="#ba8b9f"
              strokeWidth="2.5"
            />
          </g>
        )}
        <g {...secret('котик в коробке: сюрпри-и-из! ♡')} transform="translate(194 422)">
          <path d="M0 0h31v26H0Z" fill="#e9d1b2" stroke="#bca48d" />
          <path d="m0 0-6-7 18-3 5 10m0 0 11-10 11 3-8 7" fill="#efdfc5" stroke="#bca48d" />
          <path d="M7 1V-9l6 4 7-1 6-4v13" fill="#fff8e9" stroke="#bca48d" />
          <path d="M12-1h.1m8 0h.1" stroke="#987d75" strokeWidth="2" />
        </g>
      </g>
      <g className="floating-cloud cloud-bottom">
        <Cloud x={95} y={468} scale={1.15} />
      </g>
      <g className="floating-cloud cloud-delayed">
        <Cloud x={531} y={456} scale={0.9} />
      </g>
      <g {...secret('ты нашла секретик! ♡')} transform="translate(594 205)">
        <path
          d="m0-18 6 11 13 2-10 9 2 13-11-6-11 6 2-13-10-9 13-2Z"
          fill="#f5dda0"
          stroke="#cfb586"
          strokeWidth="1.5"
        />
        <path d="M-5 1h.1m10 0h.1" stroke="#a68c6d" strokeWidth="3" />
        <path d="M-2 6q3 2 5 0" stroke="#a68c6d" fill="none" />
      </g>
      <path d="M95 418q-17-9-13-20 8-10 16 3 11-11 18-1 6 9-21 18Z" fill="#ecc6cf" opacity=".8" />
      <path d="M604 397q-10-7-7-13 5-6 10 2 7-7 11-1 4 6-14 12Z" fill="#ecc6cf" opacity=".8" />
      <path
        d="M210 529q163 44 330-10"
        stroke="#eadad1"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2 8"
      />
    </svg>
  )
}

export function Friends({
  sleeping = false,
  hug = false,
  onSecret,
}: {
  sleeping?: boolean
  hug?: boolean
  onSecret?: (s: string) => void
}) {
  return (
    <div className={`friends ${hug ? 'hugging' : ''}`}>
      <span className="friends-cloud" />
      <Character sleeping={sleeping} onSecret={onSecret} />
      <Character kind="knight" sleeping={sleeping} onSecret={onSecret} />
      {hug && (
        <div className="hug-hearts">
          <Doodle name="heart" />
          <Doodle name="heart" size={24} />
          <Doodle name="flower" size={34} />
        </div>
      )}
    </div>
  )
}

export function EnvelopeArt({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 170"
      aria-hidden="true"
      className={`envelope-art ${open ? 'is-open' : ''}`}
    >
      <path d="m20 61 90-56 90 56v94H20Z" fill="#e6beca" stroke="#b08e94" strokeWidth="2" />
      <rect
        className="letter-paper"
        x="38"
        y="32"
        width="144"
        height="112"
        rx="5"
        fill="#fffaf0"
        stroke="#cfb8ab"
        strokeWidth="1.5"
      />
      <path d="M62 59h96M62 75h77M62 91h96" stroke="#e1c9c4" strokeWidth="3" />
      <path d="m20 61 90 55 90-55v94H20Z" fill="#f6d7dd" stroke="#b08e94" strokeWidth="2" />
      <path d="m20 155 71-58m109 58-71-58" stroke="#c69ea7" strokeWidth="1.5" />
      {!open && <path d="m20 61 90 65 90-65Z" fill="#f9e1e4" stroke="#b08e94" strokeWidth="2" />}
      <path d="M109 129c-28-17-11-34 1-17 13-17 28 1-1 17" fill="#d59aaf" />
      <path d="m165 26 4 9 9 2-7 6 1 9-7-4-8 4 2-9-7-6 9-2Z" fill="#ead49c" stroke="#bca67b" />
    </svg>
  )
}
