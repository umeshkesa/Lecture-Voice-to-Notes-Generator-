import { auth } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get the current user's Firebase ID token
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Make authenticated API request
 */
const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

/**
 * Upload audio file for transcription
 */
export const uploadAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await authenticatedFetch('/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

/**
 * Process text transcript
 */
export const processTranscript = async (transcript: string) => {
  const response = await authenticatedFetch('/process-transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Processing failed');
  }

  return response.json();
};

/**
 * Generate custom quiz
 */
export const generateQuiz = async (
  transcript: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5
) => {
  const response = await authenticatedFetch('/generate-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript, difficulty, count }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Quiz generation failed');
  }

  return response.json();
};

/**
 * Verify fact from transcript
 */
export const verifyFact = async (transcript: string, query: string) => {
  const response = await authenticatedFetch('/verify-fact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript, query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fact verification failed');
  }

  return response.json();
};

/**
 * Check API health
 */
export const checkHealth = async () => {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
};

