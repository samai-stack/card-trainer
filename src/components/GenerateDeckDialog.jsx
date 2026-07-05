// Диалог генерации колоды по теме через Anthropic API (Claude)
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { generateDeckWithClaude, getSavedApiKey, saveApiKey } from '../storage/claudeGenerator'
import styles from './GenerateDeckDialog.module.css'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function GenerateDeckDialog({ onClose, onGenerate }) {
  const { t } = useAppData()
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
      setError(t('generate.enterTopic'))
      return
    }
    if (!trimmedKey) {
      setError(t('generate.enterApiKey'))
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
      setError(err.i18nCode ? t(`generate.error.${err.i18nCode}`, err.i18nVars) : t('generate.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={loading ? undefined : onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{t('generate.title')}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            {t('generate.topicLabel')}
            <input
              className="text-input"
              placeholder={t('generate.topicPlaceholder')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              {t('generate.countLabel')}
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
              {t('generate.levelLabel')}
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
            {t('generate.apiKeyLabel')}
            <input
              type="password"
              className="text-input"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
          </label>
          <p className={styles.hint}>{t('generate.hint')}</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('generate.generating') : t('generate.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
