// Общий каркас страниц: шапка с названием, ссылкой на статистику и переключателями темы/языка
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import styles from './Layout.module.css'

export function Layout() {
  const location = useLocation()
  const { t } = useAppData()
  // В режиме тренировки шапку прячем, чтобы ничего не отвлекало от процесса
  const isTraining = location.pathname.includes('/train')

  if (isTraining) {
    return (
      <main className={styles.trainingMain}>
        <Outlet />
      </main>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          {t('layout.logo')}
        </Link>
        <nav className={styles.nav}>
          <Link to="/stats" className={styles.navLink}>
            {t('layout.stats')}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
