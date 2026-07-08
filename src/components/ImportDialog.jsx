// Диалог массового импорта слов: пользователь вставляет список (например, из таблицы),
// по одному слову на строку, а компонент разбирает его на слово/перевод/пример и
// показывает предпросмотр перед добавлением
import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { parseImportText } from '../storage/importParser'
import styles from './ImportDialog.module.css'

export function ImportDialog({ checkDuplicate, onImport, onClose }) {
  const { t } = useAppData()
  const [text, setText] = useState('')

  const { valid, duplicateCount, invalidCount } = useMemo(
    () => parseImportText(text, (word) => Boolean(checkDuplicate(word))),
    [text, checkDuplicate]
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (valid.length === 0) return
    onImport(valid)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{t('import.title')}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('import.placeholder')}
            autoFocus
            rows={8}
          />
          <p className={styles.hint}>{t('import.hint')}</p>

          {text.trim() && (
            <div className={styles.summary}>
              <span className={styles.summaryOk}>{t('import.willAdd', { count: valid.length })}</span>
              {duplicateCount > 0 && (
                <span className={styles.summaryWarn}>
                  {t('import.duplicatesSkipped', { count: duplicateCount })}
                </span>
              )}
              {invalidCount > 0 && (
                <span className={styles.summaryWarn}>
                  {t('import.invalidSkipped', { count: invalidCount })}
                </span>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={valid.length === 0}>
              {t('import.submit', { count: valid.length })}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
