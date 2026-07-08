// Словари переводов интерфейса. Данные пользователя (слова, названия колод)
// не переводятся — только элементы интерфейса (кнопки, подписи, сообщения)
export const LANGUAGES = ['ru', 'en']
export const DEFAULT_LANGUAGE = 'ru'

const ru = {
  'lang.name': 'Русский',

  // Общее
  'common.cancel': 'Отмена',
  'common.save': 'Сохранить',
  'common.delete': 'Удалить',
  'common.edit': 'Редактировать',
  'common.home': 'На главную',

  // Шапка (Layout)
  'layout.logo': '🧠 Карточки',
  'layout.stats': 'Статистика',
  'layout.switchLanguage': 'Переключить язык интерфейса',
  'layout.enableDarkTheme': 'Включить тёмную тему',
  'layout.enableLightTheme': 'Включить светлую тему',
  'layout.toggleTheme': 'Переключить тему',

  // Главная страница
  'home.title': 'Мои колоды',
  'home.newDeckPlaceholder': 'Название новой колоды',
  'home.createDeck': 'Создать колоду',
  'home.enterDeckName': 'Введите название колоды',
  'home.deckExists': 'Колода «{{name}}» уже существует',
  'home.top1000Add': '+ Добавить готовую колоду «Топ-1000 слов»',
  'home.top1000Added': 'Колода «Топ-1000 слов» уже добавлена',
  'home.generateDeck': '🤖 Сгенерировать колоду по теме',
  'home.empty': 'Пока нет ни одной колоды. Создайте первую, чтобы начать добавлять слова.',
  'home.deleteDeckTitle': 'Удалить колоду «{{name}}»?',
  'home.deleteDeckMessage':
    'Все слова ({{count}}) внутри колоды будут удалены без возможности восстановления.',

  // Плитка колоды
  'deckTile.rename': 'Переименовать',
  'deckTile.delete': 'Удалить колоду',
  'deckTile.due': '{{count}} ждут повторения',
  'deckTile.nothingDue': 'нечего повторять',
  'deckTile.open': 'Открыть',
  'deckTile.review': 'Повторить',
  'deckTile.word_one': 'слово',
  'deckTile.word_few': 'слова',
  'deckTile.word_many': 'слов',

  // Страница колоды
  'deck.back': '← Все колоды',
  'deck.notFound': 'Такая колода не найдена — возможно, она была удалена.',
  'deck.subtitle': '{{total}} {{wordForm}}, {{due}} ждут повторения сегодня',
  'deck.directionLabel': 'Направление тренировки',
  'deck.directionForward': 'Слово → перевод',
  'deck.directionReverse': 'Перевод → слово',
  'deck.answerModeLabel': 'Способ ответа',
  'deck.answerModeFlip': 'Карточки',
  'deck.answerModeType': 'Ввод с клавиатуры',
  'deck.answerModeListen': '🎧 Аудирование',
  'deck.listenModeLabel': 'Что печатать',
  'deck.listenModeTranslate': 'Перевод',
  'deck.listenModeDictation': 'Слово на слух',
  'deck.startTraining': 'Начать тренировку',
  'deck.bulkImport': '📋 Массовый импорт слов',
  'deck.importSuccess': 'Добавлено слов: {{count}}',
  'deck.autoFillEmoji': '🎲 Заполнить эмодзи автоматически',
  'deck.bulkUpload': '📁 Загрузить картинки пачкой',
  'deck.allHaveImages': 'У всех слов уже есть картинка',
  'deck.emojiFilled': 'Готово: эмодзи найдены для {{filled}} из {{candidates}} слов без картинки',
  'deck.bulkUploaded': 'Загружено {{matched}} из {{total}}',
  'deck.bulkUnmatched': '. Не найдено слов для: {{names}}',
  'deck.searchPlaceholder': 'Поиск по словам или переводу…',
  'deck.emptyDeck': 'В этой колоде пока нет слов. Добавьте первое с помощью формы выше.',
  'deck.noResults': 'Ничего не найдено по запросу «{{query}}»',
  'deck.deleteWordTitle': 'Удалить слово «{{word}}»?',

  // Форма добавления слова
  'wordForm.wordPlaceholder': 'Слово (на английском)',
  'wordForm.translationPlaceholder': 'Перевод',
  'wordForm.examplePlaceholder': 'Пример предложения (необязательно)',
  'wordForm.fillRequired': 'Заполните слово и перевод',
  'wordForm.duplicate': 'Слово «{{word}}» уже есть в этой колоде',
  'wordForm.imageFailed': 'Не удалось загрузить картинку',
  'wordForm.addImage': '🖼️ Добавить картинку',
  'wordForm.submit': 'Добавить слово',

  // Строка слова (просмотр/редактирование)
  'wordRow.wordPlaceholder': 'Слово',
  'wordRow.translationPlaceholder': 'Перевод',
  'wordRow.examplePlaceholder': 'Пример (необязательно)',
  'wordRow.emptyFields': 'Слово и перевод не должны быть пустыми',
  'wordRow.image': '🖼️ Картинка',
  'progressDots.title': 'Уровень знания: {{box}} из 5',

  // Тренировка
  'training.deckNotFound': 'Такая колода не найдена.',
  'training.emptyTitle': 'В этой колоде пока нет слов',
  'training.emptyHint': 'Добавьте несколько слов, чтобы начать тренировку.',
  'training.toDeck': 'К колоде',
  'training.sessionComplete': 'Сессия завершена',
  'training.wordsReviewed': 'Слов повторено: {{count}}',
  'training.again': 'Ещё раз',
  'training.hard': 'Трудно',
  'training.good': 'Хорошо',
  'training.easy': 'Легко',
  'training.restart': 'Ещё раз',
  'training.directionSuffix': ' · ввод',
  'training.listenSuffixTranslate': ' · аудирование: перевод',
  'training.listenSuffixDictation': ' · аудирование: слово на слух',
  'training.freePractice': '🔁 Свободная тренировка',
  'training.freePracticeHint':
    'Сегодня по расписанию повторять нечего — тренируемся всеми словами колоды',
  'training.finish': 'Завершить',
  'training.flipHint': 'Нажмите на карточку или пробел, чтобы увидеть перевод',

  // Карточка
  'flashcard.hint': 'нажмите, чтобы перевернуть',

  // Ввод с клавиатуры
  'typing.placeholder': 'Введите слово…',
  'typing.giveUp': 'Не знаю',
  'typing.check': 'Проверить',
  'typing.correct': '✅ Верно!',
  'typing.wrongAnswer': 'Правильный ответ: «{{answer}}»',
  'typing.next': 'Далее',

  // Аудирование (озвучка через Web Speech API)
  'listening.replay': 'Слушать снова',
  'listening.unsupported': 'Озвучка не поддерживается этим браузером — слово показано текстом',
  'listening.heardWord': 'Вы слышали слово: «{{word}}»',
  'listening.placeholderTranslate': 'Введите перевод…',
  'listening.placeholderDictation': 'Введите услышанное слово…',

  // Статистика
  'stats.title': 'Статистика',
  'stats.total': 'Всего слов',
  'stats.learned': 'Выучено',
  'stats.inProgress': 'В процессе',
  'stats.new': 'Новых',
  'stats.streak': '{{count}} {{dayForm}} подряд',
  'stats.streakHintActive': 'Так держать, не прерывайте серию!',
  'stats.streakHintInactive': 'Потренируйтесь сегодня, чтобы начать серию',
  'stats.activityTitle': 'Активность за 14 дней',
  'stats.day_one': 'день',
  'stats.day_few': 'дня',
  'stats.day_many': 'дней',

  // Дневная цель
  'dailyGoal.streakTitle': 'Дней подряд с тренировкой',
  'dailyGoal.label': 'Цель на день: {{done}} / {{goal}}',
  'dailyGoal.change': 'Изменить',
  'dailyGoal.wordsOption': '{{n}} слов',

  // Напоминания
  'reminder.unsupported': '🔔 Ваш браузер не поддерживает уведомления.',
  'reminder.title': 'Напоминания о тренировке',
  'reminder.enabledSubtitle':
    'Включены — уведомление придёт в {{time}}, если цель на день ещё не выполнена',
  'reminder.disabledSubtitle': 'Присылать уведомление в браузере, если сегодня ещё не тренировались',
  'reminder.turnOff': 'Выключить',
  'reminder.turnOn': 'Включить',
  'reminder.timeLabel': 'Время напоминания',
  'reminder.denied':
    'Уведомления заблокированы в браузере. Разрешите их в настройках сайта, чтобы напоминания приходили.',
  'reminder.note': 'Напоминание сработает, только если вкладка с приложением открыта в браузере в нужный момент.',
  'reminder.notificationTitle': 'Пора потренироваться! 🧠',
  'reminder.notificationBody': 'Сегодня повторено {{done}} из {{goal}} слов. Загляните в тренажёр карточек.',

  // Массовый импорт слов
  'import.title': '📋 Массовый импорт слов',
  'import.placeholder': 'cat - кот - The cat is sleeping\ndog - собака\nrun - бежать',
  'import.hint':
    'По одному слову на строку. Поля разделяйте табуляцией (при вставке из таблицы), дефисом «слово - перевод - пример» или запятой/точкой с запятой. Пример не обязателен.',
  'import.willAdd': 'Будет добавлено: {{count}}',
  'import.duplicatesSkipped': 'Пропущено (уже есть в колоде): {{count}}',
  'import.invalidSkipped': 'Не распознано строк: {{count}}',
  'import.submit': 'Импортировать ({{count}})',

  // Генерация колоды
  'generate.title': '🤖 Сгенерировать колоду по теме',
  'generate.topicLabel': 'Тема',
  'generate.topicPlaceholder': 'Например: путешествия',
  'generate.countLabel': 'Слов',
  'generate.levelLabel': 'Уровень',
  'generate.apiKeyLabel': 'API-ключ Anthropic',
  'generate.hint':
    'Ключ хранится только в этом браузере и отправляется напрямую в Anthropic API — без какого-либо своего сервера. Получить ключ можно в консоли Anthropic (console.anthropic.com). Каждый запрос расходует средства с вашего аккаунта Anthropic.',
  'generate.enterTopic': 'Введите тему колоды',
  'generate.enterApiKey': 'Введите API-ключ Anthropic',
  'generate.generating': 'Генерирую…',
  'generate.submit': 'Сгенерировать',
  'generate.genericError': 'Не удалось сгенерировать колоду',
  'generate.error.invalidApiKey': 'Неверный API-ключ Anthropic',
  'generate.error.rateLimited': 'Превышен лимит запросов к Anthropic API, попробуйте чуть позже',
  'generate.error.apiError': 'Ошибка Anthropic API ({{status}})',
  'generate.error.refusal': 'Claude отказался генерировать ответ на этот запрос',
  'generate.error.noResponse': 'Не удалось получить ответ от Claude',
  'generate.error.badJson': 'Claude вернул ответ в неожиданном формате',
  'generate.error.badFormat': 'Некорректный формат ответа от Claude',
}

const en = {
  'lang.name': 'English',

  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.home': 'Home',

  'layout.logo': '🧠 Flashcards',
  'layout.stats': 'Stats',
  'layout.switchLanguage': 'Switch interface language',
  'layout.enableDarkTheme': 'Switch to dark theme',
  'layout.enableLightTheme': 'Switch to light theme',
  'layout.toggleTheme': 'Toggle theme',

  'home.title': 'My Decks',
  'home.newDeckPlaceholder': 'New deck name',
  'home.createDeck': 'Create deck',
  'home.enterDeckName': 'Enter a deck name',
  'home.deckExists': 'Deck "{{name}}" already exists',
  'home.top1000Add': '+ Add preset deck "Top 1000 words"',
  'home.top1000Added': 'Deck "Top 1000 words" already added',
  'home.generateDeck': '🤖 Generate a deck by topic',
  'home.empty': "You don't have any decks yet. Create your first one to start adding words.",
  'home.deleteDeckTitle': 'Delete deck "{{name}}"?',
  'home.deleteDeckMessage': 'All words ({{count}}) in this deck will be permanently deleted.',

  'deckTile.rename': 'Rename',
  'deckTile.delete': 'Delete deck',
  'deckTile.due': '{{count}} due for review',
  'deckTile.nothingDue': 'nothing to review',
  'deckTile.open': 'Open',
  'deckTile.review': 'Review',
  'deckTile.word_one': 'word',
  'deckTile.word_few': 'words',
  'deckTile.word_many': 'words',

  'deck.back': '← All decks',
  'deck.notFound': "This deck wasn't found — it may have been deleted.",
  'deck.subtitle': '{{total}} {{wordForm}}, {{due}} due for review today',
  'deck.directionLabel': 'Practice direction',
  'deck.directionForward': 'Word → translation',
  'deck.directionReverse': 'Translation → word',
  'deck.answerModeLabel': 'Answer method',
  'deck.answerModeFlip': 'Flashcards',
  'deck.answerModeType': 'Typing',
  'deck.answerModeListen': '🎧 Listening',
  'deck.listenModeLabel': 'What to type',
  'deck.listenModeTranslate': 'Translation',
  'deck.listenModeDictation': 'Word you heard',
  'deck.startTraining': 'Start practice',
  'deck.bulkImport': '📋 Bulk import words',
  'deck.importSuccess': '{{count}} words added',
  'deck.autoFillEmoji': '🎲 Auto-fill emoji',
  'deck.bulkUpload': '📁 Bulk upload images',
  'deck.allHaveImages': 'All words already have an image',
  'deck.emojiFilled': 'Done: found emoji for {{filled}} of {{candidates}} words without an image',
  'deck.bulkUploaded': 'Uploaded {{matched}} of {{total}}',
  'deck.bulkUnmatched': '. No matching word found for: {{names}}',
  'deck.searchPlaceholder': 'Search words or translations…',
  'deck.emptyDeck': 'This deck has no words yet. Add the first one using the form above.',
  'deck.noResults': 'No results for "{{query}}"',
  'deck.deleteWordTitle': 'Delete word "{{word}}"?',

  'wordForm.wordPlaceholder': 'Word (in English)',
  'wordForm.translationPlaceholder': 'Translation',
  'wordForm.examplePlaceholder': 'Example sentence (optional)',
  'wordForm.fillRequired': 'Fill in the word and translation',
  'wordForm.duplicate': 'The word "{{word}}" is already in this deck',
  'wordForm.imageFailed': "Couldn't load the image",
  'wordForm.addImage': '🖼️ Add image',
  'wordForm.submit': 'Add word',

  'wordRow.wordPlaceholder': 'Word',
  'wordRow.translationPlaceholder': 'Translation',
  'wordRow.examplePlaceholder': 'Example (optional)',
  'wordRow.emptyFields': 'Word and translation cannot be empty',
  'wordRow.image': '🖼️ Image',
  'progressDots.title': 'Knowledge level: {{box}} of 5',

  'training.deckNotFound': "This deck wasn't found.",
  'training.emptyTitle': 'This deck has no words yet',
  'training.emptyHint': 'Add some words to start practicing.',
  'training.toDeck': 'To deck',
  'training.sessionComplete': 'Session complete',
  'training.wordsReviewed': 'Words reviewed: {{count}}',
  'training.again': 'Again',
  'training.hard': 'Hard',
  'training.good': 'Good',
  'training.easy': 'Easy',
  'training.restart': 'Train again',
  'training.directionSuffix': ' · typing',
  'training.listenSuffixTranslate': ' · listening: translation',
  'training.listenSuffixDictation': ' · listening: word you heard',
  'training.freePractice': '🔁 Free practice',
  'training.freePracticeHint':
    "Nothing scheduled for review today — practicing with all words in the deck",
  'training.finish': 'Finish',
  'training.flipHint': 'Click the card or press space to reveal the translation',

  'flashcard.hint': 'click to flip',

  'typing.placeholder': 'Type the word…',
  'typing.giveUp': "Don't know",
  'typing.check': 'Check',
  'typing.correct': '✅ Correct!',
  'typing.wrongAnswer': 'Correct answer: "{{answer}}"',
  'typing.next': 'Next',

  'listening.replay': 'Listen again',
  'listening.unsupported': "This browser doesn't support speech synthesis — the word is shown as text instead",
  'listening.heardWord': 'You heard the word: "{{word}}"',
  'listening.placeholderTranslate': 'Type the translation…',
  'listening.placeholderDictation': 'Type the word you heard…',

  'stats.title': 'Statistics',
  'stats.total': 'Total words',
  'stats.learned': 'Learned',
  'stats.inProgress': 'In progress',
  'stats.new': 'New',
  'stats.streak': '{{count}} {{dayForm}} in a row',
  'stats.streakHintActive': "Keep it up, don't break the streak!",
  'stats.streakHintInactive': 'Practice today to start a streak',
  'stats.activityTitle': 'Activity over the last 14 days',
  'stats.day_one': 'day',
  'stats.day_few': 'days',
  'stats.day_many': 'days',

  'dailyGoal.streakTitle': 'Day streak',
  'dailyGoal.label': 'Daily goal: {{done}} / {{goal}}',
  'dailyGoal.change': 'Change',
  'dailyGoal.wordsOption': '{{n}} words',

  'reminder.unsupported': "🔔 Your browser doesn't support notifications.",
  'reminder.title': 'Practice reminders',
  'reminder.enabledSubtitle': "Enabled — you'll get a notification at {{time}} if today's goal isn't met yet",
  'reminder.disabledSubtitle': "Get a browser notification if you haven't practiced today",
  'reminder.turnOff': 'Turn off',
  'reminder.turnOn': 'Turn on',
  'reminder.timeLabel': 'Reminder time',
  'reminder.denied':
    'Notifications are blocked in the browser. Allow them in the site settings so reminders can work.',
  'reminder.note': "The reminder only fires while the app's tab is open in the browser at that moment.",
  'reminder.notificationTitle': 'Time to practice! 🧠',
  'reminder.notificationBody': "You've reviewed {{done}} of {{goal}} words today. Open the flashcard trainer.",

  // Bulk word import
  'import.title': '📋 Bulk import words',
  'import.placeholder': 'cat - кот - The cat is sleeping\ndog - собака\nrun - бежать',
  'import.hint':
    "One word per line. Separate fields with a tab (when pasting from a spreadsheet), a dash \"word - translation - example\", or a comma/semicolon. The example is optional.",
  'import.willAdd': '{{count}} to be added',
  'import.duplicatesSkipped': '{{count}} skipped (already in deck)',
  'import.invalidSkipped': "{{count}} line(s) not recognized",
  'import.submit': 'Import ({{count}})',

  'generate.title': '🤖 Generate a deck by topic',
  'generate.topicLabel': 'Topic',
  'generate.topicPlaceholder': 'E.g. travel',
  'generate.countLabel': 'Words',
  'generate.levelLabel': 'Level',
  'generate.apiKeyLabel': 'Anthropic API key',
  'generate.hint':
    "The key is stored only in this browser and sent directly to the Anthropic API — no server of ours is involved. Get a key at the Anthropic console (console.anthropic.com). Each request uses up credit on your Anthropic account.",
  'generate.enterTopic': 'Enter a deck topic',
  'generate.enterApiKey': 'Enter your Anthropic API key',
  'generate.generating': 'Generating…',
  'generate.submit': 'Generate',
  'generate.genericError': "Couldn't generate the deck",
  'generate.error.invalidApiKey': 'Invalid Anthropic API key',
  'generate.error.rateLimited': 'Anthropic API rate limit exceeded, try again shortly',
  'generate.error.apiError': 'Anthropic API error ({{status}})',
  'generate.error.refusal': 'Claude declined to generate a response for this request',
  'generate.error.noResponse': "Couldn't get a response from Claude",
  'generate.error.badJson': 'Claude returned a response in an unexpected format',
  'generate.error.badFormat': "Claude's response format was invalid",
}

export const TRANSLATIONS = { ru, en }

// Простая интерполяция {{var}} в строке перевода
export function translate(lang, key, vars) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE]
  let text = dict[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{{${k}}}`, v)
    }
  }
  return text
}

// Число-зависимая форма слова (счётное существительное): в русском 3 формы,
// в английском — 2. key — базовый префикс перевода, например 'deckTile.word'
// (ожидает ключи '<key>_one' / '<key>_few' / '<key>_many' в словаре)
export function pluralKey(lang, count) {
  if (lang === 'en') {
    return count === 1 ? '_one' : '_few'
  }
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return '_one'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return '_few'
  return '_many'
}
