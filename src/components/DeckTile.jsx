// Плитка одной колоды на главной странице: название, счётчики, действия
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { countDueToday } from '../storage/leitner'
import { pluralKey } from '../i18n/translations'
import styles from './DeckTile.module.css'

export function DeckTile({ deck, onRename, onDelete }) {
  const navigate = useNavigate()
  const { t, language } = useAppData()
  const [isEditing, setIsEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState(deck.name)

  const total = deck.cards.length
  const dueToday = countDueToday(deck.cards)

  function saveRename() {
    const trimmed = nameDraft.trim()
    setIsEditing(false)
    if (trimmed && trimmed !== deck.name) {
      onRename(trimmed)
    } else {
      setNameDraft(deck.name)
    }
  }

  return (
    <div className={styles.tile}>
      <div className={styles.header}>
        {isEditing ? (
          <input
            className="text-input"
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveRename()
              if (e.key === 'Escape') {
                setNameDraft(deck.name)
                setIsEditing(false)
              }
            }}
            onBlur={saveRename}
          />
        ) : (
          <h3 className={styles.name} onClick={() => navigate(`/deck/${deck.id}`)}>
            {deck.name}
          </h3>
        )}
        <div className={styles.iconActions}>
          <button
            type="button"
            className={styles.iconBtn}
            title={t('deckTile.rename')}
            onClick={() => setIsEditing(true)}
          >
            ✏️
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title={t('deckTile.delete')}
            onClick={onDelete}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <span>
          {total} {t(`deckTile.word${pluralKey(language, total)}`)}
        </span>
        <span className={dueToday > 0 ? styles.dueHighlight : undefined}>
          {dueToday > 0 ? t('deckTile.due', { count: dueToday }) : t('deckTile.nothingDue')}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn" onClick={() => navigate(`/deck/${deck.id}`)}>
          {t('deckTile.open')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={total === 0}
          onClick={() => navigate(`/deck/${deck.id}/train`)}
        >
          {t('deckTile.review')}
        </button>
      </div>
    </div>
  )
}
