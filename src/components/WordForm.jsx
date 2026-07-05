// Форма добавления нового слова в колоду
import { useRef, useState } from 'react'
import { resizeImageFile } from '../storage/imageUtils'
import styles from './WordForm.module.css'

export function WordForm({ onAdd, checkDuplicate }) {
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
      setWarning('Не удалось загрузить картинку')
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
      setWarning('Заполните слово и перевод')
      return
    }

    const duplicate = checkDuplicate(wordTrimmed)
    if (duplicate) {
      setWarning(`Слово «${duplicate.word}» уже есть в этой колоде`)
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
          placeholder="Слово (на английском)"
          value={word}
          onChange={(e) => {
            setWord(e.target.value)
            setWarning('')
          }}
        />
        <input
          className="text-input"
          placeholder="Перевод"
          value={translation}
          onChange={(e) => {
            setTranslation(e.target.value)
            setWarning('')
          }}
        />
      </div>
      <input
        className="text-input"
        placeholder="Пример предложения (необязательно)"
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
            🖼️ Добавить картинку
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
        Добавить слово
      </button>
    </form>
  )
}
