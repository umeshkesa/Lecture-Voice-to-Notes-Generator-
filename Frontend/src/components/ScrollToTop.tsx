// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the URL path changes, move the window to (0,0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything visually
};

export default ScrollToTop;