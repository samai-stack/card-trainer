// Корневой компонент: подключает хранилище данных и роутинг между страницами
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DeckPage } from './pages/DeckPage'
import { TrainingPage } from './pages/TrainingPage'
import { StatsPage } from './pages/StatsPage'

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/deck/:deckId" element={<DeckPage />} />
            <Route path="/deck/:deckId/train" element={<TrainingPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  )
}

export default App
