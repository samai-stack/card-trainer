// Простое модальное окно подтверждения действия (например, удаления)
import { useAppData } from '../context/AppDataContext'
import styles from './ConfirmDialog.module.css'

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const { t } = useAppData()
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <button type="button" className="btn" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-danger-outline" onClick={onConfirm}>
            {confirmLabel || t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
