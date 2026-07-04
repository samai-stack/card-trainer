// Карточка тренировки с анимацией переворота (CSS 3D flip).
// Что показывать спереди/сзади решает вызывающий компонент — это позволяет
// использовать один и тот же компонент и для прямой, и для обратной тренировки
import styles from './Flashcard.module.css'

export function Flashcard({ frontText, backText, example, isFlipped, onFlip }) {
  return (
    <div
      className={styles.outer}
      onClick={() => !isFlipped && onFlip()}
      role="button"
      tabIndex={0}
      aria-label="Перевернуть карточку"
    >
      <div className={`${styles.inner} ${isFlipped ? styles.flipped : ''}`}>
        <div className={`${styles.face} ${styles.front}`}>
          <span className={styles.word}>{frontText}</span>
          <span className={styles.hint}>нажмите, чтобы перевернуть</span>
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          <span className={styles.translation}>{backText}</span>
          {example && <span className={styles.example}>«{example}»</span>}
        </div>
      </div>
    </div>
  )
}
