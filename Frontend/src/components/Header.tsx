
import { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  BookMarked,
  User,
  LogOut,
  PlusSquare,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useLocation } from "react-router-dom";




const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Profile dropdown
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mobile menu
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setOpenProfile(false);
    setMobileMenu(false);
    navigate("/");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">

          {/* LEFT: Logo + Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenu((p) => !p)}
            >
              {mobileMenu ? <X /> : <Menu />}
            </Button>

            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-hero">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Lecture<span className="text-primary">Notes</span>
              </span>
            </Link>
          </div>


          {/* DESKTOP NAV */}
          {/* 🔐 Only when logged in */}

          <nav className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <Link to="/" className="nav-link">Home</Link>
                <a href="/#features" className="nav-link">Features</a>
                <a href="/#about" className="nav-link">About</a>
              </>
            )}

            {user && (
              <>
                <button
                  onClick={() => {
                    if (location.pathname !== "/") {
                      navigate("/");
                      setTimeout(() => {
                        document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    } else {
                      document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="nav-link flex items-center gap-1"
                >
                  <PlusSquare className="w-4 h-4" /> New
                </button>

                <Link to="/library">
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookMarked className="w-4 h-4" />
                    Library
                  </Button>
                </Link>
              </>
            )}
          </nav>


          {/* PROFILE / AUTH */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setOpenProfile((p) => !p)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-9 h-9 rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Button>

              {openProfile && (
                <div
                  className="
      absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card shadow-md
      animate-in slide-in-from-top-2 fade-in duration-150
    "
                >
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                    Signed in
                  </div>

                  <button
                    onClick={() => {
                      navigate("/account");
                      setOpenProfile(false);
                    }}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition"
                  >
                    <User className="w-4 h-4 opacity-70" />
                    Account
                  </button>

                  <button
                    onClick={() => {
                      navigate("/library");
                      setOpenProfile(false);
                    }}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition"
                  >
                    <BookMarked className="w-4 h-4 opacity-70" />
                    Library
                  </button>

                  <div className="h-px bg-border my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 text-destructive hover:bg-destructive/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}



            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleAuthClick("login")}>Login</Button>
              <Button onClick={() => handleAuthClick("signup")} className="hidden sm:inline-flex">
                Sign Up
              </Button>
            </div>
          )}
        </div>


        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden border-t bg-background px-6 py-4 space-y-3 animate-in slide-in-from-top">
            <Link to="/" onClick={() => setMobileMenu(false)} className="mobile-link">
              Home
            </Link>

            <a href="/#features" className="mobile-link">
              Features
            </a>

            <Link to="/about" onClick={() => setMobileMenu(false)} className="mobile-link">
              About
            </Link>

            {/* 🔐 Only when logged in */}
            {user && (
              <>
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    if (location.pathname !== "/") {
                      navigate("/");
                      setTimeout(() => {
                        document.getElementById("upload")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }, 100);
                    } else {
                      document.getElementById("upload")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="mobile-link text-left"
                >
                  New
                </button>

                <Link
                  to="/library"
                  onClick={() => setMobileMenu(false)}
                  className="mobile-link"
                >
                  Library
                </Link>
              </>
            )}
          </div>
        )}


      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

export default Header;



