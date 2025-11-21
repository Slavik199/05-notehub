import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import toast, { Toaster } from 'react-hot-toast'
import styles from './App.module.css'

import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import NoteList from '../NoteList/NoteList'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'

export default function App() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <Pagination page={page} onPageChange={setPage} />
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main>
        <NoteList search={debouncedSearch} page={page} />
      </main>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={() => {
            closeModal()
            toast.success('Note created!')
          }} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  )
}