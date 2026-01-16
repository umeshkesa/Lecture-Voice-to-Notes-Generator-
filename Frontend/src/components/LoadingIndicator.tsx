import { Loader2, BookOpen, Lightbulb, HelpCircle } from "lucide-react";

interface LoadingIndicatorProps {
  currentStep?: "transcribing" | "analyzing" | "generating";
}

const steps = [
  { key: "transcribing", label: "Transcribing audio", icon: BookOpen },
  { key: "analyzing", label: "Analyzing content", icon: Lightbulb },
  { key: "generating", label: "Generating notes", icon: HelpCircle },
];

const LoadingIndicator = ({ currentStep = "analyzing" }: LoadingIndicatorProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center shadow-glow">
          <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Processing your lecture
      </h3>
      <p className="text-muted-foreground mb-8">
        This may take a few moments...
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : isComplete
                  ? "bg-success/10 border border-success/20"
                  : "bg-secondary/50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isComplete
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive
                    ? "text-primary"
                    : isComplete
                    ? "text-success"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <Loader2 className="w-4 h-4 ml-auto text-primary animate-spin" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingIndicator;