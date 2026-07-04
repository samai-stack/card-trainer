// Одна строка списка слов: просмотр или редактирование
import { useState } from 'react'
import { ProgressDots } from './ProgressDots'
import { describeNextReview } from '../storage/leitner'
import styles from './WordRow.module.css'

export function WordRow({ card, onSave, onDelete, checkDuplicate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    word: card.word,
    translation: card.translation,
    example: card.example,
  })
  const [warning, setWarning] = useState('')

  function startEdit() {
    setDraft({ word: card.word, translation: card.translation, example: card.example })
    setWarning('')
    setIsEditing(true)
  }

  function handleSave() {
    const wordTrimmed = draft.word.trim()
    const translationTrimmed = draft.translation.trim()
    if (!wordTrimmed || !translationTrimmed) {
      setWarning('Слово и перевод не должны быть пустыми')
      return
    }
    const duplicate = checkDuplicate(wordTrimmed, card.id)
    if (duplicate) {
      setWarning(`Слово «${duplicate.word}» уже есть в этой колоде`)
      return
    }
    onSave({ word: wordTrimmed, translation: translationTrimmed, example: draft.example.trim() })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={styles.row}>
        <div className={styles.editGrid}>
          <input
            className="text-input"
            value={draft.word}
            onChange={(e) => setDraft({ ...draft, word: e.target.value })}
            placeholder="Слово"
            autoFocus
          />
          <input
            className="text-input"
            value={draft.translation}
            onChange={(e) => setDraft({ ...draft, translation: e.target.value })}
            placeholder="Перевод"
          />
          <input
            className="text-input"
            value={draft.example}
            onChange={(e) => setDraft({ ...draft, example: e.target.value })}
            placeholder="Пример (необязательно)"
          />
        </div>
        {warning && <p className={styles.warning}>{warning}</p>}
        <div className={styles.editActions}>
          <button type="button" className="btn" onClick={() => setIsEditing(false)}>
            Отмена
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <div className={styles.wordCol}>
          <span className={styles.word}>{card.word}</span>
          <span className={styles.translation}>{card.translation}</span>
          {card.example && <span className={styles.example}>«{card.example}»</span>}
        </div>
        <div className={styles.metaCol}>
          <ProgressDots box={card.box} />
          <span className={styles.nextReview}>{describeNextReview(card.nextReview)}</span>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} title="Редактировать" onClick={startEdit}>
            ✏️
          </button>
          <button type="button" className={styles.iconBtn} title="Удалить" onClick={onDelete}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
