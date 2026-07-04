// Плитка одной колоды на главной странице: название, счётчики, действия
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { countDueToday } from '../storage/leitner'
import styles from './DeckTile.module.css'

export function DeckTile({ deck, onRename, onDelete }) {
  const navigate = useNavigate()
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
            title="Переименовать"
            onClick={() => setIsEditing(true)}
          >
            ✏️
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Удалить колоду"
            onClick={onDelete}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <span>{total} {wordsLabel(total)}</span>
        <span className={dueToday > 0 ? styles.dueHighlight : undefined}>
          {dueToday > 0 ? `${dueToday} ждут повторения` : 'нечего повторять'}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn" onClick={() => navigate(`/deck/${deck.id}`)}>
          Открыть
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={total === 0}
          onClick={() => navigate(`/deck/${deck.id}/train`)}
        >
          Повторить
        </button>
      </div>
    </div>
  )
}

function wordsLabel(count) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'слово'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'слова'
  return 'слов'
}
