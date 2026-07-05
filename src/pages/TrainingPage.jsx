// Режим тренировки: показ карточек, переворот, 4 варианта ответа (как в Anki):
// «Ещё раз» / «Трудно» / «Хорошо» / «Легко»
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Flashcard } from '../components/Flashcard'
import { TypingCard } from '../components/TypingCard'
import { isDue, isNewCard, MAX_NEW_CARDS_PER_SESSION } from '../storage/leitner'
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
  const due = cards.filter((c) => isDue(c) && !isNewCard(c))
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
const EMPTY_STATS = { again: 0, hard: 0, good: 0, easy: 0 }

// Должно быть чуть больше длительности CSS-анимации переворота в Flashcard.module.css (0.5s),
// чтобы карточка успела визуально вернуться на «лицевую» сторону, прежде чем подставится новое слово
const FLIP_BACK_DELAY_MS = 550

export function TrainingPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { decks, answerCard, t } = useAppData()
  const deck = decks.find((d) => d.id === deckId)
  // Направление и способ ответа задаются ссылкой со страницы колоды:
  // ?dir=reverse — перевод → слово, ?mode=type — ввод с клавиатуры вместо переворота карточки
  const isReverse = searchParams.get('dir') === 'reverse'
  const isTyping = searchParams.get('mode') === 'type'

  const [session, setSession] = useState(() => (deck ? buildSessionQueue(deck.cards) : EMPTY_SESSION))
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState(EMPTY_STATS)
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

  // outcome: 'again' | 'hard' | 'good' | 'easy'
  const handleAnswer = useCallback(
    (outcome) => {
      if (!currentCard || !deck || isTransitioning) return
      const isDone = outcome !== 'again'
      answerCard(deck.id, currentCard.id, outcome)
      setStats((s) => ({ ...s, [outcome]: s[outcome] + 1 }))
      if (isDone) {
        setCompletedIds((prev) => new Set(prev).add(currentCard.id))
      }

      // Сначала переворачиваем карточку обратно и только по завершении анимации
      // меняем слово в очереди — иначе перевод следующего слова мелькнёт раньше времени
      setIsFlipped(false)
      setIsTransitioning(true)
      transitionTimeoutRef.current = setTimeout(() => {
        setSession((prev) => {
          const [, ...rest] = prev.queue
          return { ...prev, queue: isDone ? rest : [...rest, currentCard.id] }
        })
        setIsTransitioning(false)
      }, FLIP_BACK_DELAY_MS)
    },
    [currentCard, deck, answerCard, isTransitioning]
  )

  // Для режима ввода с клавиатуры результат уже показан внутри TypingCard (правильный ответ виден
  // пользователю до перехода дальше), поэтому здесь можно сразу переходить к следующему слову —
  // задержка, как при перевороте карточки, не нужна. Правильный ответ засчитывается как «Хорошо»,
  // неверный (или «сдаюсь») — как «Ещё раз», т.к. в этом режиме нет самооценки сложности
  const handleTypingResult = useCallback(
    (isCorrect) => {
      if (!currentCard || !deck) return
      const outcome = isCorrect ? 'good' : 'again'
      answerCard(deck.id, currentCard.id, outcome)
      setStats((s) => ({ ...s, [outcome]: s[outcome] + 1 }))
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
    setStats(EMPTY_STATS)
    setCompletedIds(new Set())
    setIsFlipped(false)
    setIsTransitioning(false)
  }

  // Горячие клавиши для режима карточек: пробел — перевернуть, 1 — «ещё раз», 2 — «трудно»,
  // 3 — «хорошо», 4 — «легко». В режиме ввода с клавиатуры они не нужны — там управление
  // через Enter внутри поля ввода
  useEffect(() => {
    if (isTyping) return
    function onKeyDown(e) {
      if (!currentCard || isTransitioning) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!isFlipped) setIsFlipped(true)
      } else if (isFlipped && e.key === '1') {
        handleAnswer('again')
      } else if (isFlipped && e.key === '2') {
        handleAnswer('hard')
      } else if (isFlipped && e.key === '3') {
        handleAnswer('good')
      } else if (isFlipped && e.key === '4') {
        handleAnswer('easy')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentCard, isFlipped, isTransitioning, handleAnswer, isTyping])

  if (!deck) {
    return (
      <div className={styles.center}>
        <p>{t('training.deckNotFound')}</p>
        <Link to="/" className="btn btn-primary">
          {t('common.home')}
        </Link>
      </div>
    )
  }

  if (session.total === 0) {
    return (
      <div className={styles.center}>
        <p className={styles.bigIcon}>🗂️</p>
        <h2>{t('training.emptyTitle')}</h2>
        <p className={styles.hintText}>{t('training.emptyHint')}</p>
        <Link to={`/deck/${deck.id}`} className="btn btn-primary">
          {t('training.toDeck')}
        </Link>
      </div>
    )
  }

  // Экран завершения сессии
  if (session.queue.length === 0) {
    return (
      <div className={styles.center}>
        <p className={styles.bigIcon}>✅</p>
        <h2>{t('training.sessionComplete')}</h2>
        <p className={styles.summaryLine}>{t('training.wordsReviewed', { count: session.total })}</p>
        <div className={styles.summaryRow}>
          <span className={styles.again}>{t('training.again')}: {stats.again}</span>
          <span className={styles.hard}>{t('training.hard')}: {stats.hard}</span>
          <span className={styles.good}>{t('training.good')}: {stats.good}</span>
          <span className={styles.easy}>{t('training.easy')}: {stats.easy}</span>
        </div>
        <div className={styles.summaryActions}>
          <button type="button" className="btn" onClick={() => navigate(`/deck/${deck.id}`)}>
            {t('common.home')}
          </button>
          <button type="button" className="btn btn-primary" onClick={restartSession}>
            {t('training.restart')}
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
          {isReverse ? t('deck.directionReverse') : t('deck.directionForward')}
          {isTyping ? t('training.directionSuffix') : ''}
        </span>
        {session.isFreePractice && (
          <span className={styles.modeBadge} title={t('training.freePracticeHint')}>
            {t('training.freePractice')}
          </span>
        )}
        <Link to={`/deck/${deck.id}`} className={styles.exitLink}>
          {t('training.finish')}
        </Link>
      </div>

      <div className={styles.cardArea}>
        {isTyping ? (
          <TypingCard
            key={currentCard.id}
            prompt={isReverse ? currentCard.translation : currentCard.word}
            answer={isReverse ? currentCard.word : currentCard.translation}
            example={currentCard.example}
            image={currentCard.image}
            onResult={handleTypingResult}
          />
        ) : (
          <Flashcard
            frontText={isReverse ? currentCard.translation : currentCard.word}
            backText={isReverse ? currentCard.word : currentCard.translation}
            example={currentCard.example}
            image={currentCard.image}
            isFlipped={isFlipped}
            onFlip={() => !isTransitioning && setIsFlipped(true)}
          />
        )}
      </div>

      {!isTyping && (
        <div className={styles.answerArea}>
          {!isFlipped ? (
            <p className={styles.hintText}>{t('training.flipHint')}</p>
          ) : (
            <div className={styles.answerButtons}>
              <button type="button" className={styles.againBtn} onClick={() => handleAnswer('again')}>
                {t('training.again')} <span className={styles.key}>1</span>
              </button>
              <button type="button" className={styles.hardBtn} onClick={() => handleAnswer('hard')}>
                {t('training.hard')} <span className={styles.key}>2</span>
              </button>
              <button type="button" className={styles.goodBtn} onClick={() => handleAnswer('good')}>
                {t('training.good')} <span className={styles.key}>3</span>
              </button>
              <button type="button" className={styles.easyBtn} onClick={() => handleAnswer('easy')}>
                {t('training.easy')} <span className={styles.key}>4</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
