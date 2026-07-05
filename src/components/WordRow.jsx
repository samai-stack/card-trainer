// Одна строка списка слов: просмотр или редактирование
import { useRef, useState } from 'react'
import { ProgressDots } from './ProgressDots'
import { describeNextReview } from '../storage/leitner'
import { resizeImageFile, isPhotoImage } from '../storage/imageUtils'
import styles from './WordRow.module.css'

export function WordRow({ card, onSave, onDelete, checkDuplicate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    word: card.word,
    translation: card.translation,
    example: card.example,
    image: card.image || '',
  })
  const [warning, setWarning] = useState('')
  const fileInputRef = useRef(null)

  function startEdit() {
    setDraft({
      word: card.word,
      translation: card.translation,
      example: card.example,
      image: card.image || '',
    })
    setWarning('')
    setIsEditing(true)
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImageFile(file)
      setDraft((d) => ({ ...d, image: dataUrl }))
    } catch {
      setWarning('Не удалось загрузить картинку')
    }
  }

  function clearDraftImage() {
    setDraft((d) => ({ ...d, image: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
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
    onSave({
      word: wordTrimmed,
      translation: translationTrimmed,
      example: draft.example.trim(),
      image: draft.image,
    })
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

        <div className={styles.imageEditRow}>
          {draft.image ? (
            <div className={styles.imagePreviewWrap}>
              {isPhotoImage(draft.image) ? (
                <img src={draft.image} alt="" className={styles.imagePreview} />
              ) : (
                <span className={styles.imagePreviewEmoji}>{draft.image}</span>
              )}
              <button type="button" className={styles.removeImageBtn} onClick={clearDraftImage}>
                ✕
              </button>
            </div>
          ) : (
            <label className={styles.imagePickBtn}>
              🖼️ Картинка
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </label>
          )}
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
        {card.image ? (
          isPhotoImage(card.image) ? (
            <img src={card.image} alt="" className={styles.thumb} />
          ) : (
            <span className={styles.thumbEmoji}>{card.image}</span>
          )
        ) : (
          <div className={styles.thumbPlaceholder} />
        )}
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
