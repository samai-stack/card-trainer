// Визуализация уровня знания слова (box от 1 до 5) в виде пяти точек
import styles from './ProgressDots.module.css'

export function ProgressDots({ box }) {
  return (
    <div className={styles.dots} title={`Уровень знания: ${box} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= box ? styles.filled : styles.empty} />
      ))}
    </div>
  )
}
