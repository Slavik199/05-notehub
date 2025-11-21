import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import toast, { Toaster } from 'react-hot-toast'
import styles from './App.module.css'

import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import NoteList from '../NoteList/NoteList'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'
import Loader from '../Loader/Loader'

import { fetchNotes } from '../../services/noteService'

export default function App() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(page, debouncedSearch),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  })

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 1

  // Скидаємо сторінку при зміні пошуку
useEffect(() => {
    setPage(prev => prev === 1 ? prev : 1)
  }, [debouncedSearch])

  const handlePageChange = (selected: number) => {
    setPage(selected + 1)
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleNoteCreated = () => {
    closeModal()
    toast.success('Note created!')
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  }

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        {isError && toast.error('Failed to load notes')}
        {notes.length === 0 && !isLoading && (
          <p className={styles.empty}>No notes found</p>
        )}
        {notes.length > 0 && <NoteList notes={notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={handleNoteCreated} onCancel={closeModal} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  )
}