// Кнопка переключения между тёмной и светлой темой
import { useAppData } from '../context/AppDataContext'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, setTheme, t } = useAppData()
  const isLight = theme === 'light'
  const title = isLight ? t('layout.enableDarkTheme') : t('layout.enableLightTheme')

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      title={title}
      aria-label={t('layout.toggleTheme')}
    >
      {isLight ? '🌙' : '☀️'}
    </button>
  )
}
