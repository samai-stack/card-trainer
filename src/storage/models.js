// Фабрики для создания карточки и колоды с правильной структурой по умолчанию
import { todayStr } from './leitner'

// Генерация уникального id.
// crypto.randomUUID доступен только в «безопасном контексте» (localhost или HTTPS) —
// например, при открытии сайта по IP в локальной сети его не будет, поэтому нужен резервный вариант
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createCard({ word, translation, example = '' }) {
  const today = todayStr()
  return {
    id: generateId(),
    word: word.trim(),
    translation: translation.trim(),
    example: example.trim(),
    addedAt: today,
    box: 1, // уровень знания от 1 до 5
    nextReview: today, // новое слово сразу доступно к изучению
    correctCount: 0,
    wrongCount: 0,
  }
}

export function createDeck(name, cards = []) {
  return {
    id: generateId(),
    name: name.trim(),
    cards,
  }
}
