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
// массив { word, translation, example }. При сбое бросает Error с полем i18nCode
// для перевода на языке интерфейса (см. createI18nError).
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
      throw createI18nError('invalidApiKey')
    }
    if (response.status === 429) {
      throw createI18nError('rateLimited')
    }
    throw createI18nError('apiError', { status: response.status }, message)
  }

  const data = await response.json()
  if (data.stop_reason === 'refusal') {
    throw createI18nError('refusal')
  }

  const textBlock = (data.content || []).find((block) => block.type === 'text')
  if (!textBlock) {
    throw createI18nError('noResponse')
  }

  let parsed
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw createI18nError('badJson')
  }
  if (!Array.isArray(parsed.words)) {
    throw createI18nError('badFormat')
  }
  return parsed.words
}

// Создаёт Error с кодом для перевода (i18nCode/i18nVars): GenerateDeckDialog
// превращает его в t('generate.error.<code>', vars). fallbackMessage — только
// для message (например, для консоли), интерфейс его не показывает.
function createI18nError(code, vars, fallbackMessage) {
  const err = new Error(fallbackMessage || code)
  err.i18nCode = code
  err.i18nVars = vars
  return err
}
