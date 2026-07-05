// Форма добавления нового слова в колоду
import { useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { resizeImageFile } from '../storage/imageUtils'
import styles from './WordForm.module.css'

export function WordForm({ onAdd, checkDuplicate }) {
  const { t } = useAppData()
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [image, setImage] = useState('')
  const [warning, setWarning] = useState('')
  const wordInputRef = useRef(null)
  const fileInputRef = useRef(null)

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImageFile(file)
      setImage(dataUrl)
    } catch {
      setWarning(t('wordForm.imageFailed'))
    }
  }

  function clearImage() {
    setImage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const wordTrimmed = word.trim()
    const translationTrimmed = translation.trim()

    if (!wordTrimmed || !translationTrimmed) {
      setWarning(t('wordForm.fillRequired'))
      return
    }

    const duplicate = checkDuplicate(wordTrimmed)
    if (duplicate) {
      setWarning(t('wordForm.duplicate', { word: duplicate.word }))
      return
    }

    onAdd({ word: wordTrimmed, translation: translationTrimmed, example: example.trim(), image })

    // очищаем форму и возвращаем фокус в первое поле, чтобы удобно вводить слова подряд
    setWord('')
    setTranslation('')
    setExample('')
    clearImage()
    setWarning('')
    wordInputRef.current?.focus()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          ref={wordInputRef}
          className="text-input"
          placeholder={t('wordForm.wordPlaceholder')}
          value={word}
          onChange={(e) => {
            setWord(e.target.value)
            setWarning('')
          }}
        />
        <input
          className="text-input"
          placeholder={t('wordForm.translationPlaceholder')}
          value={translation}
          onChange={(e) => {
            setTranslation(e.target.value)
            setWarning('')
          }}
        />
      </div>
      <input
        className="text-input"
        placeholder={t('wordForm.examplePlaceholder')}
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />

      <div className={styles.imageRow}>
        {image ? (
          <div className={styles.imagePreviewWrap}>
            <img src={image} alt="" className={styles.imagePreview} />
            <button type="button" className={styles.removeImageBtn} onClick={clearImage}>
              ✕
            </button>
          </div>
        ) : (
          <label className={styles.imagePickBtn}>
            {t('wordForm.addImage')}
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
      <button type="submit" className="btn btn-primary">
        {t('wordForm.submit')}
      </button>
    </form>
  )
}
