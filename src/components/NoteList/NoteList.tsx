import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import styles from './NoteList.module.css';

import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this note?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>
            <button
              className={styles.button}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}