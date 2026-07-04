// Режим тренировки: показ карточек, переворот, ответы «Знаю» / «Не знаю»
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Flashcard } from '../components/Flashcard'
import { TypingCard } from '../components/TypingCard'
import { isDue, isNewCard, MAX_NEW_CARDS_PER_SESSION, todayStr } from '../storage/leitner'
import styles from './TrainingPage.module.css'

// Перемешать массив (алгоритм Фишера-Йейтса), не трогая исходный массив
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Собрать очередь слов для сессии: просроченные к повторению + новые (не больше лимита).
// Если по расписанию повторять нечего, но в колоде есть слова — даём потренироваться
// свободно всеми словами колоды, чтобы можно было начать тренировку в любой момент
function buildSessionQueue(cards) {
  const today = todayStr()
  const due = cards.filter((c) => isDue(c, today) && !isNewCard(c))
  const fresh = cards.filter((c) => isNewCard(c)).slice(0, MAX_NEW_CARDS_PER_SESSION)
  const scheduled = [...due, ...fresh]
  const isFreePractice = scheduled.length === 0 && cards.length > 0
  const list = shuffle(isFreePractice ? cards : scheduled)
  return {
    cardsById: new Map(list.map((c) => [c.id, c])),
    queue: list.map((c) => c.id),
    total: list.length,
    isFreePractice,
  }
}

const EMPTY_SESSION = { cardsById: new Map(), queue: [], total: 0, isFreePractice: false }

// Должно быть чуть больше длительности CSS-анимации переворота в Flashcard.module.css (0.5s),
// чтобы карточка успела визуально вернуться на «лицевую» сторону, прежде чем подставится новое слово
const FLIP_BACK_DELAY_MS = 550

export function TrainingPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { decks, answerCard } = useAppData()
  const deck = decks.find((d) => d.id === deckId)
  // Направление и способ ответа задаются ссылкой со страницы колоды:
  // ?dir=reverse — перевод → слово, ?mode=type — ввод с клавиатуры вместо переворота карточки
  const isReverse = searchParams.get('dir') === 'reverse'
  const isTyping = searchParams.get('mode') === 'type'

  const [session, setSession] = useState(() => (deck ? buildSessionQueue(deck.cards) : EMPTY_SESSION))
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })
  const [completedIds, setCompletedIds] = useState(() => new Set())
  // Пока true — карточка ещё анимированно возвращается на лицевую сторону,
  // новое слово подставлять рано (иначе мелькнёт ответ следующей карточки)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimeoutRef = useRef(null)

  const currentCard = session.queue.length > 0 ? session.cardsById.get(session.queue[0]) : null

  // Не оставляем висящий таймер при уходе со страницы или смене колоды
  useEffect(() => {
    return () => clearTimeout(transitionTimeoutRef.current)
  }, [])

  const handleAnswer = useCallback(
    (isCorrect) => {
      if (!currentCard || !deck || isTransitioning) return
      answerCard(deck.id, currentCard.id, isCorrect)
      setStats((s) => (isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 }))
      if (isCorrect) {
        setCompletedIds((prev) => new Set(prev).add(currentCard.id))
      }

      // Сначала переворачиваем карточку обратно и только по завершении анимации
      // меняем слово в очереди — иначе перевод следующего слова мелькнёт раньше времени
      setIsFlipped(false)
      setIsTransitioning(true)
      transitionTimeoutRef.current = setTimeout(() => {
        setSession((prev) => {
          const [, ...rest] = prev.queue
          return { ...prev, queue: isCorrect ? rest : [...rest, currentCard.id] }
        })
        setIsTransitioning(false)
      }, FLIP_BACK_DELAY_MS)
    },
    [currentCard, deck, answerCard, isTransitioning]
  )

  // Для режима ввода с клавиатуры результат уже показан внутри TypingCard (правильный ответ виден
  // пользователю до перехода дальше), поэтому здесь можно сразу переходить к следующему слову —
  // задержка, как при перевороте карточки, не нужна
  const handleTypingResult = useCallback(
    (isCorrect) => {
      if (!currentCard || !deck) return
      answerCard(deck.id, currentCard.id, isCorrect)
      setStats((s) => (isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 }))
      if (isCorrect) {
        setCompletedIds((prev) => new Set(prev).add(currentCard.id))
      }
      setSession((prev) => {
        const [, ...rest] = prev.queue
        return { ...prev, queue: isCorrect ? rest : [...rest, currentCard.id] }
      })
    },
    [currentCard, deck, answerCard]
  )

  function restartSession() {
    if (!deck) return
    clearTimeout(transitionTimeoutRef.current)
    setSession(buildSessionQueue(deck.cards))
    setStats({ correct: 0, wrong: 0 })
    setCompletedIds(new Set())
    setIsFlipped(false)
    setIsTransitioning(false)
  }

  // Горячие клавиши для режима карточек: пробел — перевернуть, 1 — «не знаю», 2 — «знаю».
  // В режиме ввода с клавиатуры они не нужны — там управление через Enter внутри поля ввода
  useEffect(() => {
    if (isTyping) return
    function onKeyDown(e) {
      if (!currentCard || isTransitioning) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!isFlipped) setIsFlipped(true)
      } else if (isFlipped && e.key === '1') {
        handleAnswer(false)
      } else if (isFlipped && e.key === '2') {
        handleAnswer(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentCard, isFlipped, isTransitioning, handleAnswer, isTyping])

  if (!deck) {
    return (
      <div className={styles.center}>
        <p>Такая колода не найдена.</p>
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    )
  }

  if (session.total === 0) {
    return (
      <div className={styles.center}>
        <p className={styles.bigIcon}>🗂️</p>
        <h2>В этой колоде пока нет слов</h2>
        <p className={styles.hintText}>Добавьте несколько слов, чтобы начать тренировку.</p>
        <Link to={`/deck/${deck.id}`} className="btn btn-primary">
          К колоде
        </Link>
      </div>
    )
  }

  // Экран завершения сессии
  if (session.queue.length === 0) {
    return (
      <div className={styles.center}>
        <p className={styles.bigIcon}>✅</p>
        <h2>Сессия завершена</h2>
        <p className={styles.summaryLine}>Слов повторено: {session.total}</p>
        <div className={styles.summaryRow}>
          <span className={styles.know}>Знаю: {stats.correct}</span>
          <span className={styles.dontKnow}>Не знаю: {stats.wrong}</span>
        </div>
        <div className={styles.summaryActions}>
          <button type="button" className="btn" onClick={() => navigate(`/deck/${deck.id}`)}>
            На главную
          </button>
          <button type="button" className="btn btn-primary" onClick={restartSession}>
            Ещё раз
          </button>
        </div>
      </div>
    )
  }

  const doneCount = completedIds.size
  const progressPercent = Math.round((doneCount / session.total) * 100)

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.progressBlock}>
          <div className={styles.progressLabel}>
            {doneCount} / {session.total}
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <span className={styles.modeBadge}>
          {isReverse ? 'Перевод → слово' : 'Слово → перевод'}
          {isTyping ? ' · ввод' : ''}
        </span>
        {session.isFreePractice && (
          <span className={styles.modeBadge} title="Сегодня по расписанию повторять нечего — тренируемся всеми словами колоды">
            🔁 Свободная тренировка
          </span>
        )}
        <Link to={`/deck/${deck.id}`} className={styles.exitLink}>
          Завершить
        </Link>
      </div>

      <div className={styles.cardArea}>
        {isTyping ? (
          <TypingCard
            key={currentCard.id}
            prompt={isReverse ? currentCard.translation : currentCard.word}
            answer={isReverse ? currentCard.word : currentCard.translation}
            example={currentCard.example}
            onResult={handleTypingResult}
          />
        ) : (
          <Flashcard
            frontText={isReverse ? currentCard.translation : currentCard.word}
            backText={isReverse ? currentCard.word : currentCard.translation}
            example={currentCard.example}
            isFlipped={isFlipped}
            onFlip={() => !isTransitioning && setIsFlipped(true)}
          />
        )}
      </div>

      {!isTyping && (
        <div className={styles.answerArea}>
          {!isFlipped ? (
            <p className={styles.hintText}>Нажмите на карточку или пробел, чтобы увидеть перевод</p>
          ) : (
            <div className={styles.answerButtons}>
              <button type="button" className={styles.dontKnowBtn} onClick={() => handleAnswer(false)}>
                Не знаю <span className={styles.key}>1</span>
              </button>
              <button type="button" className={styles.knowBtn} onClick={() => handleAnswer(true)}>
                Знаю <span className={styles.key}>2</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
