import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotesDisplay from "@/components/NotesDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getNoteById } from "@/services/notesService"; 


const StudyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Used to grab data passed from Index.tsx
  
  // 1. Initialize state with data passed via navigate(state), if available
  const [note, setNote] = useState<any>(location.state?.notes ? {
    data: location.state.notes,
    rawTranscript: location.state.rawTranscript,
    title: "Loading...", // Temporary title until we verify
    date: new Date()
  } : null);
  
  const [loading, setLoading] = useState(!note);

  useEffect(() => {
    const fetchNote = async () => {
      // If we already have the note from navigation state, don't fetch
      if (location.state?.notes && note) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 2. Fetch from Firestore if not in state (or on refresh)
        const foundNote = await getNoteById(id!); 
        if (foundNote) {
          setNote(foundNote);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Retrieving your study materials...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Note not found</h2>
        <Button onClick={() => navigate("/library")}>Go to Library</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/library")}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {note.title || "Untitled Note"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Generated on {note.date?.toDate ? note.date.toDate().toLocaleDateString() : new Date(note.date).toLocaleDateString()}
            </p>
          </div>

          <NotesDisplay 
            notes={note.data} 
            rawTranscript={note.rawTranscript}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudyView;