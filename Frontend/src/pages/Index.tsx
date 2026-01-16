
import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import TranscriptInput from "@/components/TranscriptInput";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAudio, processTranscript } from "@/services/apiServices"; 
import { saveNote } from "@/services/notesService";
import { GeneratedNotes } from "@/components/NotesDisplay";
import { UploadSection } from "@/components/UploadSection";


const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "transcribing" | "analyzing" | "generating"
  >("analyzing");
  const [error, setError] = useState<string | null>(null);

  const hasInput = selectedFile !== null || transcript.trim().length > 0;

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to save notes",
        variant: "destructive"
      });
      return;
    }

    if (!hasInput) {
      toast({
        title: "No input provided",
        description: "Please upload a file or paste a transcript.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      let data;
      
      if (selectedFile) {
        setProcessingStep("transcribing");
        data = await uploadAudio(selectedFile);
      } else {
        setProcessingStep("analyzing");
        data = await processTranscript(transcript);
      }

      if (!data.success) {
        throw new Error(data.error || "Processing failed");
      }

      setProcessingStep("generating");

      const notes: GeneratedNotes = data.notes;

      // FIX: Added 'date', 'createdAt', and 'updatedAt' are handled by the service, 
      // but 'date' is required by your Interface in notesService.ts
      const savedNote = await saveNote(user.uid, {
        title: selectedFile
          ? selectedFile.name
          : `Notes ${new Date().toLocaleDateString()}`,
        sourceName: selectedFile ? selectedFile.name : "Pasted Transcript",
        sourceType: selectedFile ? "audio" : "text",
        rawTranscript: data.transcript || transcript,
        data: {
          summary: notes.summary,
          keyPoints: notes.keyPoints,
          quizQuestions: notes.quizQuestions || [],
          flashcards: notes.flashcards || []
        },
        date: new Date(), // This satisfies the "Property 'date' is missing" error
      });

      toast({
        title: "Notes generated!",
        description: "Redirecting to your study materials...",
      });

      setTimeout(() => {
        navigate(`/study/${savedNote.id}`, {
          state: {
            notes: savedNote.data,
            rawTranscript: savedNote.rawTranscript
          }
        });
      }, 1500);

    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {/* <main className="flex-1">
        <Hero />
        <section id="upload" className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {!isProcessing && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Get Started</h2>
                    <p className="text-muted-foreground text-sm italic">
                      {user 
                        ? "Your notes will be saved to your cloud library automatically."
                        : "Sign in to save notes to your library."
                      }
                    </p>
                  </div>

                 <UploadSection
                      selectedFile={selectedFile}
                      setSelectedFile={setSelectedFile}
                      transcript={transcript}
                      setTranscript={setTranscript}
                      onGenerate={handleGenerate}
                      isProcessing={isProcessing}
                 />
                </div>
              )}

              {isProcessing && <LoadingIndicator currentStep={processingStep} />}
            </div>
          </div>
        </section>
      </main> */}
      <main className="flex-1">

  {/* 🔓 MARKETING VIEW (NOT LOGGED IN) */}
  {!user && (
    <>
      <Hero />
      {/* you can add Features, About sections here later */}
    </>
  )}

  {/* 🔐 WORKSPACE VIEW (LOGGED IN) */}
  {user && (
    <section id="upload" className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {!isProcessing && (
            <UploadSection
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              transcript={transcript}
              setTranscript={setTranscript}
              onGenerate={handleGenerate}
              isProcessing={isProcessing}
            />
          )}

          {isProcessing && (
            <LoadingIndicator currentStep={processingStep} />
          )}
        </div>
      </div>
    </section>
  )}

</main>

      <Footer />
    </div>
  );
};

export default Index;
