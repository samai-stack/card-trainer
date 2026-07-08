// Разбор вставленного пользователем списка слов для массового импорта.
// Одна строка — одно слово, поля разделены табуляцией (при вставке из таблицы),
// дефисом, тире или точкой с запятой/запятой: "word - translation - example"
const SEPARATORS = ['\t', ' - ', ' – ', ' — ', ';', ',']

function splitLine(line) {
  for (const sep of SEPARATORS) {
    if (line.includes(sep)) {
      const parts = line.split(sep).map((p) => p.trim())
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return { word: parts[0], translation: parts[1], example: parts[2] || '' }
      }
    }
  }
  return null
}

// Возвращает { valid: [{word, translation, example}], duplicateCount, invalidCount }.
// isDuplicate(word) — проверка на дубликат среди уже существующих в колоде слов
export function parseImportText(text, isDuplicate) {
  const seen = new Set()
  const valid = []
  let duplicateCount = 0
  let invalidCount = 0

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    const parsed = splitLine(line)
    if (!parsed) {
      invalidCount += 1
      continue
    }

    const key = parsed.word.toLowerCase()
    if (seen.has(key) || isDuplicate(parsed.word)) {
      duplicateCount += 1
      continue
    }

    seen.add(key)
    valid.push(parsed)
  }

  return { valid, duplicateCount, invalidCount }
}
