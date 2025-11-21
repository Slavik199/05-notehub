import axios from 'axios'
import type { Note, NoteTag } from '../types/note'

const API_BASE = 'https://notehub-public.goit.study/api/notes'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    accept: 'application/json',
  },
})

export interface FetchNotesResponse {
  notes: Note[]
  totalPages: number
  currentPage: number
  perPage: number
}

export interface CreateNoteData {
  title: string
  content: string
  tag: NoteTag
}

export const fetchNotes = async (
  page: number = 1,
  search: string = ''
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('', {
    params: {
      page,
      perPage: 12,
      search: search.trim() || undefined,
    },
  })
  return response.data
}

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post<{ note: Note }>('', data)
  return response.data.note
}

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/${id}`)
  return response.data
}