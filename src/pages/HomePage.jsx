// Главная страница: список колод + создание новой колоды
import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { DeckTile } from '../components/DeckTile'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DailyGoalWidget } from '../components/DailyGoalWidget'
import { TOP_1000_WORDS } from '../storage/topWords'
import styles from './HomePage.module.css'

const TOP_1000_DECK_NAME = 'Топ-1000 слов'

export function HomePage() {
  const { decks, addDeck, importDeck, renameDeck, deleteDeck } = useAppData()
  const [newDeckName, setNewDeckName] = useState('')
  const [deckToDelete, setDeckToDelete] = useState(null) // id колоды, которую собираемся удалить
  const [warning, setWarning] = useState('')

  const hasTop1000Deck = decks.some(
    (d) => d.name.trim().toLowerCase() === TOP_1000_DECK_NAME.toLowerCase()
  )

  function handleImportTop1000() {
    if (hasTop1000Deck) return
    importDeck(TOP_1000_DECK_NAME, TOP_1000_WORDS)
  }

  function handleCreateDeck(e) {
    e.preventDefault()
    const trimmed = newDeckName.trim()
    if (!trimmed) {
      setWarning('Введите название колоды')
      return
    }
    if (decks.some((d) => d.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setWarning(`Колода «${trimmed}» уже существует`)
      return
    }
    addDeck(trimmed)
    setNewDeckName('')
    setWarning('')
  }

  return (
    <div className={styles.page}>
      <DailyGoalWidget />

      <div className={styles.top}>
        <h1>Мои колоды</h1>
        <form className={styles.createForm} onSubmit={handleCreateDeck}>
          <input
            className="text-input"
            placeholder="Название новой колоды"
            value={newDeckName}
            onChange={(e) => {
              setNewDeckName(e.target.value)
              setWarning('')
            }}
          />
          <button type="submit" className="btn btn-primary">
            Создать колоду
          </button>
        </form>
        {warning && <p className={styles.warning}>{warning}</p>}

        <button
          type="button"
          className={styles.presetBtn}
          disabled={hasTop1000Deck}
          onClick={handleImportTop1000}
        >
          {hasTop1000Deck
            ? `Колода «${TOP_1000_DECK_NAME}» уже добавлена`
            : `+ Добавить готовую колоду «${TOP_1000_DECK_NAME}»`}
        </button>
      </div>

      {decks.length === 0 ? (
        <p className={styles.empty}>
          Пока нет ни одной колоды. Создайте первую, чтобы начать добавлять слова.
        </p>
      ) : (
        <div className={styles.grid}>
          {decks.map((deck) => (
            <DeckTile
              key={deck.id}
              deck={deck}
              onRename={(newName) => renameDeck(deck.id, newName)}
              onDelete={() => setDeckToDelete(deck)}
            />
          ))}
        </div>
      )}

      {deckToDelete && (
        <ConfirmDialog
          title={`Удалить колоду «${deckToDelete.name}»?`}
          message={`Все слова (${deckToDelete.cards.length}) внутри колоды будут удалены без возможности восстановления.`}
          onCancel={() => setDeckToDelete(null)}
          onConfirm={() => {
            deleteDeck(deckToDelete.id)
            setDeckToDelete(null)
          }}
        />
      )}
    </div>
  )
}
