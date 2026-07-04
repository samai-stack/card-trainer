// Общий каркас страниц: шапка с названием, ссылкой на статистику и переключателем темы
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import styles from './Layout.module.css'

export function Layout() {
  const location = useLocation()
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
          🧠 Карточки
        </Link>
        <nav className={styles.nav}>
          <Link to="/stats" className={styles.navLink}>
            Статистика
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
