
import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Lightbulb, HelpCircle, Copy, Download, Check,
  RotateCcw, Edit3, Save, Search, BrainCircuit, Eye,
  ArrowLeft, ArrowRight, MessageSquareQuote, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Shuffle } from "lucide-react";



export interface GeneratedNotes {
  summary: string;
  keyPoints: string[];
  flashcards: {
    front: string;
    back: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

interface NotesDisplayProps {
  notes: GeneratedNotes;
  rawTranscript?: string;
}

const NotesDisplay = ({ notes, rawTranscript }: NotesDisplayProps) => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Tab Management
  const [activeTab, setActiveTab] = useState<"summary" | "flashcards" | "quiz" | "transcript">("summary");




  // States
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableSummary, setEditableSummary] = useState(notes.summary || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<any[]>(notes.quizQuestions || []);
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    setEditableSummary(notes.summary || "");
    setCustomQuestions(notes.quizQuestions || []);
  }, [notes]);

  // Handle scrolling to highlight when switching to transcript tab
  useEffect(() => {
    if (activeTab === "transcript" && searchQuery) {
      const timer = setTimeout(() => {
        const highlight = document.querySelector(".search-highlight");
        if (highlight) {
          highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab, searchQuery]);

  const handleSaveEdit = () => {
    try {
      const library = JSON.parse(localStorage.getItem("study-library") || "[]");
      const updatedLibrary = library.map((n: any) =>
        n.id === id ? { ...n, data: { ...n.data, summary: editableSummary } } : n
      );
      localStorage.setItem("study-library", JSON.stringify(updatedLibrary));
      setIsEditing(false);
      toast({ title: "Updated", description: "Changes saved to library." });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleResetQuiz = async (regenerate = false) => {
    if (regenerate) {
      // Generate completely new questions
      setIsGeneratingQuiz(true);
      try {
        const idToken = await user?.getIdToken();

        const response = await fetch('http://localhost:5000/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            transcript: rawTranscript,
            difficulty,
            count: questionCount
          })
        });

        const data = await response.json();

        if (data.success && data.quiz?.quizQuestions) {
          setCustomQuestions(data.quiz.quizQuestions);
          setQuizKey(prev => prev + 1);  // Force re-render
          toast({
            title: "New quiz generated!",
            description: `${data.quiz.quizQuestions.length} fresh questions`
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate new quiz",
          variant: "destructive"
        });
      } finally {
        setIsGeneratingQuiz(false);
      }
    } else {
      // Just reset answers (keep same questions)
      setQuizKey(prev => prev + 1);  // This clears all answers in InteractiveQuizItem
      toast({
        title: "Quiz reset",
        description: "All answers cleared - try again!"
      });
    }
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;

    const checkPage = (extraHeight: number) => {
      if (yPos + extraHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(63, 81, 181);
    doc.text("Lecture Study Guide", 105, yPos, { align: "center" });
    yPos += 20;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(editableSummary, 170);
    doc.text(splitSummary, 20, yPos);
    yPos += (splitSummary.length * 6) + 15;

    checkPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Key Takeaways", 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    notes.keyPoints?.forEach((point, i) => {
      checkPage(10);
      doc.text(`${i + 1}. ${point}`, 25, yPos);
      yPos += 7;
    });
    yPos += 10;

    if (notes.flashcards && notes.flashcards.length > 0) {
      checkPage(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Concepts & Definitions", 20, yPos);
      yPos += 10;
      notes.flashcards.forEach((card) => {
        checkPage(15);
        doc.setFont("helvetica", "bold");
        doc.text(`${card.front}: `, 25, yPos);
        const textX = 25 + doc.getTextWidth(`${card.front}: `);
        doc.setFont("helvetica", "normal");
        doc.text(card.back, textX, yPos);
        yPos += 8;
      });
    }

    doc.save(`Study_Guide_${id}.pdf`);
    toast({ title: "Success", description: "PDF downloaded successfully!" });
  };

  const handleVerify = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('http://localhost:5000/api/verify-fact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ transcript: rawTranscript, query: searchQuery })
      });
      const data = await response.json();
      setSearchResult(data.success ? data.answer : "Could not verify this fact.");
    } catch (error) {
      setSearchResult("Connection error. Is the backend running?");
    } finally {
      setIsSearching(false);
    }
  };



  const handleGenerateLevelQuiz = async () => {
    if (!rawTranscript) {
      toast({
        title: "Transcript missing",
        description: "Quiz generation requires the lecture transcript.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingQuiz(true);

    try {
      const idToken = await user?.getIdToken();

      const response = await fetch('http://localhost:5000/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          transcript: rawTranscript,
          difficulty,
          count: questionCount
        })
      });

      const data = await response.json();

      console.log("Quiz API Response:", data); // ← DEBUG LOG

      if (data.success && data.quiz) {
        // ✅ FIXED PARSING LOGIC
        let newQuestions = null;

        // Try different response structures
        if (data.quiz.quizQuestions) {
          // Format: { quiz: { quizQuestions: [...] } }
          newQuestions = data.quiz.quizQuestions;
        } else if (Array.isArray(data.quiz)) {
          // Format: { quiz: [...] }
          newQuestions = data.quiz;
        } else if (data.quizQuestions) {
          // Format: { quizQuestions: [...] }
          newQuestions = data.quizQuestions;
        }

        console.log("Parsed Questions:", newQuestions); // ← DEBUG LOG

        if (newQuestions && Array.isArray(newQuestions) && newQuestions.length > 0) {
          setCustomQuestions(newQuestions);
          setShowQuiz(true);
          setQuizKey(prev => prev + 1);
          toast({ title: `${difficulty.toUpperCase()} Quiz Ready (${newQuestions.length} questions)` });
        } else {
          console.error("No questions found in response");
          toast({
            title: "Error",
            description: "Failed to parse quiz questions",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to generate quiz",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleRetakeQuiz = () => {
    // Option A: Just clear answers but keep same questions
    setQuizKey(prev => prev + 1);

    // Option B: Go back to the selection screen to change difficulty/count
    setShowQuiz(false);
    setCustomQuestions([]); // Clear old questions
  };

  const renderHighlightedTranscript = (text: string, query: string) => {
    if (!query.trim()) return text;
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${safeQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="search-highlight bg-yellow-300 text-black px-1 rounded font-bold">{part}</mark>
      ) : (part)
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Tab Navigation */}
      <div className="flex bg-muted p-1 rounded-xl w-fit mx-auto border border-border sticky top-4 z-10 shadow-sm overflow-x-auto max-w-full">
        {[
          { id: 'summary', label: 'Summary', icon: BookOpen },
          { id: 'flashcards', label: 'Flashcards', icon: Layers },
          { id: 'quiz', label: 'Practice Quiz', icon: BrainCircuit },
          { id: 'transcript', label: 'Transcript', icon: MessageSquareQuote }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="gap-2 flex-shrink-0"
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </div>

      <div className="transition-all duration-300">
        {/* --- SUMMARY TAB --- */}
        {activeTab === "summary" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Summary</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="gap-2">
                    <Download className="w-4 h-4" /> PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={isEditing ? handleSaveEdit : () => setIsEditing(true)}>
                    {isEditing ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Edit3 className="w-4 h-4 mr-2" /> Edit</>}
                  </Button>
                </div>
              </div>

              {/* ✨ UPDATED: Now uses MarkdownRenderer */}
              {isEditing ? (
                <textarea
                  value={editableSummary}
                  onChange={(e) => setEditableSummary(e.target.value)}
                  className="w-full min-h-[300px] p-4 rounded-lg bg-background border border-primary/30 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                  placeholder="Edit your summary (supports markdown)..."
                />
              ) : (
                <MarkdownRenderer content={editableSummary} />
              )}
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Search className="w-5 h-5" />
                <h3 className="font-semibold">Verify with Transcript</h3>
              </div>
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a specific detail..."
                  className="flex-1 p-2 rounded-lg border text-sm"
                />
                <Button size="sm" onClick={handleVerify} disabled={isSearching}>
                  {isSearching ? "Thinking..." : "Ask AI"}
                </Button>
              </div>
              {searchResult && (
                <div className="mt-3 p-3 bg-background rounded border text-sm italic flex flex-col gap-2">
                  <div className="flex gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-primary" />
                    {searchResult}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="w-fit p-0 h-auto text-primary text-xs"
                    onClick={() => setActiveTab("transcript")}
                  >
                    View source in Transcript →
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Key Points</h3>
              </div>
              <ul className="space-y-3">
                {notes.keyPoints?.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --- FLASHCARDS TAB --- */}
        {activeTab === "flashcards" && (
          <div className="max-w-md mx-auto space-y-8 animate-in zoom-in-95">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Term on front • Definition on back</p>
            </div>
            <div
              className="relative h-64 w-full cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 bg-card border-2 border-primary/20 rounded-2xl flex items-center justify-center p-8 backface-hidden shadow-sm">
                  <p className="text-xl font-bold text-center text-primary">
                    {notes.flashcards?.[currentCard]?.front || "No Term Found"}
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center p-8 backface-hidden rotate-y-180 shadow-xl overflow-y-auto">
                  <p className="text-lg text-center font-medium leading-relaxed">
                    {notes.flashcards?.[currentCard]?.back || "No Definition Found"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl">
              <Button
                variant="ghost"
                disabled={currentCard === 0}
                onClick={() => { setCurrentCard(c => c - 1); setIsFlipped(false); }}
              >
                <ArrowLeft />
              </Button>
              <span className="text-xs font-bold uppercase">
                Card {currentCard + 1} / {notes.flashcards?.length || 0}
              </span>
              <Button
                variant="ghost"
                disabled={currentCard >= (notes.flashcards?.length || 1) - 1}
                onClick={() => { setCurrentCard(c => c + 1); setIsFlipped(false); }}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* --- TRANSCRIPT TAB --- */}
        {activeTab === "transcript" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquareQuote className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Raw Transcript</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(rawTranscript || "");
                    toast({ title: "Copied!" });
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border max-h-[500px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {rawTranscript ? (
                  renderHighlightedTranscript(rawTranscript, searchQuery)
                ) : (
                  <p className="text-center italic py-10">No transcript available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- QUIZ TAB --- */}
        {activeTab === "quiz" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {!showQuiz ? (
              <div className="text-center py-12 bg-secondary/20 rounded-2xl border-2 border-dashed border-primary/20 px-4">
                <BrainCircuit className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Knowledge Check</h3>
                <div className="flex flex-col gap-4 items-center mb-6">
                  <p className="text-sm font-medium">How many questions?</p>
                  <div className="flex gap-2">
                    {[3, 5, 10].map((num) => (
                      <Button
                        key={num}
                        variant={questionCount === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuestionCount(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleGenerateLevelQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full max-w-xs gap-2"
                >
                  {isGeneratingQuiz ? (
                    <><RotateCcw className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Eye className="w-4 h-4" /> Start {difficulty} Quiz</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex gap-2 items-center text-primary capitalize">
                    <HelpCircle className="w-4 h-4" /> {difficulty} Quiz
                  </h3>


                  {/* Reset Current Quiz */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetQuiz(false)}
                    disabled={isGeneratingQuiz}
                    className="text-xs gap-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear Answers
                  </Button>

                  {/* Generate New Quiz */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetQuiz(true)}
                    disabled={isGeneratingQuiz}
                    className="text-xs gap-2"
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <RotateCcw className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-3 h-3" />
                        New Questions
                      </>
                    )}
                  </Button>


                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuiz(false)}
                    className="text-xs"
                  >
                    Change Level
                  </Button>
                </div>
                {Array.isArray(customQuestions) && customQuestions.length > 0 ? (
                  customQuestions.map((q, i) => (
                    <InteractiveQuizItem key={`${quizKey}-${i}`} q={q} index={i} />
                  ))
                ) : (
                  <p className="text-center py-10">Loading questions...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InteractiveQuizItem = ({ q, index }: { q: any; index: number }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const isCorrect = (option: string) => {
    if (!q.answer) return false;
    return option.trim().charAt(0).toUpperCase() === q.answer.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
          Q{index + 1}
        </span>
        <div className="flex-1">
          <p className="font-medium text-sm mb-4">{q.question}</p>
          <div className="grid gap-2">
            {q.options?.map((option: string, i: number) => {
              const isSelected = selectedOption === option;
              const correct = isCorrect(option);
              return (
                <button
                  key={i}
                  disabled={selectedOption !== null}
                  onClick={() => setSelectedOption(option)}
                  className={`text-left p-3 rounded-md border text-sm transition-all ${isSelected
                      ? (correct
                        ? "bg-green-100 border-green-500 text-green-900 shadow-sm"
                        : "bg-red-100 border-red-500 text-red-900 shadow-sm")
                      : "bg-card hover:border-primary/50 disabled:opacity-70"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs text-primary hover:underline font-medium"
            >
              {showAnswer ? "Hide" : "Check"} Answer
            </button>
            {selectedOption && (
              <span className={`text-xs font-bold ${isCorrect(selectedOption) ? "text-green-600" : "text-red-600"
                }`}>
                {isCorrect(selectedOption) ? "✓ Correct" : "✗ Incorrect"}
              </span>
            )}
          </div>
          {showAnswer && (
            <div className="mt-3 p-3 rounded bg-background border text-sm animate-in slide-in-from-top-1 shadow-inner">
              <b>Correct:</b> {q.answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesDisplay;
