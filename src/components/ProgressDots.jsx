// Визуализация уровня знания слова (box от 1 до 5) в виде пяти точек
import { useAppData } from '../context/AppDataContext'
import styles from './ProgressDots.module.css'

export function ProgressDots({ box }) {
  const { t } = useAppData()
  return (
    <div className={styles.dots} title={t('progressDots.title', { box })}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= box ? styles.filled : styles.empty} />
      ))}
    </div>
  )
}
