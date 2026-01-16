
import type React from "react";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileAudio, FileVideo, File, Sparkles, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface UploadSectionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  onGenerate: () => void;
  isProcessing: boolean;
}

const ACCEPTED_TYPES = {
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "video/mp4": ".mp4",
  "audio/m4a": ".m4a",
};

export function UploadSection({
  selectedFile,
  setSelectedFile,
  transcript,
  setTranscript,
  onGenerate,
  isProcessing,
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setSelectedFile(file);
      setActiveTab("upload"); // Switch to upload tab
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const isAudio = selectedFile?.type.startsWith("audio");
  const isVideo = selectedFile?.type.startsWith("video");
  const hasInput = selectedFile !== null || transcript.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-border bg-muted p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("upload")}
            disabled={isProcessing}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
              activeTab === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            disabled={isProcessing}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
              activeTab === "paste"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <File className="w-4 h-4" />
            Paste Text
          </button>
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div>
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50",
                isProcessing && "pointer-events-none opacity-50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".mp3,.wav,.mp4,.m4a,audio/mpeg,audio/wav,video/mp4,audio/m4a"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />

              <div className="flex flex-col items-center gap-4">
                <div
                  className={cn(
                    "p-5 rounded-2xl transition-all duration-300",
                    isDragging ? "bg-primary/10 scale-110" : "bg-secondary"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-10 h-10 transition-colors duration-300",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {isDragging ? "Drop your file here" : "Drag & drop your lecture file"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse from your computer
                  </p>
                </div>

                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {[".mp3", ".wav", ".mp4", ".m4a"].map((ext) => (
                    <span
                      key={ext}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary border border-border text-muted-foreground"
                    >
                      {ext}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Maximum file size: 100MB
                </p>
              </div>
            </div>
          ) : (
            <Card className="p-5 border-2 border-primary/20 bg-card shadow-card animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  {isAudio ? (
                    <FileAudio className="w-7 h-7 text-primary" />
                  ) : (
                    <FileVideo className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {isAudio ? "Audio" : "Video"} File
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <button
                    onClick={removeFile}
                    disabled={isProcessing}
                    className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Paste Tab */}
      {activeTab === "paste" && (
        <Card className="p-6 border-2 shadow-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Paste your transcript
              </label>
              <span className="text-xs text-muted-foreground">
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
            </div>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your lecture transcript here... 

Example:
Today we'll discuss the fundamentals of machine learning. Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience..."
              className="min-h-[280px] text-sm leading-relaxed resize-none"
              disabled={isProcessing}
            />
            {transcript.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ready to generate notes</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Auth Warning */}
      {!user && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Sign in to save your notes</p>
              <p className="text-xs opacity-90">
                Create an account to access your notes from any device and never lose your study materials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!hasInput || isProcessing || !user}
        size="lg"
        className="w-full gap-2 text-base h-12 shadow-lg hover:shadow-xl transition-all"
      >
        <Sparkles className="w-5 h-5" />
        {!user
          ? "Sign In to Generate Notes"
          : isProcessing
          ? "Processing..."
          : "Generate Study Notes"}
      </Button>

      {/* Helper Text */}
      {hasInput && user && (
        <p className="text-center text-xs text-muted-foreground">
          Your notes will be automatically saved to your library
        </p>
      )}
    </div>
  );
}








// import { useState, useRef, useCallback } from "react";
// import { Upload, FileAudio, FileVideo, X, CheckCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface FileUploadProps {
//   onFileSelect: (file: File | null) => void;
//   selectedFile: File | null;
//   isProcessing: boolean;
// }

// const ACCEPTED_TYPES = {
//   "audio/mpeg": ".mp3",
//   "audio/wav": ".wav",
//   "audio/x-wav": ".wav",
//   "video/mp4": ".mp4",
// };

// const FileUpload = ({ onFileSelect, selectedFile, isProcessing }: FileUploadProps) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragging(false);
      
//       const file = e.dataTransfer.files[0];
//       if (file && Object.keys(ACCEPTED_TYPES).includes(file.type)) {
//         onFileSelect(file);
//       }
//     },
//     [onFileSelect]
//   );

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onFileSelect(file);
//     }
//   };

//   const handleRemoveFile = () => {
//     onFileSelect(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   };

//   const isAudio = selectedFile?.type.startsWith("audio");
//   const isVideo = selectedFile?.type.startsWith("video");

//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024 * 1024) {
//       return `${(bytes / 1024).toFixed(1)} KB`;
//     }
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };

//   return (
//     <div className="w-full">
//       {!selectedFile ? (
//         <div
//           onClick={() => inputRef.current?.click()}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={cn(
//             "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
//             isDragging
//               ? "border-primary bg-primary/5 scale-[1.02]"
//               : "border-border hover:border-primary/50 hover:bg-secondary/50",
//             isProcessing && "pointer-events-none opacity-50"
//           )}
//         >
//           <div className="flex flex-col items-center gap-4">
//             <div className={cn(
//               "p-4 rounded-full transition-colors duration-300",
//               isDragging ? "bg-primary/10" : "bg-secondary"
//             )}>
//               <Upload className={cn(
//                 "w-8 h-8 transition-colors duration-300",
//                 isDragging ? "text-primary" : "text-muted-foreground"
//               )} />
//             </div>
//             <div className="text-center">
//               <p className="font-semibold text-foreground">
//                 {isDragging ? "Drop your file here" : "Drag & drop your lecture file"}
//               </p>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 or click to browse
//               </p>
//             </div>
//             <div className="flex gap-2 mt-2">
//               <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
//                 .mp3
//               </span>
//               <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
//                 .wav
//               </span>
//               <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
//                 .mp4
//               </span>
//             </div>
//           </div>
//           <input
//             ref={inputRef}
//             type="file"
//             accept=".mp3,.wav,.mp4,audio/mpeg,audio/wav,video/mp4"
//             onChange={handleFileChange}
//             className="hidden"
//             disabled={isProcessing}
//           />
//         </div>
//       ) : (
//         <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-card animate-fade-in">
//           <div className="p-3 rounded-lg bg-primary/10">
//             {isAudio ? (
//               <FileAudio className="w-6 h-6 text-primary" />
//             ) : (
//               <FileVideo className="w-6 h-6 text-primary" />
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
//             <p className="text-sm text-muted-foreground">
//               {formatFileSize(selectedFile.size)} • {isAudio ? "Audio" : "Video"}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <CheckCircle className="w-5 h-5 text-success" />
//             <button
//               onClick={handleRemoveFile}
//               disabled={isProcessing}
//               className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
//             >
//               <X className="w-5 h-5 text-muted-foreground" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;