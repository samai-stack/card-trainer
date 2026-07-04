// Настройка браузерных уведомлений-напоминаний о тренировке
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import styles from './ReminderSettings.module.css'

const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window

export function ReminderSettings() {
  const { reminder, setReminderEnabled, setReminderTime } = useAppData()
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
        <p className={styles.hint}>🔔 Ваш браузер не поддерживает уведомления.</p>
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <span className={styles.icon}>🔔</span>
        <div className={styles.textCol}>
          <span className={styles.title}>Напоминания о тренировке</span>
          <span className={styles.subtitle}>
            {reminder.enabled
              ? `Включены — уведомление придёт в ${reminder.time}, если цель на день ещё не выполнена`
              : 'Присылать уведомление в браузере, если сегодня ещё не тренировались'}
          </span>
        </div>
        {reminder.enabled ? (
          <button type="button" className="btn" onClick={handleDisable}>
            Выключить
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleEnable}>
            Включить
          </button>
        )}
      </div>

      {reminder.enabled && (
        <div className={styles.timeRow}>
          <label htmlFor="reminder-time" className={styles.timeLabel}>
            Время напоминания
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

      {permission === 'denied' && (
        <p className={styles.warning}>
          Уведомления заблокированы в браузере. Разрешите их в настройках сайта, чтобы напоминания приходили.
        </p>
      )}

      <p className={styles.note}>
        Напоминание сработает, только если вкладка с приложением открыта в браузере в нужный момент.
      </p>
    </div>
  )
}
