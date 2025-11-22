import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: API_BASE,
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  message: string;
  note: Note;
}

export const fetchNotes = async (
  page: number = 1,
  search: string = ''
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      search: search.trim() || undefined,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post<{ note: Note }>(
    '/notes',
    data,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data.note;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response = await api.delete<DeleteNoteResponse>(
    `/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};