// Чтение и запись всех данных приложения в localStorage под одним ключом
import { createDefaultAppData } from './defaultData'
import { LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/translations'

const STORAGE_KEY = 'flashcards-app-data-v1'

// Загрузить данные из localStorage. Если данных нет или они повреждены —
// вернуть данные по умолчанию, чтобы приложение никогда не падало.
export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createDefaultAppData()
    }
    const parsed = JSON.parse(raw)
    // простая проверка, что структура похожа на ожидаемую
    if (!parsed || !Array.isArray(parsed.decks)) {
      return createDefaultAppData()
    }
    const reminder = parsed.reminder && typeof parsed.reminder === 'object' ? parsed.reminder : {}
    return {
      decks: parsed.decks,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      history: parsed.history && typeof parsed.history === 'object' ? parsed.history : {},
      dailyGoal: Number.isInteger(parsed.dailyGoal) && parsed.dailyGoal > 0 ? parsed.dailyGoal : 20,
      language: LANGUAGES.includes(parsed.language) ? parsed.language : DEFAULT_LANGUAGE,
      reminder: {
        enabled: reminder.enabled === true,
        time: typeof reminder.time === 'string' && /^\d{2}:\d{2}$/.test(reminder.time) ? reminder.time : '19:00',
        lastNotifiedDate: typeof reminder.lastNotifiedDate === 'string' ? reminder.lastNotifiedDate : null,
      },
    }
  } catch (error) {
    console.error('Не удалось прочитать данные из localStorage, используем данные по умолчанию', error)
    return createDefaultAppData()
  }
}

// Сохранить данные приложения в localStorage
export function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Не удалось сохранить данные в localStorage', error)
  }
}
