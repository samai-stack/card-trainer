// Встроенный словарь «слово → эмодзи» для быстрого автозаполнения картинок.
// Покрывает только слова, для которых есть однозначный эмодзи — остальные слова
// (грамматические, абстрактные понятия) останутся без картинки, это нормально
export const WORD_EMOJI_MAP = {
  // Приветствия и общение
  hello: '👋', hi: '👋', goodbye: '👋', bye: '👋', 'thank you': '🙏', thanks: '🙏',
  please: '🙏', sorry: '😔', welcome: '🤗', yes: '✅', no: '❌', okay: '👌',

  // Числа
  zero: '0️⃣', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣', five: '5️⃣',
  six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟', hundred: '💯',

  // Цвета
  red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', black: '⚫', white: '⚪',
  brown: '🟤', purple: '🟣', pink: '💗', gray: '🌫️',

  // Животные
  dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', horse: '🐴', cow: '🐮', pig: '🐷',
  sheep: '🐑', goat: '🐐', chicken: '🐔', duck: '🦆', rabbit: '🐰', mouse: '🐭',
  lion: '🦁', tiger: '🐯', bear: '🐻', elephant: '🐘', monkey: '🐒', wolf: '🐺',
  fox: '🦊', deer: '🦌', snake: '🐍', frog: '🐸', insect: '🐛', bee: '🐝',
  butterfly: '🦋', spider: '🕷️', ant: '🐜', animal: '🐾',

  // Еда и напитки
  food: '🍽️', water: '💧', milk: '🥛', juice: '🧃', coffee: '☕', tea: '🍵',
  bread: '🍞', butter: '🧈', cheese: '🧀', egg: '🥚', meat: '🥩', rice: '🍚',
  pasta: '🍝', soup: '🍲', salad: '🥗', fruit: '🍇', vegetable: '🥦', apple: '🍎',
  banana: '🍌', orange: '🍊', potato: '🥔', tomato: '🍅', onion: '🧅', carrot: '🥕',
  salt: '🧂', cake: '🎂', cookie: '🍪', chocolate: '🍫', candy: '🍬', 'ice cream': '🍦',
  breakfast: '🍳', lunch: '🍱', dinner: '🍽️',

  // Дом
  house: '🏠', home: '🏠', apartment: '🏢', door: '🚪', window: '🪟', wall: '🧱',
  stairs: '🪜', chair: '🪑', sofa: '🛋️', bed: '🛏️', mirror: '🪞', lamp: '💡',
  clock: '🕐', key: '🔑', soap: '🧼', garden: '🌳',

  // Одежда
  shirt: '👕', pants: '👖', jeans: '👖', dress: '👗', skirt: '👗', jacket: '🧥',
  coat: '🧥', shoes: '👟', boots: '🥾', socks: '🧦', hat: '🎩', glove: '🧤',
  scarf: '🧣', bag: '👜', wallet: '👛', glasses: '👓', watch: '⌚', ring: '💍',

  // Природа и погода
  sun: '☀️', moon: '🌙', star: '⭐', cloud: '☁️', rain: '🌧️', snow: '❄️',
  wind: '💨', storm: '⛈️', fire: '🔥', ice: '🧊', earth: '🌍', mountain: '⛰️',
  river: '🏞️', sea: '🌊', ocean: '🌊', beach: '🏖️', forest: '🌲', tree: '🌳',
  flower: '🌸', grass: '🌱', leaf: '🍃', rock: '🪨', sand: '🏖️', island: '🏝️',
  desert: '🏜️',

  // Люди и семья
  baby: '👶', boy: '👦', girl: '👧', man: '👨', woman: '👩', mother: '👩', mom: '👩',
  father: '👨', dad: '👨', grandmother: '👵', grandfather: '👴', friend: '🧑‍🤝‍🧑',
  doctor: '👨‍⚕️', nurse: '👩‍⚕️', teacher: '👩‍🏫', student: '🎓', soldier: '💂',
  artist: '🎨', writer: '✍️', singer: '🎤', cook: '👨‍🍳',

  // Части тела
  eye: '👁️', ear: '👂', nose: '👃', mouth: '👄', tooth: '🦷', hand: '✋',
  finger: '👆', leg: '🦵', foot: '🦶', heart: '❤️', brain: '🧠', blood: '🩸',

  // Спорт и хобби
  ball: '⚽', football: '⚽', basketball: '🏀', tennis: '🎾', swimming: '🏊',
  gym: '🏋️', music: '🎵', art: '🎨', photography: '📷', reading: '📖',
  travel: '✈️', vacation: '🏖️',

  // Время
  morning: '🌅', night: '🌙', week: '📅', month: '📅', year: '📆',

  // Транспорт
  car: '🚗', bus: '🚌', train: '🚆', plane: '✈️', bike: '🚲', motorcycle: '🏍️',
  boat: '⛵', ship: '🚢', taxi: '🚕', truck: '🚚', subway: '🚇',

  // Эмоции
  happy: '😊', sad: '😢', angry: '😠', afraid: '😨', surprised: '😲', tired: '😴',
  love: '❤️', hope: '🤞',

  // Деньги
  money: '💰', cash: '💵', coin: '🪙',

  // Техника
  computer: '💻', phone: '📱', internet: '🌐', email: '📧', camera: '📷',
  photo: '🖼️', video: '📹', game: '🎮', television: '📺', radio: '📻',

  // Частые глаголы
  eat: '🍽️', drink: '🥤', sleep: '😴', run: '🏃', swim: '🏊', write: '✍️',
  read: '📖', listen: '🎧', dance: '💃', sing: '🎤', walk: '🚶', fly: '✈️',
  drive: '🚗', cry: '😢', laugh: '😂', smile: '😊', understand: '🤔', learn: '📚',
  work: '💼', time: '⏰',
}

// Найти эмодзи для слова. Понимает формы вроде "to learn" (убирает частицу "to")
export function lookupEmoji(word) {
  const normalized = word.trim().toLowerCase()
  if (WORD_EMOJI_MAP[normalized]) return WORD_EMOJI_MAP[normalized]

  const withoutTo = normalized.replace(/^to\s+/, '')
  if (WORD_EMOJI_MAP[withoutTo]) return WORD_EMOJI_MAP[withoutTo]

  return null
}
