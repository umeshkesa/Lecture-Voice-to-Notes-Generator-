
import React from "react";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback.tsx";
import { FeatureCard } from "./feature-card.tsx";
import { BookOpen, Lightbulb, Brain, Menu } from "lucide-react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal.tsx";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  
  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const { user } = useAuth();
  
  const handleCTA = () => {
    if (user) {
      document.getElementById("upload")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setAuthMode("login");
      setShowAuthModal(true);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Smart Study Notes",
      description: "AI-generated structured summaries that highlight the most important concepts from your lectures, organized in an easy-to-review format.",
      iconBg: "bg-indigo-600",
    },
    {
      icon: Lightbulb,
      title: "Key Point Extraction",
      description: "Automatically extract and emphasize critical concepts, definitions, and takeaways so you can focus on what truly matters.",
      iconBg: "bg-blue-600",
    },
    {
      icon: Brain,
      title: "Practice Quizzes",
      description: "AI-generated questions that test your understanding and help reinforce the material you've learned.",
      gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
      iconBg: "bg-purple-600",
      image: "https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYnJhaW4lMjBhaXxlbnwxfHx8fDE3NjgxMzc1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const steps = [
    {
      icon: Upload,
      label: "Upload",
      description: "Drop your lecture file",
      gradient: "from-blue-500 to-cyan-500",
      emoji: "📤",
    },
    {
      icon: Sparkles,
      label: "AI Magic",
      description: "Smart analysis begins",
      gradient: "from-purple-500 to-pink-500",
      emoji: "🤖",
    },
    {
      icon: FileText,
      label: "Smart Notes & Flash cards",
      description: "Structured summaries",
      gradient: "from-orange-500 to-red-500",
      emoji: "📝",
    },
    {
      icon: CheckCircle2,
      label: "Quiz Ready",
      description: "Test your knowledge",
      gradient: "from-green-500 to-emerald-500",
      emoji: "🎯",
    },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-full px-3 py-1.5 mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs text-slate-700">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl mb-5 text-slate-900 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transform Lectures
              <br />
              <span className="text-indigo-600">into Smart Notes</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upload your lecture recordings or paste transcripts. Our AI generates
              structured notes, extracts key insights, and creates practice quizzes
              to accelerate your learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuthClick("login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 group text-sm"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Minimal stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-slate-200"
            >
              {[
                { number: "50K+", label: "Active students" },
                { number: "1M+", label: "Notes generated" },
                { number: "4.9/5", label: "Average rating" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl font-semibold text-slate-900">{stat.number}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image card */}
              <div className="relative bg-white rounded-2xl p-2.5 shadow-xl border border-slate-200">
                <div className="rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1644337540803-2b2fb3cebf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwZGVza3xlbnwxfHx8fDE3NjgwNzI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Minimal workspace"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              </div>

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-white rounded-xl p-3 shadow-lg border border-slate-200 max-w-[180px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500">AI Processing</div>
                    <div className="text-xs font-medium text-slate-900">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="bg-indigo-600 h-1 rounded-full w-full" />
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 bg-white rounded-xl p-3 shadow-lg border border-slate-200"
              >
                <div className="text-[10px] text-slate-500 mb-0.5">Study Streak</div>
                <div className="text-xl font-semibold text-slate-900">15 Days</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Features Section */}
          <section id="features" className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-slate-900">
                  Everything You Need to Study Smarter
                </h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                  Powered by advanced AI that understands your content and adapts to your learning style
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    iconBg={feature.iconBg}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ABOUT SECTION */}
<section
  id="about"
  className="py-24 bg-background border-t border-border"
>
  <div className="container max-w-4xl text-center space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold">
      About <span className="text-primary">LectureNotes</span>
    </h2>

    <p className="text-lg text-muted-foreground leading-relaxed">
      LectureNotes is an AI-powered learning assistant designed to help students
      convert long lectures into clear, structured study materials.
    </p>

    <p className="text-muted-foreground leading-relaxed">
      Instead of rewatching hours of recordings or struggling with messy notes,
      students can upload lecture audio or transcripts and instantly receive
      smart summaries, key points, flashcards, and practice quizzes.
    </p>

    <p className="text-muted-foreground leading-relaxed">
      Our goal is simple — help students study smarter, save time, and focus on
      understanding concepts rather than rewriting notes.
    </p>

    <div className="pt-6 text-sm text-muted-foreground">
      🔒 Your data stays private. Notes are generated securely and never shared.
    </div>
  </div>
</section>


      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          How It
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Works</span>
        </h2>
        <p className="text-lg text-muted-foreground">Three simple steps to transform your learning experience</p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative  px-20">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring"
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Animated background blob */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${step.gradient} rounded-full opacity-20 blur-2xl`}
                />

                <div className="relative z-10">
                  {/* Step number badge */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-sm"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mb-4 shadow-2xl`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Emoji */}
                  <div className="text-3xl mb-3">{step.emoji}</div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-1.5 text-gray-900">
                    {step.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Arrow connector (desktop only) */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.15 }}
                className="hidden md:block absolute top-1/2 -right-3 z-20"
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-7 h-7 text-purple-500" />
                </motion.div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </section>
  );
};

export default Hero;  



// import React from "react";
// import { Zap } from "lucide-react";
// import { motion } from "motion/react";
// import { useState, useRef, useEffect } from "react";
// import { Sparkles, ArrowRight } from "lucide-react";
// import { ImageWithFallback } from "../figma/ImageWithFallback.tsx";
// import { FeatureCard } from "./feature-card.tsx";
// import { BookOpen, Lightbulb, Brain, Menu } from "lucide-react";
// import { Upload, FileText, CheckCircle2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { AuthModal } from "@/components/auth/AuthModal.tsx";
// import { useAuth } from "@/contexts/AuthContext";



// const Hero = () => {

//   const navigate = useNavigate();
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState<"login" | "signup">("login");
//   const handleAuthClick = (mode: "login" | "signup") => {
//     setAuthMode(mode);
//     setShowAuthModal(true);
//   };

//   const { user } = useAuth();
//   const handleCTA = () => {
//     if (user) {
//       // Logged in → go to upload section
//       document.getElementById("upload")?.scrollIntoView({
//         behavior: "smooth",
//       });
//     } else {
//       // Not logged in → open login modal
//       setAuthMode("login");
//       setShowAuthModal(true);
//     }
//   };

//   const features = [
//     {
//       icon: BookOpen,
//       title: "Smart Study Notes",
//       description: "AI-generated structured summaries that highlight the most important concepts from your lectures, organized in an easy-to-review format.",
//       iconBg: "bg-indigo-600",
//     },
//     {
//       icon: Lightbulb,
//       title: "Key Point Extraction",
//       description: "Automatically extract and emphasize critical concepts, definitions, and takeaways so you can focus on what truly matters.",
//       iconBg: "bg-blue-600",
//     },
//     {
//       icon: Brain,
//       title: "Practice Quizzes",
//       description: "AI-generated questions that test your understanding and help reinforce the material you've learned.",
//       gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
//       iconBg: "bg-purple-600",
//       image: "https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYnJhaW4lMjBhaXxlbnwxfHx8fDE3NjgxMzc1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
//     },
//   ];

//   const steps = [
//     {
//       icon: Upload,
//       label: "Upload",
//       description: "Drop your lecture file",
//       gradient: "from-blue-500 to-cyan-500",
//       emoji: "📤",
//     },
//     {
//       icon: Sparkles,
//       label: "AI Magic",
//       description: "Smart analysis begins",
//       gradient: "from-purple-500 to-pink-500",
//       emoji: "🤖",
//     },
//     {
//       icon: FileText,
//       label: "Smart Notes & Flash cards",
//       description: "Structured summaries",
//       gradient: "from-orange-500 to-red-500",
//       emoji: "📝",
//     },
//     {
//       icon: CheckCircle2,
//       label: "Quiz Ready",
//       description: "Test your knowledge",
//       gradient: "from-green-500 to-emerald-500",
//       emoji: "🎯",
//     },
//   ];


//   return (
//     <section className="relative py-16 md:py-24 overflow-hidden">
//       {/* Background decoration */}
//       <div className="relative max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left content */}
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-full px-4 py-2 mb-8 shadow-sm"
//             >
//               <Sparkles className="w-4 h-4 text-indigo-600" />
//               <span className="text-sm text-slate-700">Powered by Advanced AI</span>
//             </motion.div>

//             <motion.h1
//               className="text-5xl md:text-6xl lg:text-7xl mb-6 text-slate-900 leading-tight tracking-tight"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//             >
//               Transform Lectures
//               <br />
//               <span className="text-indigo-600">into Smart Notes</span>
//             </motion.h1>

//             <motion.p
//               className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               Upload your lecture recordings or paste transcripts. Our AI generates
//               structured notes, extracts key insights, and creates practice quizzes
//               to accelerate your learning.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="flex flex-wrap gap-4"
//             >
//               <motion.button
//                 whileHover={{ y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => handleAuthClick("login")}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 group"
//               >
//                 <span>Get Started Free</span>
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//               </motion.button>


//             </motion.div>

//             {/* Minimal stats */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-slate-200"
//             >
//               {[
//                 { number: "50K+", label: "Active students" },
//                 { number: "1M+", label: "Notes generated" },
//                 { number: "4.9/5", label: "Average rating" },
//               ].map((stat, i) => (
//                 <div key={i}>
//                   <div className="text-2xl font-semibold text-slate-900">{stat.number}</div>
//                   <div className="text-sm text-slate-500">{stat.label}</div>
//                 </div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Right image */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//             className="relative hidden lg:block"
//           >
//             <div className="relative">
//               {/* Main image card */}
//               <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-slate-200">
//                 <div className="rounded-xl overflow-hidden">
//                   <ImageWithFallback
//                     src="https://images.unsplash.com/photo-1644337540803-2b2fb3cebf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwZGVza3xlbnwxfHx8fDE3NjgwNzI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
//                     alt="Minimal workspace"
//                     className="w-full h-[500px] object-cover"
//                   />
//                 </div>
//               </div>

//               {/* Floating card 1 */}
//               <motion.div
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -top-8 -left-8 bg-white rounded-xl p-4 shadow-lg border border-slate-200 max-w-[200px]"
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-xs text-slate-500">AI Processing</div>
//                     <div className="text-sm font-medium text-slate-900">Complete</div>
//                   </div>
//                 </div>
//                 <div className="w-full bg-slate-100 rounded-full h-1.5">
//                   <div className="bg-indigo-600 h-1.5 rounded-full w-full" />
//                 </div>
//               </motion.div>

//               {/* Floating card 2 */}
//               <motion.div
//                 animate={{ y: [0, 10, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-slate-200"
//               >
//                 <div className="text-xs text-slate-500 mb-1">Study Streak</div>
//                 <div className="text-2xl font-semibold text-slate-900">15 Days</div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
//       </div>

//       <div className="container relative">
//         <div className="max-w-3xl mx-auto text-center">


//           {/* Features Section */}
//           <section id="features" className="py-24 px-6 ">
//             <div className="max-w-6xl mx-auto">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 className="text-center mb-16"
//               >
//                 <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900">
//                   Everything You Need to Study Smarter
//                 </h2>
//                 <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                   Powered by advanced AI that understands your content and adapts to your learning style
//                 </p>
//               </motion.div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
//                 {features.map((feature, index) => (
//                   <FeatureCard
//                     key={index}
//                     icon={feature.icon}
//                     title={feature.title}
//                     description={feature.description}
//                     iconBg={feature.iconBg}
//                     delay={index * 0.1}
//                   />
//                 ))}
//               </div>
//             </div>
//           </section>

//         </div>
//       </div>


//       <div className="text-center mb-16">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
//           How It
//           <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Works</span>
//         </h2>
//         <p className="text-xl text-muted-foreground">Three simple steps to transform your learning experience</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
//         {steps.map((step, index) => (
//           <div key={index} className="relative">
//             <motion.div
//               initial={{ opacity: 0, y: 50, scale: 0.8 }}
//               whileInView={{ opacity: 1, y: 0, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{
//                 duration: 0.6,
//                 delay: index * 0.15,
//                 type: "spring"
//               }}
//               whileHover={{
//                 scale: 1.05,
//                 rotateY: 10,
//                 transition: { duration: 0.3 }
//               }}
//               className="relative group"
//             >
//               {/* Card */}
//               <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 overflow-hidden ">
//                 {/* Gradient overlay on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

//                 {/* Animated background blob */}
//                 <motion.div
//                   animate={{
//                     scale: [1, 1.2, 1],
//                     rotate: [0, 90, 0],
//                   }}
//                   transition={{
//                     duration: 8,
//                     repeat: Infinity,
//                     ease: "easeInOut"
//                   }}
//                   className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-full opacity-20 blur-2xl`}
//                 />

//                 <div className="relative z-10">
//                   {/* Step number badge */}
//                   <motion.div
//                     whileHover={{ rotate: [0, -10, 10, -10, 0] }}
//                     className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg text-white font-bold"
//                   >
//                     {index + 1}
//                   </motion.div>

//                   {/* Icon */}
//                   <motion.div
//                     whileHover={{ scale: 1.2, rotate: 360 }}
//                     transition={{ duration: 0.5 }}
//                     className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
//                   >
//                     <step.icon className="w-10 h-10 text-white" />
//                   </motion.div>

//                   {/* Emoji */}
//                   <div className="text-4xl mb-4">{step.emoji}</div>

//                   {/* Title */}
//                   <h3 className="text-xl font-bold mb-2 text-gray-900">
//                     {step.label}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-gray-600">
//                     {step.description}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Arrow connector (desktop only) */}
//             {index < steps.length - 1 && (
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.5 + index * 0.15 }}
//                 className="hidden md:block absolute top-1/2 -right-4 z-20"
//               >
//                 <motion.div
//                   animate={{ x: [0, 5, 0] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                 >
//                   <ArrowRight className="w-8 h-8 text-purple-500" />
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>
//         ))}
//       </div>


//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         mode={authMode}
//       />

//     </section>
//   );
// };


// export default Hero;