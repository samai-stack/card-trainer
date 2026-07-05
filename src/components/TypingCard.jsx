// Тренировка вводом с клавиатуры: пользователь печатает ответ,
// каждая буква сразу подсвечивается (верно/неверно) по сравнению с правильным словом.
// Компонент нужно монтировать заново на каждую карточку (передавать key={card.id} снаружи) —
// тогда внутреннее состояние (введённый текст, фаза) само сбрасывается для нового слова
import { useEffect, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { isPhotoImage } from '../storage/imageUtils'
import { isSpeechSupported, speak } from '../storage/speech'
import styles from './TypingCard.module.css'

function normalize(str) {
  return str.trim().toLowerCase()
}

// audioText — если задан, карточка работает в режиме аудирования: вместо текста-подсказки
// проигрывается озвучка этого текста (слово всегда произносится по-английски), а answer —
// то, что нужно напечатать (перевод либо то же слово — для диктанта на слух)
export function TypingCard({ prompt, audioText, answer, example, image, placeholder, onResult }) {
  const { t } = useAppData()
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' — вводим, 'result' — показан результат
  const [wasCorrect, setWasCorrect] = useState(false)

  // Проигрываем озвучку автоматически при появлении новой карточки (компонент
  // монтируется заново на каждое слово благодаря key={card.id} у вызывающей стороны)
  useEffect(() => {
    if (audioText) speak(audioText)
  }, [audioText])

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
      {/* Картинку в режиме аудирования показываем только после ответа — до этого она была бы подсказкой */}
      {image &&
        (phase === 'result' || !audioText) &&
        (isPhotoImage(image) ? (
          <img src={image} alt="" className={styles.cardImage} />
        ) : (
          <span className={styles.cardImageEmoji}>{image}</span>
        ))}

      {audioText ? (
        <div className={styles.audioPrompt}>
          {isSpeechSupported ? (
            <button type="button" className={styles.replayBtn} onClick={() => speak(audioText)}>
              🔊 {t('listening.replay')}
            </button>
          ) : (
            // Озвучка не поддерживается браузером — честно показываем слово текстом,
            // чтобы упражнение всё равно можно было пройти
            <>
              <div className={styles.prompt}>{audioText}</div>
              <p className={styles.unsupported}>{t('listening.unsupported')}</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.prompt}>{prompt}</div>
      )}

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
            placeholder={placeholder || t('typing.placeholder')}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className={styles.actions}>
            <button type="button" className={styles.giveUpBtn} onClick={handleGiveUp}>
              {t('typing.giveUp')}
            </button>
            <button
              type="button"
              className={styles.checkBtn}
              disabled={!value.trim()}
              onClick={handleCheck}
            >
              {t('typing.check')} <span className={styles.key}>Enter</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={wasCorrect ? styles.resultCorrect : styles.resultWrong}>
            {wasCorrect ? t('typing.correct') : t('typing.wrongAnswer', { answer })}
          </div>
          {audioText && audioText !== answer && (
            <div className={styles.heardWord}>{t('listening.heardWord', { word: audioText })}</div>
          )}
          {example && <div className={styles.example}>«{example}»</div>}
          <button
            type="button"
            className={styles.nextBtn}
            autoFocus
            onClick={() => onResult(wasCorrect)}
          >
            {t('typing.next')} <span className={styles.key}>Enter</span>
          </button>
        </>
      )}
    </div>
  )
}
