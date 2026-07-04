// Логика упрощённой системы Лейтнера: интервалы повторения и работа с датами

// Через сколько дней повторять слово в зависимости от уровня знания (box 1..5)
export const REVIEW_INTERVALS_DAYS = {
  1: 1,
  2: 2,
  3: 4,
  4: 9,
  5: 21,
}

// Максимум новых слов, которые добавляются в одну тренировочную сессию
export const MAX_NEW_CARDS_PER_SESSION = 20

// Сегодняшняя дата в формате YYYY-MM-DD (без времени, чтобы сравнивать даты просто как строки)
export function todayStr() {
  const d = new Date()
  return dateToStr(d)
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

// Слово считается нужным для повторения, если дата следующего повторения уже наступила
export function isDue(card, today = todayStr()) {
  return card.nextReview <= today
}

// Слово считается новым, если по нему ещё не было ни одного ответа
export function isNewCard(card) {
  return card.correctCount === 0 && card.wrongCount === 0
}

// Применить ответ пользователя к карточке и вернуть обновлённую карточку.
// isCorrect: true — «Знаю», false — «Не знаю»
export function applyAnswer(card, isCorrect, today = todayStr()) {
  if (isCorrect) {
    const newBox = Math.min(5, card.box + 1)
    return {
      ...card,
      box: newBox,
      nextReview: addDays(today, REVIEW_INTERVALS_DAYS[newBox]),
      correctCount: card.correctCount + 1,
    }
  }

  return {
    ...card,
    box: 1,
    nextReview: today, // слово нужно повторить снова уже сегодня
    wrongCount: card.wrongCount + 1,
  }
}

// Посчитать, сколько слов колоды ждут повторения сегодня (для плитки колоды на главной)
export function countDueToday(cards, today = todayStr()) {
  return cards.filter((card) => isDue(card, today)).length
}

// Сколько дней осталось до даты повторения (может быть отрицательным, если просрочено)
export function daysUntil(dateStr, today = todayStr()) {
  const [y1, m1, d1] = today.split('-').map(Number)
  const [y2, m2, d2] = dateStr.split('-').map(Number)
  const msPerDay = 24 * 60 * 60 * 1000
  const diff = Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)
  return Math.round(diff / msPerDay)
}

// Человеко-понятное описание даты следующего повторения
export function describeNextReview(dateStr, today = todayStr()) {
  const diff = daysUntil(dateStr, today)
  if (diff <= 0) return 'сегодня'
  if (diff === 1) return 'завтра'
  return `через ${diff} дн.`
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
