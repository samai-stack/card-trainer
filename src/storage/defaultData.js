// Данные, которые создаются при самом первом запуске приложения,
// чтобы оно не выглядело пустым

import { createCard, createDeck } from './models'

const STARTER_WORDS = [
  { word: 'hello', translation: 'привет', example: 'Hello, how are you?' },
  { word: 'thank you', translation: 'спасибо', example: 'Thank you for your help.' },
  { word: 'water', translation: 'вода', example: 'Can I have some water?' },
  { word: 'friend', translation: 'друг', example: 'She is my best friend.' },
  { word: 'time', translation: 'время', example: 'What time is it?' },
  { word: 'work', translation: 'работа', example: 'I go to work every day.' },
  { word: 'house', translation: 'дом', example: 'Their house is very big.' },
  { word: 'happy', translation: 'счастливый', example: 'I am happy to see you.' },
  { word: 'to understand', translation: 'понимать', example: 'I don\'t understand this word.' },
  { word: 'to learn', translation: 'учить, изучать', example: 'I learn English every day.' },
]

export function createDefaultAppData() {
  const starterDeck = createDeck(
    'Мои слова',
    STARTER_WORDS.map((w) => createCard(w))
  )

  return {
    decks: [starterDeck],
    theme: 'dark',
    // история тренировок: ключ — дата YYYY-MM-DD, значение — сколько ответов дано в этот день
    history: {},
    // цель на день — сколько повторений хочет делать пользователь ежедневно
    dailyGoal: 20,
    // напоминание о тренировке через браузерные уведомления
    reminder: {
      enabled: false,
      time: '19:00',
      lastNotifiedDate: null, // чтобы не напоминать больше одного раза в день
    },
  }
}
