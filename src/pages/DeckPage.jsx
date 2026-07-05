// Страница управления словами внутри одной колоды
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { WordForm } from '../components/WordForm'
import { WordRow } from '../components/WordRow'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { countDueToday } from '../storage/leitner'
import { lookupEmoji } from '../storage/emojiDictionary'
import { resizeImageFile, filenameToWordKey } from '../storage/imageUtils'
import styles from './DeckPage.module.css'

export function DeckPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const { decks, addCard, updateCard, deleteCard, findDuplicate } = useAppData()
  const [search, setSearch] = useState('')
  const [cardToDelete, setCardToDelete] = useState(null)
  // Направление тренировки: обычное (слово → перевод) или обратное (перевод → слово)
  const [direction, setDirection] = useState('forward')
  // Способ ответа: переворот карточки или ввод слова с клавиатуры
  const [answerMode, setAnswerMode] = useState('flip')
  const [imagesMessage, setImagesMessage] = useState('')

  const deck = decks.find((d) => d.id === deckId)

  function handleAutoFillEmoji() {
    if (!deck) return
    let filled = 0
    let candidates = 0
    for (const card of deck.cards) {
      if (card.image) continue
      candidates += 1
      const emoji = lookupEmoji(card.word)
      if (emoji) {
        updateCard(deck.id, card.id, { image: emoji })
        filled += 1
      }
    }
    setImagesMessage(
      candidates === 0
        ? 'У всех слов уже есть картинка'
        : `Готово: эмодзи найдены для ${filled} из ${candidates} слов без картинки`
    )
  }

  async function handleBulkFileUpload(e) {
    if (!deck) return
    const files = Array.from(e.target.files || [])
    e.target.value = '' // чтобы можно было выбрать те же файлы повторно

    let matched = 0
    const unmatched = []

    for (const file of files) {
      const key = filenameToWordKey(file.name)
      const card = deck.cards.find((c) => c.word.trim().toLowerCase() === key)
      if (!card) {
        unmatched.push(file.name)
        continue
      }
      try {
        const dataUrl = await resizeImageFile(file)
        updateCard(deck.id, card.id, { image: dataUrl })
        matched += 1
      } catch {
        unmatched.push(file.name)
      }
    }

    const summary = `Загружено ${matched} из ${files.length}`
    setImagesMessage(
      unmatched.length > 0 ? `${summary}. Не найдено слов для: ${unmatched.join(', ')}` : summary
    )
  }

  const filteredCards = useMemo(() => {
    if (!deck) return []
    const query = search.trim().toLowerCase()
    if (!query) return deck.cards
    return deck.cards.filter(
      (c) =>
        c.word.toLowerCase().includes(query) || c.translation.toLowerCase().includes(query)
    )
  }, [deck, search])

  if (!deck) {
    return (
      <div className={styles.notFound}>
        <p>Такая колода не найдена — возможно, она была удалена.</p>
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    )
  }

  const dueToday = countDueToday(deck.cards)

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link to="/" className={styles.back}>
          ← Все колоды
        </Link>
        <h1>{deck.name}</h1>
        <p className={styles.subtitle}>
          {deck.cards.length} слов, {dueToday} ждут повторения сегодня
        </p>

        <div className={styles.directionSwitch} role="radiogroup" aria-label="Направление тренировки">
          <button
            type="button"
            role="radio"
            aria-checked={direction === 'forward'}
            className={direction === 'forward' ? styles.directionActive : styles.directionOption}
            onClick={() => setDirection('forward')}
          >
            Слово → перевод
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={direction === 'reverse'}
            className={direction === 'reverse' ? styles.directionActive : styles.directionOption}
            onClick={() => setDirection('reverse')}
          >
            Перевод → слово
          </button>
        </div>

        <div className={styles.directionSwitch} role="radiogroup" aria-label="Способ ответа">
          <button
            type="button"
            role="radio"
            aria-checked={answerMode === 'flip'}
            className={answerMode === 'flip' ? styles.directionActive : styles.directionOption}
            onClick={() => setAnswerMode('flip')}
          >
            Карточки
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={answerMode === 'type'}
            className={answerMode === 'type' ? styles.directionActive : styles.directionOption}
            onClick={() => setAnswerMode('type')}
          >
            Ввод с клавиатуры
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={deck.cards.length === 0}
          onClick={() => {
            const params = new URLSearchParams()
            if (direction === 'reverse') params.set('dir', 'reverse')
            if (answerMode === 'type') params.set('mode', 'type')
            const query = params.toString()
            navigate(`/deck/${deck.id}/train${query ? `?${query}` : ''}`)
          }}
        >
          Начать тренировку
        </button>
      </div>

      <WordForm
        onAdd={(fields) => addCard(deck.id, fields)}
        checkDuplicate={(word) => findDuplicate(deck.id, word)}
      />

      {deck.cards.length > 0 && (
        <div className={styles.imagesTools}>
          <button type="button" className="btn" onClick={handleAutoFillEmoji}>
            🎲 Заполнить эмодзи автоматически
          </button>
          <label className={`btn ${styles.bulkFileLabel}`}>
            📁 Загрузить картинки пачкой
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkFileUpload}
              className={styles.bulkFileInput}
            />
          </label>
          {imagesMessage && <p className={styles.imagesMessage}>{imagesMessage}</p>}
        </div>
      )}

      <input
        className="text-input"
        placeholder="Поиск по словам или переводу…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {deck.cards.length === 0 ? (
        <p className={styles.empty}>
          В этой колоде пока нет слов. Добавьте первое с помощью формы выше.
        </p>
      ) : filteredCards.length === 0 ? (
        <p className={styles.empty}>Ничего не найдено по запросу «{search}»</p>
      ) : (
        <div className={styles.list}>
          {filteredCards.map((card) => (
            <WordRow
              key={card.id}
              card={card}
              onSave={(updates) => updateCard(deck.id, card.id, updates)}
              onDelete={() => setCardToDelete(card)}
              checkDuplicate={(word, ignoreId) => findDuplicate(deck.id, word, ignoreId)}
            />
          ))}
        </div>
      )}

      {cardToDelete && (
        <ConfirmDialog
          title={`Удалить слово «${cardToDelete.word}»?`}
          onCancel={() => setCardToDelete(null)}
          onConfirm={() => {
            deleteCard(deck.id, cardToDelete.id)
            setCardToDelete(null)
          }}
        />
      )}
    </div>
  )
}
