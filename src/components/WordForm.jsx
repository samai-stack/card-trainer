// Форма добавления нового слова в колоду
import { useRef, useState } from 'react'
import styles from './WordForm.module.css'

export function WordForm({ onAdd, checkDuplicate }) {
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [warning, setWarning] = useState('')
  const wordInputRef = useRef(null)

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

    onAdd({ word: wordTrimmed, translation: translationTrimmed, example: example.trim() })

    // очищаем форму и возвращаем фокус в первое поле, чтобы удобно вводить слова подряд
    setWord('')
    setTranslation('')
    setExample('')
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
      {warning && <p className={styles.warning}>{warning}</p>}
      <button type="submit" className="btn btn-primary">
        Добавить слово
      </button>
    </form>
  )
}
