// Виджет на главной странице: стрик дней подряд + прогресс дневной цели по повторениям
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { calcStreak, todayStr } from '../storage/leitner'
import styles from './DailyGoalWidget.module.css'

const GOAL_PRESETS = [10, 20, 30, 50, 100]

export function DailyGoalWidget() {
  const { history, dailyGoal, setDailyGoal } = useAppData()
  const [isEditing, setIsEditing] = useState(false)

  const doneToday = history[todayStr()] || 0
  const streak = calcStreak(history)
  const percent = Math.min(100, Math.round((doneToday / dailyGoal) * 100))
  const isDone = doneToday >= dailyGoal

  return (
    <div className={styles.widget}>
      <div className={styles.streak} title="Дней подряд с тренировкой">
        <span className={styles.streakIcon}>🔥</span>
        <span className={styles.streakValue}>{streak}</span>
      </div>

      <div className={styles.goalBlock}>
        <div className={styles.goalHeader}>
          <span className={styles.goalLabel}>
            Цель на день: {doneToday} / {dailyGoal} {isDone && '✅'}
          </span>
          {isEditing ? (
            <select
              className={styles.goalSelect}
              autoFocus
              value={dailyGoal}
              onChange={(e) => {
                setDailyGoal(Number(e.target.value))
                setIsEditing(false)
              }}
              onBlur={() => setIsEditing(false)}
            >
              {GOAL_PRESETS.map((n) => (
                <option key={n} value={n}>
                  {n} слов
                </option>
              ))}
            </select>
          ) : (
            <button type="button" className={styles.editBtn} onClick={() => setIsEditing(true)}>
              Изменить
            </button>
          )}
        </div>
        <div className={styles.progressTrack}>
          <div
            className={isDone ? styles.progressFillDone : styles.progressFill}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
