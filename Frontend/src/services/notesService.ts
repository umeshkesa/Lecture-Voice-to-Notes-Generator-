import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc, // Added this import
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Note {
  date: Date | Timestamp;
  id?: string;
  userId: string;
  title: string;
  sourceName: string;
  sourceType: 'audio' | 'text';
  rawTranscript: string;
  data: {
    summary: string;
    keyPoints: string[];
    quizQuestions: any[];
    flashcards?: any[]; // Added optional flashcards if your AI generates them
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

const NOTES_COLLECTION = 'notes';

// --- NEW: Get a single note by ID (Fixes the "Note not found" on refresh) ---
export const getNoteById = async (noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    const snap = await getDoc(noteRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Note;
    }
    return null;
  } catch (error) {
    console.error("Error fetching single note:", error);
    throw error;
  }
};

// Save note to Firestore
export const saveNote = async (userId: string, noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const note = {
    ...noteData,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, NOTES_COLLECTION), note);
  return { id: docRef.id, ...note };
};

// Get all notes for a user
export const getUserNotes = async (userId: string) => {
  const q = query(
    collection(db, NOTES_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Note[];
};

// Update note
export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

// Delete note
export const deleteNote = async (noteId: string) => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await deleteDoc(noteRef);
};