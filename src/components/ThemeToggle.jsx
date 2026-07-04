// Кнопка переключения между тёмной и светлой темой
import { useAppData } from '../context/AppDataContext'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, setTheme } = useAppData()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      title={isLight ? 'Включить тёмную тему' : 'Включить светлую тему'}
      aria-label="Переключить тему"
    >
      {isLight ? '🌙' : '☀️'}
    </button>
  )
}
