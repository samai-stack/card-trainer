// Настройка браузерных уведомлений-напоминаний о тренировке
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import styles from './ReminderSettings.module.css'

const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window

export function ReminderSettings() {
  const { reminder, setReminderEnabled, setReminderTime, t } = useAppData()
  const [permission, setPermission] = useState(
    isNotificationSupported ? Notification.permission : 'unsupported'
  )

  async function handleEnable() {
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      setReminderEnabled(true)
    }
  }

  function handleDisable() {
    setReminderEnabled(false)
  }

  if (!isNotificationSupported) {
    return (
      <div className={styles.box}>
        <p className={styles.hint}>{t('reminder.unsupported')}</p>
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <span className={styles.icon}>🔔</span>
        <div className={styles.textCol}>
          <span className={styles.title}>{t('reminder.title')}</span>
          <span className={styles.subtitle}>
            {reminder.enabled
              ? t('reminder.enabledSubtitle', { time: reminder.time })
              : t('reminder.disabledSubtitle')}
          </span>
        </div>
        {reminder.enabled ? (
          <button type="button" className="btn" onClick={handleDisable}>
            {t('reminder.turnOff')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleEnable}>
            {t('reminder.turnOn')}
          </button>
        )}
      </div>

      {reminder.enabled && (
        <div className={styles.timeRow}>
          <label htmlFor="reminder-time" className={styles.timeLabel}>
            {t('reminder.timeLabel')}
          </label>
          <input
            id="reminder-time"
            type="time"
            className={styles.timeInput}
            value={reminder.time}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      )}

      {permission === 'denied' && <p className={styles.warning}>{t('reminder.denied')}</p>}

      <p className={styles.note}>{t('reminder.note')}</p>
    </div>
  )
}
