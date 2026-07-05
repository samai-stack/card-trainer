// Тренировка вводом с клавиатуры: пользователь печатает ответ,
// каждая буква сразу подсвечивается (верно/неверно) по сравнению с правильным словом.
// Компонент нужно монтировать заново на каждую карточку (передавать key={card.id} снаружи) —
// тогда внутреннее состояние (введённый текст, фаза) само сбрасывается для нового слова
import { useState } from 'react'
import { isPhotoImage } from '../storage/imageUtils'
import styles from './TypingCard.module.css'

function normalize(str) {
  return str.trim().toLowerCase()
}

export function TypingCard({ prompt, answer, example, image, onResult }) {
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' — вводим, 'result' — показан результат
  const [wasCorrect, setWasCorrect] = useState(false)

  function handleCheck() {
    if (phase !== 'typing' || !value.trim()) return
    setWasCorrect(normalize(value) === normalize(answer))
    setPhase('result')
  }

  function handleGiveUp() {
    if (phase !== 'typing') return
    setWasCorrect(false)
    setPhase('result')
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCheck()
    }
  }

  return (
    <div className={styles.wrapper}>
      {image &&
        (isPhotoImage(image) ? (
          <img src={image} alt="" className={styles.cardImage} />
        ) : (
          <span className={styles.cardImageEmoji}>{image}</span>
        ))}
      <div className={styles.prompt}>{prompt}</div>

      <div className={styles.letters} aria-hidden="true">
        {answer.split('').map((ch, i) => {
          if (ch === ' ') {
            return <span key={i} className={styles.space} />
          }
          const typedChar = value[i]
          let state = styles.letterEmpty
          if (phase === 'result') {
            state = wasCorrect ? styles.letterCorrect : styles.letterWrong
          } else if (typedChar) {
            state = typedChar.toLowerCase() === ch.toLowerCase() ? styles.letterCorrect : styles.letterWrong
          }
          const shown = phase === 'result' ? ch : typedChar || ''
          return (
            <span key={i} className={`${styles.letter} ${state}`}>
              {shown}
            </span>
          )
        })}
      </div>

      {phase === 'typing' ? (
        <>
          <input
            className={styles.input}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Введите слово…"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className={styles.actions}>
            <button type="button" className={styles.giveUpBtn} onClick={handleGiveUp}>
              Не знаю
            </button>
            <button
              type="button"
              className={styles.checkBtn}
              disabled={!value.trim()}
              onClick={handleCheck}
            >
              Проверить <span className={styles.key}>Enter</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={wasCorrect ? styles.resultCorrect : styles.resultWrong}>
            {wasCorrect ? '✅ Верно!' : `Правильный ответ: «${answer}»`}
          </div>
          {example && <div className={styles.example}>«{example}»</div>}
          <button
            type="button"
            className={styles.nextBtn}
            autoFocus
            onClick={() => onResult(wasCorrect)}
          >
            Далее <span className={styles.key}>Enter</span>
          </button>
        </>
      )}
    </div>
  )
}
