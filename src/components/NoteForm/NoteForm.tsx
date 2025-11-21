import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import styles from './NoteForm.module.css'

import type { NoteTag } from '../../types/note'
import { createNote } from '../../services/noteService'

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Мінімум 3 символи')
    .max(50, 'Максимум 50 символів')
    .required("Обов'язкове поле"),
  content: Yup.string()
    .max(500, 'Максимум 500 символів')
    .required("Обов'язкове поле"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required("Обов'язкове поле"),
})

export interface NoteFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast.success('Нотатка успішно створена!')
      onSuccess()
    },
    onError: () => {
      toast.error('Помилка при створенні нотатки')
    },
  })

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        tag: '' as NoteTag,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        mutation.mutate(values, {
          onSuccess: () => resetForm(),
          onSettled: () => setSubmitting(false),
        })
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" className={styles.input} />
            <ErrorMessage name="title" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" name="content" rows={8} className={styles.textarea} />
            <ErrorMessage name="content" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" name="tag" className={styles.select}>
              <option value="" disabled>Оберіть тег</option>
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting ? 'Створення...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}