
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookMarked,
  Calendar,
  ChevronRight,
  Trash2,
  Mic,
  FileText,
  Pencil,
  Check,
  X,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserNotes,
  deleteNote as deleteNoteFromDB,
  Note,
} from "@/services/notesService";
import { useToast } from "@/hooks/use-toast";

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  /* -------------------- LOAD NOTES -------------------- */

  useEffect(() => {
    if (user) loadNotes();
    else loadLocalNotes();
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userNotes = await getUserNotes(user.uid);
      setNotes(userNotes);
    } catch (error) {
      toast({
        title: "Error loading notes",
        description: "Failed to load your study materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocalNotes = () => {
    const saved = JSON.parse(localStorage.getItem("study-library") || "[]");
    setNotes(saved);
    setLoading(false);
  };

  /* -------------------- DELETE NOTE -------------------- */

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (user) {
        await deleteNoteFromDB(id);
        setNotes(notes.filter((n) => n.id !== id));
      } else {
        const updated = notes.filter((n) => n.id !== id);
        setNotes(updated);
        localStorage.setItem("study-library", JSON.stringify(updated));
      }

      toast({ title: "Note deleted" });
    } catch {
      toast({
        title: "Error deleting note",
        variant: "destructive",
      });
    }
  };

  /* -------------------- RENAME NOTE -------------------- */

  const handleRename = (noteId: string, title: string) => {
    setEditingId(noteId);
    setEditingTitle(title);
  };

  const handleSaveRename = async (noteId: string) => {
    if (!editingTitle.trim()) {
      toast({
        title: "Title required",
        variant: "destructive",
      });
      return;
    }

    try {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, title: editingTitle } : n
        )
      );

      setEditingId(null);
      setEditingTitle("");
      toast({ title: "Note renamed" });
    } catch {
      toast({
        title: "Error renaming note",
        variant: "destructive",
      });
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  /* -------------------- HELPERS -------------------- */

  const formatDate = (date: any) => {
    if (date?.toDate) return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  /* -------------------- STATES -------------------- */

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center border-2 border-dashed rounded-2xl">
          <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            Sign in to access your library
          </h2>
          <p className="text-muted-foreground mb-6">
            Your notes will sync across devices
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Library</h1>
            <p className="text-muted-foreground">
              {notes.length} saved notes
            </p>
          </div>
          <BookMarked className="w-6 h-6 text-primary" />
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              No study notes yet
            </h2>
            <Link to="/">
              <Button>Create your first note</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link
                key={note.id}
                to={`/study/${note.id}`}
                className="group"
              >
                <div className="h-full p-6 rounded-xl border bg-card hover:border-primary transition">
                  {/* DATE + ACTIONS */}
                  <div className="flex justify-between mb-4">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.createdAt || note.date)}
                    </span>

                    <div className="flex gap-10">
                      {editingId === note.id ? (
                        <>
                          <button onClick={() => handleSaveRename(note.id!)}>
                            <Check className="w-4 h-4  text-green-600" />
                          </button>
                          <button onClick={handleCancelRename}>
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRename(note.id!, note.title);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(note.id!, e)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* TITLE */}
                  {editingId === note.id ? (
                    <input
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                      autoFocus
                      className="w-full border px-2 py-1 rounded"
                    />
                  ) : (
                    <h3 className="text-lg font-bold mb-3">
                      {note.title}
                    </h3>
                  )}

                  {/* SOURCE */}
                  <div className="text-xs flex items-center gap-1 mb-4">
                    {note.sourceType === "audio" ? (
                      <Mic className="w-3 h-3" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    {note.sourceName}
                  </div>

                  <div className="mt-auto flex items-center text-primary text-sm">
                    View Study Materials
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;

