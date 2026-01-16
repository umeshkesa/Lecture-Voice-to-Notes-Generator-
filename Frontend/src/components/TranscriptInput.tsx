import { FileText } from "lucide-react";

interface TranscriptInputProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  isProcessing: boolean;
}

const TranscriptInput = ({ transcript, onTranscriptChange, isProcessing }: TranscriptInputProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-medium text-foreground">
          Or paste your transcript
        </label>
      </div>
      <textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        placeholder="Paste your lecture transcript here..."
        disabled={isProcessing}
        className="w-full min-h-[160px] p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {transcript.length > 0 ? `${transcript.length.toLocaleString()} characters` : "No text entered"}
      </p>
    </div>
  );
};

export default TranscriptInput;