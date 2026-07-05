// Логика интервальных повторений: 4 варианта ответа с фиксированными интервалами
// («Ещё раз» / «Трудно» / «Хорошо» / «Легко»), похоже на Anki

// Через сколько времени показать слово снова в зависимости от ответа.
// "again" измеряется в минутах, остальные — в днях
const REVIEW_INTERVALS = {
  again: { minutes: 10 },
  hard: { days: 2 },
  good: { days: 45 }, // ~1.5 месяца
  easy: { days: 90 }, // ~3 месяца
}

// Уровень «знания» слова (1-5) — используется только для статистики и точек-индикаторов,
// на расписание повторений не влияет (оно всегда идёт по фиксированным интервалам выше)
const OUTCOME_BOX = { again: 1, hard: 2, good: 4, easy: 5 }

export const ANSWER_OUTCOMES = ['again', 'hard', 'good', 'easy']

// Максимум новых слов, которые добавляются в одну тренировочную сессию
export const MAX_NEW_CARDS_PER_SESSION = 20

// Сегодняшняя дата в формате YYYY-MM-DD (без времени) — используется для стрика
// и графика активности, где важен именно календарный день, а не точное время
export function todayStr() {
  return dateToStr(new Date())
}

export function dateToStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Прибавить к дате (строка YYYY-MM-DD) указанное число дней, вернуть новую строку-дату
export function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return dateToStr(date)
}

// Точный текущий момент в ISO-формате — нужен для расписания повторений,
// т.к. интервал «Ещё раз» измеряется в минутах, а не днях
export function nowIso() {
  return new Date().toISOString()
}

function applyInterval(outcome, fromIso) {
  const date = new Date(fromIso)
  const interval = REVIEW_INTERVALS[outcome]
  if (interval.minutes) date.setMinutes(date.getMinutes() + interval.minutes)
  if (interval.days) date.setDate(date.getDate() + interval.days)
  return date.toISOString()
}

// Слово считается нужным для повторения, если момент следующего повторения уже наступил
export function isDue(card, nowIsoValue = nowIso()) {
  return card.nextReview <= nowIsoValue
}

// Слово считается новым, если по нему ещё не было ни одного ответа
export function isNewCard(card) {
  return card.correctCount === 0 && card.wrongCount === 0
}

// Применить ответ пользователя к карточке и вернуть обновлённую карточку.
// outcome: 'again' | 'hard' | 'good' | 'easy'
export function applyAnswer(card, outcome, fromIso = nowIso()) {
  const isPositive = outcome !== 'again'
  return {
    ...card,
    box: OUTCOME_BOX[outcome] ?? 1,
    nextReview: applyInterval(outcome, fromIso),
    correctCount: isPositive ? card.correctCount + 1 : card.correctCount,
    wrongCount: isPositive ? card.wrongCount : card.wrongCount + 1,
  }
}

// Посчитать, сколько слов колоды ждут повторения прямо сейчас (для плитки колоды на главной)
export function countDueToday(cards, nowIsoValue = nowIso()) {
  return cards.filter((card) => isDue(card, nowIsoValue)).length
}

// Человеко-понятное описание момента следующего повторения
export function describeNextReview(iso, nowIsoValue = nowIso()) {
  const diffMs = new Date(iso).getTime() - new Date(nowIsoValue).getTime()
  if (diffMs <= 0) return 'сейчас'

  const diffMinutes = diffMs / (1000 * 60)
  if (diffMinutes < 60) return `через ${Math.round(diffMinutes)} мин.`

  const diffHours = diffMinutes / 60
  if (diffHours < 24) return `через ${Math.round(diffHours)} ч.`

  const diffDays = diffHours / 24
  if (diffDays < 30) return `через ${Math.round(diffDays)} дн.`

  const diffMonths = diffDays / 30
  return `через ${Math.round(diffMonths)} мес.`
}

// Стрик: сколько дней подряд были тренировки (по объекту history { 'YYYY-MM-DD': count })
export function calcStreak(history, today = todayStr()) {
  let cursor = history[today] ? today : addDays(today, -1)
  let streak = 0
  while (history[cursor]) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

// Список последних N дней (от старых к новым) с количеством ответов в каждый день
export function lastNDaysActivity(history, days, today = todayStr()) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i)
    result.push({ date, count: history[date] || 0 })
  }
  return result
}
