import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import styles from './App.module.css';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';

import { fetchNotes } from '../../services/noteService';

export default function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  
    setPage(1);
  }, []);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNoteCreated = () => {
    closeModal();
    toast.success('Note created!');
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load notes');
    }
  }, [isError]);

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
       
        <SearchBox value={search} onChange={handleSearchChange} />
        
        {totalPages > 1 && (
          <Pagination
            page={page - 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        
        {!isLoading && notes.length > 0 && <NoteList notes={notes} />}
        
        {!isLoading && notes.length === 0 && (
          <p className={styles.empty}>No notes found</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={handleNoteCreated} onCancel={closeModal} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
}