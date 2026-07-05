// Озвучка английских слов через Web Speech API (SpeechSynthesis) для режима аудирования.
// Работает полностью в браузере пользователя, ничего никуда не отправляется
export const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text, lang = 'en-US') {
  if (!isSpeechSupported || !text) return
  window.speechSynthesis.cancel() // прерываем предыдущую озвучку, если она ещё звучит
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}
