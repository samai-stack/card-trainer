// Общее хранилище состояния приложения (колоды, тема, история тренировок).
// Любой компонент может получить данные и функции для их изменения через useAppData().
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadAppData, saveAppData } from '../storage/storage'
import { createCard, createDeck } from '../storage/models'
import { applyAnswer, todayStr } from '../storage/leitner'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [data, setData] = useState(() => loadAppData())

  // Каждый раз, когда данные меняются, сохраняем их в localStorage
  useEffect(() => {
    saveAppData(data)
  }, [data])

  // Применяем выбранную тему к корневому элементу страницы
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme)
  }, [data.theme])

  // Всегда храним свежие данные в ref, чтобы периодическая проверка напоминания
  // не пересоздавала интервал при каждом изменении данных
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Раз в минуту проверяем, не пора ли напомнить о тренировке браузерным уведомлением.
  // Работает, только пока вкладка с приложением открыта — сервис-воркера в приложении нет
  useEffect(() => {
    if (typeof Notification === 'undefined') return

    function checkReminder() {
      const current = dataRef.current
      if (!current.reminder?.enabled) return
      if (Notification.permission !== 'granted') return

      const today = todayStr()
      if (current.reminder.lastNotifiedDate === today) return

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      if (currentTime < current.reminder.time) return

      const doneToday = current.history[today] || 0
      if (doneToday >= current.dailyGoal) return

      new Notification('Пора потренироваться! 🧠', {
        body: `Сегодня повторено ${doneToday} из ${current.dailyGoal} слов. Загляните в тренажёр карточек.`,
      })
      setData((prev) => ({ ...prev, reminder: { ...prev.reminder, lastNotifiedDate: today } }))
    }

    checkReminder()
    const intervalId = setInterval(checkReminder, 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const actions = useMemo(
    () => ({
      addDeck(name) {
        const deck = createDeck(name)
        setData((prev) => ({ ...prev, decks: [...prev.decks, deck] }))
        return deck
      },

      // Создать колоду сразу с готовым набором слов (например, из встроенного списка топ-1000)
      importDeck(name, words) {
        const deck = createDeck(
          name,
          words.map((w) => createCard(w))
        )
        setData((prev) => ({ ...prev, decks: [...prev.decks, deck] }))
        return deck
      },

      renameDeck(deckId, newName) {
        setData((prev) => ({
          ...prev,
          decks: prev.decks.map((d) => (d.id === deckId ? { ...d, name: newName.trim() } : d)),
        }))
      },

      deleteDeck(deckId) {
        setData((prev) => ({ ...prev, decks: prev.decks.filter((d) => d.id !== deckId) }))
      },

      // Проверка на дубликат слова внутри колоды (без учёта регистра и пробелов)
      findDuplicate(deckId, word, ignoreCardId = null) {
        const deck = data.decks.find((d) => d.id === deckId)
        if (!deck) return null
        const normalized = word.trim().toLowerCase()
        return (
          deck.cards.find(
            (c) => c.id !== ignoreCardId && c.word.trim().toLowerCase() === normalized
          ) || null
        )
      },

      addCard(deckId, cardFields) {
        const card = createCard(cardFields)
        setData((prev) => ({
          ...prev,
          decks: prev.decks.map((d) => (d.id === deckId ? { ...d, cards: [...d.cards, card] } : d)),
        }))
        return card
      },

      updateCard(deckId, cardId, updates) {
        setData((prev) => ({
          ...prev,
          decks: prev.decks.map((d) =>
            d.id === deckId
              ? { ...d, cards: d.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)) }
              : d
          ),
        }))
      },

      deleteCard(deckId, cardId) {
        setData((prev) => ({
          ...prev,
          decks: prev.decks.map((d) =>
            d.id === deckId ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d
          ),
        }))
      },

      // Применить ответ пользователя («Знаю» / «Не знаю») к карточке
      // и отметить сегодняшний день в истории тренировок (для стрика и графика)
      answerCard(deckId, cardId, isCorrect) {
        const today = todayStr()
        setData((prev) => ({
          ...prev,
          decks: prev.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: d.cards.map((c) =>
                    c.id === cardId ? applyAnswer(c, isCorrect, today) : c
                  ),
                }
              : d
          ),
          history: {
            ...prev.history,
            [today]: (prev.history[today] || 0) + 1,
          },
        }))
      },

      setTheme(theme) {
        setData((prev) => ({ ...prev, theme }))
      },

      // Изменить дневную цель по количеству повторений
      setDailyGoal(goal) {
        const safeGoal = Math.max(1, Math.round(goal))
        setData((prev) => ({ ...prev, dailyGoal: safeGoal }))
      },

      setReminderEnabled(enabled) {
        setData((prev) => ({ ...prev, reminder: { ...prev.reminder, enabled } }))
      },

      setReminderTime(time) {
        setData((prev) => ({ ...prev, reminder: { ...prev.reminder, time } }))
      },
    }),
    [data]
  )

  const value = useMemo(() => ({ ...data, ...actions }), [data, actions])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) {
    throw new Error('useAppData должен использоваться внутри <AppDataProvider>')
  }
  return ctx
}
