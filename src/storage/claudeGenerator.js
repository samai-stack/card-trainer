// Генерация колоды слов по теме через Anthropic API (Claude), напрямую из браузера,
// без собственного бэкенда. Ключ API хранится только в localStorage на устройстве
// пользователя и отправляется только в заголовке запроса к api.anthropic.com
const API_KEY_STORAGE_KEY = 'card-trainer-anthropic-api-key'

// Можно заменить на 'claude-haiku-4-5' для более быстрой и дешёвой генерации
const MODEL = 'claude-opus-4-8'

export function getSavedApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function saveApiKey(key) {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
  } catch {
    // localStorage может быть недоступен (приватный режим и т.п.) — тихо игнорируем
  }
}

const WORD_LIST_SCHEMA = {
  type: 'object',
  properties: {
    words: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          word: { type: 'string', description: 'Слово или устойчивое словосочетание на английском' },
          translation: { type: 'string', description: 'Перевод на русский язык' },
          example: { type: 'string', description: 'Пример предложения на английском с этим словом' },
        },
        required: ['word', 'translation', 'example'],
        additionalProperties: false,
      },
    },
  },
  required: ['words'],
  additionalProperties: false,
}

function buildPrompt(topic, count, level) {
  return `Составь список ровно ${count} английских слов и словосочетаний по теме «${topic}» для уровня ${level} по шкале CEFR.

Требования:
- Слова должны быть уникальными, без повторов.
- Сложность должна соответствовать уровню ${level}.
- Слова должны быть по существу связаны с темой «${topic}».
- Для каждого слова дай точный перевод на русский и короткий пример предложения на английском, где это слово используется в естественном контексте.`
}

// Выполняет запрос к Messages API Anthropic напрямую из браузера и возвращает
// массив { word, translation, example }. Бросает Error с понятным текстом при сбое.
export async function generateDeckWithClaude({ apiKey, topic, count, level }) {
  const maxTokens = Math.max(1024, Math.min(8192, count * 120))

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Разрешает вызов Anthropic API напрямую из браузера (без своего бэкенда).
      // Ключ при этом виден в сетевых запросах этого браузера — см. предупреждение в интерфейсе
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: buildPrompt(topic, count, level) }],
      output_config: {
        format: { type: 'json_schema', schema: WORD_LIST_SCHEMA },
      },
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.error?.message
    if (response.status === 401) {
      throw new Error('Неверный API-ключ Anthropic')
    }
    if (response.status === 429) {
      throw new Error('Превышен лимит запросов к Anthropic API, попробуйте чуть позже')
    }
    throw new Error(message || `Ошибка Anthropic API (${response.status})`)
  }

  const data = await response.json()
  if (data.stop_reason === 'refusal') {
    throw new Error('Claude отказался генерировать ответ на этот запрос')
  }

  const textBlock = (data.content || []).find((block) => block.type === 'text')
  if (!textBlock) {
    throw new Error('Не удалось получить ответ от Claude')
  }

  let parsed
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('Claude вернул ответ в неожиданном формате')
  }
  if (!Array.isArray(parsed.words)) {
    throw new Error('Некорректный формат ответа от Claude')
  }
  return parsed.words
}
