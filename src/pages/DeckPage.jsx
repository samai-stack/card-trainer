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
import { pluralKey } from '../i18n/translations'
import styles from './DeckPage.module.css'

export function DeckPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const { decks, addCard, updateCard, deleteCard, findDuplicate, t, language } = useAppData()
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
      candidates === 0 ? t('deck.allHaveImages') : t('deck.emojiFilled', { filled, candidates })
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

    const summary = t('deck.bulkUploaded', { matched, total: files.length })
    setImagesMessage(
      unmatched.length > 0
        ? summary + t('deck.bulkUnmatched', { names: unmatched.join(', ') })
        : summary
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
        <p>{t('deck.notFound')}</p>
        <Link to="/" className="btn btn-primary">
          {t('common.home')}
        </Link>
      </div>
    )
  }

  const dueToday = countDueToday(deck.cards)

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link to="/" className={styles.back}>
          {t('deck.back')}
        </Link>
        <h1>{deck.name}</h1>
        <p className={styles.subtitle}>
          {t('deck.subtitle', {
            total: deck.cards.length,
            wordForm: t(`deckTile.word${pluralKey(language, deck.cards.length)}`),
            due: dueToday,
          })}
        </p>

        <div className={styles.directionSwitch} role="radiogroup" aria-label={t('deck.directionLabel')}>
          <button
            type="button"
            role="radio"
            aria-checked={direction === 'forward'}
            className={direction === 'forward' ? styles.directionActive : styles.directionOption}
            onClick={() => setDirection('forward')}
          >
            {t('deck.directionForward')}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={direction === 'reverse'}
            className={direction === 'reverse' ? styles.directionActive : styles.directionOption}
            onClick={() => setDirection('reverse')}
          >
            {t('deck.directionReverse')}
          </button>
        </div>

        <div className={styles.directionSwitch} role="radiogroup" aria-label={t('deck.answerModeLabel')}>
          <button
            type="button"
            role="radio"
            aria-checked={answerMode === 'flip'}
            className={answerMode === 'flip' ? styles.directionActive : styles.directionOption}
            onClick={() => setAnswerMode('flip')}
          >
            {t('deck.answerModeFlip')}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={answerMode === 'type'}
            className={answerMode === 'type' ? styles.directionActive : styles.directionOption}
            onClick={() => setAnswerMode('type')}
          >
            {t('deck.answerModeType')}
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
          {t('deck.startTraining')}
        </button>
      </div>

      <WordForm
        onAdd={(fields) => addCard(deck.id, fields)}
        checkDuplicate={(word) => findDuplicate(deck.id, word)}
      />

      {deck.cards.length > 0 && (
        <div className={styles.imagesTools}>
          <button type="button" className="btn" onClick={handleAutoFillEmoji}>
            {t('deck.autoFillEmoji')}
          </button>
          <label className={`btn ${styles.bulkFileLabel}`}>
            {t('deck.bulkUpload')}
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
        placeholder={t('deck.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {deck.cards.length === 0 ? (
        <p className={styles.empty}>{t('deck.emptyDeck')}</p>
      ) : filteredCards.length === 0 ? (
        <p className={styles.empty}>{t('deck.noResults', { query: search })}</p>
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
          title={t('deck.deleteWordTitle', { word: cardToDelete.word })}
          confirmLabel={t('common.delete')}
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
