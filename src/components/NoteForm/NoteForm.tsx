import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import styles from './NoteForm.module.css';

import type { NoteTag } from '../../types/note';
import { createNote } from '../../services/noteService';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required field'),
  content: Yup.string()
    .max(500, 'Maximum 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Please select a valid tag')
    .required('Required field'),
});

export interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully!');
      onSuccess();
    },
    onError: () => {
      toast.error('Error creating note');
    },
  });

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        tag: '' as NoteTag,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values, {
          onSuccess: () => {
            resetForm();
          },
        });
      }}
    >
      {() => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field 
              id="title"
              name="title" 
              type="text" 
              className={styles.input} 
            />
            <ErrorMessage name="title" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field 
              as="textarea" 
              id="content"
              name="content" 
              rows={8} 
              className={styles.textarea} 
            />
            <ErrorMessage name="content" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field 
              as="select" 
              id="tag"
              name="tag" 
              className={styles.select}
            >
              <option value="">Select a tag</option>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}