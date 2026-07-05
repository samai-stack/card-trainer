// Диалог генерации колоды по теме через Anthropic API (Claude)
import { useState } from 'react'
import { generateDeckWithClaude, getSavedApiKey, saveApiKey } from '../storage/claudeGenerator'
import styles from './GenerateDeckDialog.module.css'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function GenerateDeckDialog({ onClose, onGenerate }) {
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(20)
  const [level, setLevel] = useState('B1')
  const [apiKey, setApiKey] = useState(() => getSavedApiKey())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedTopic = topic.trim()
    const trimmedKey = apiKey.trim()
    if (!trimmedTopic) {
      setError('Введите тему колоды')
      return
    }
    if (!trimmedKey) {
      setError('Введите API-ключ Anthropic')
      return
    }

    setLoading(true)
    setError('')
    try {
      const words = await generateDeckWithClaude({
        apiKey: trimmedKey,
        topic: trimmedTopic,
        count,
        level,
      })
      saveApiKey(trimmedKey)
      onGenerate(`${trimmedTopic} (${level})`, words)
    } catch (err) {
      setError(err.message || 'Не удалось сгенерировать колоду')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={loading ? undefined : onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>🤖 Сгенерировать колоду по теме</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Тема
            <input
              className="text-input"
              placeholder="Например: путешествия"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Слов
              <input
                type="number"
                className="text-input"
                min={5}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={loading}
              />
            </label>
            <label className={styles.label}>
              Уровень
              <select
                className="text-input"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={loading}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.label}>
            API-ключ Anthropic
            <input
              type="password"
              className="text-input"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
          </label>
          <p className={styles.hint}>
            Ключ хранится только в этом браузере и отправляется напрямую в Anthropic API — без
            какого-либо своего сервера. Получить ключ можно в консоли Anthropic
            (console.anthropic.com). Каждый запрос расходует средства с вашего аккаунта Anthropic.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Генерирую…' : 'Сгенерировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
