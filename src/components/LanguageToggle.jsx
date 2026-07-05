// Кнопка переключения языка интерфейса (ru / en)
import { useAppData } from '../context/AppDataContext'
import { LANGUAGES } from '../i18n/translations'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  const { language, setLanguage, t } = useAppData()

  function handleClick() {
    const currentIndex = LANGUAGES.indexOf(language)
    const next = LANGUAGES[(currentIndex + 1) % LANGUAGES.length]
    setLanguage(next)
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleClick}
      title={t('layout.switchLanguage')}
      aria-label={t('layout.switchLanguage')}
    >
      {language.toUpperCase()}
    </button>
  )
}
