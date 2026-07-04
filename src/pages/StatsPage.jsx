// Страница статистики: сводка по всем колодам, стрик, график активности за 14 дней
import { useMemo } from 'react'
import { useAppData } from '../context/AppDataContext'
import { calcStreak, lastNDaysActivity } from '../storage/leitner'
import { ReminderSettings } from '../components/ReminderSettings'
import styles from './StatsPage.module.css'

export function StatsPage() {
  const { decks, history } = useAppData()

  const allCards = useMemo(() => decks.flatMap((d) => d.cards), [decks])

  const totals = useMemo(() => {
    const total = allCards.length
    const learned = allCards.filter((c) => c.box === 5).length
    const fresh = allCards.filter((c) => c.correctCount === 0 && c.wrongCount === 0).length
    const inProgress = total - learned - fresh
    return { total, learned, fresh, inProgress }
  }, [allCards])

  const streak = useMemo(() => calcStreak(history), [history])
  const activity = useMemo(() => lastNDaysActivity(history, 14), [history])
  const maxCount = Math.max(1, ...activity.map((d) => d.count))

  return (
    <div className={styles.page}>
      <h1>Статистика</h1>

      <div className={styles.cards}>
        <StatCard label="Всего слов" value={totals.total} />
        <StatCard label="Выучено" value={totals.learned} accent="success" />
        <StatCard label="В процессе" value={totals.inProgress} />
        <StatCard label="Новых" value={totals.fresh} />
      </div>

      <div className={styles.streakBlock}>
        <span className={styles.streakIcon}>🔥</span>
        <div>
          <div className={styles.streakValue}>{streak} {daysLabel(streak)} подряд</div>
          <div className={styles.streakHint}>
            {streak > 0 ? 'Так держать, не прерывайте серию!' : 'Потренируйтесь сегодня, чтобы начать серию'}
          </div>
        </div>
      </div>

      <div className={styles.chartBlock}>
        <h2 className={styles.chartTitle}>Активность за 14 дней</h2>
        <div className={styles.chart}>
          {activity.map((day) => (
            <div key={day.date} className={styles.barCol} title={`${day.date}: ${day.count}`}>
              <div
                className={styles.bar}
                style={{ height: `${Math.max(4, (day.count / maxCount) * 100)}%` }}
              />
              <span className={styles.barLabel}>{day.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      <ReminderSettings />
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={styles.card}>
      <div className={accent === 'success' ? styles.valueSuccess : styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}

function daysLabel(count) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дня'
  return 'дней'
}
