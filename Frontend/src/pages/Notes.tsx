import NotesDisplay from "@/components/NotesDisplay";
import { GeneratedNotes } from "@/components/NotesDisplay";
import { useLocation } from "react-router-dom";

const Notes = () => {
  const { state } = useLocation();
  const notes = state?.notes as GeneratedNotes;

  if (!notes) return <p>No notes found</p>;

  return <NotesDisplay notes={notes} />;
};

export default Notes;
