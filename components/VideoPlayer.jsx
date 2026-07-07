"use client";

import { useState, useRef, useEffect } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoPlayer({ lessonTitle = "Current Lesson", isWideMode, setIsWideMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false); // Controls visibility toggle for mobile
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Monitor screen fullscreen status changes (e.g. if user hits hardware back button or swipe-dismisses)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handles control overlays visibility on smartphone screen taps
  const handlePlayerTap = (e) => {
    // Avoid hiding controls if a user clicks an interactive button or control seeker bar
    if (e.target.closest('button') || e.target.closest('.cursor-pointer')) return;

    setShowMobileControls((prev) => !prev);

    // Auto-hide controls panel on mobile after 3.5 seconds of inactivity
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowMobileControls(false);
    }, 3500);
  };

  // Safe clear on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Native Mobile Cross-Platform Toggle Fullscreen Wrapper
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      // Prioritize standard Web API, fallback gracefully to Mobile Webkit (Safari iOS)
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.webkitEnterFullscreen) {
        // Direct native iOS video player expansion engine fallback
        playerRef.current.webkitEnterFullscreen();
      }
      
      // Auto-rotate viewport layout orientation to horizontal on smartphones
      if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape").catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      
      if (window.screen.orientation && window.screen.orientation.unlock) {
        window.screen.orientation.unlock();
      }
    }
  };

  const renderPlayerContent = (isWideLayout) => (
    <div 
      ref={playerRef} 
      onClick={handlePlayerTap}
      className={`relative bg-gray-900 overflow-hidden aspect-video shadow-lg group mx-auto w-full select-none ${
        isWideLayout ? "rounded-2xl max-h-[70vh]" : "rounded-xl md:rounded-2xl"
      }`}
    >
      {/* Video Placeholder State Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-gray-500 text-5xl md:text-6xl mb-2">▶</div>
          <p className="text-gray-400 text-xs md:text-sm">{lessonTitle} {isWideLayout && "(Wide Mode)"}</p>
        </div>
      </div>

      {/* Middle Big Play Button overlay */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)} 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 z-10 ${
          showMobileControls ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
        }`}
      >
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all transform scale-100 active:scale-95">
          <PlayIcon />
        </div>
      </button>
      
      {/* Player Controls Bar Interface */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-10 pb-3 transition-opacity duration-200 z-20 ${
          showMobileControls ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
        }`}
      >
        {/* Progress Timeline Scrubber Bar */}
        <div className="w-full bg-white/30 rounded-full h-1 mb-3 cursor-pointer py-1 flex items-center">
          <div className="bg-indigo-400 h-1 rounded-full w-1/3 pointer-events-none" />
        </div>
        
        <div className="flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-indigo-300 p-1">
              <PlayIcon />
            </button>
            <span className="font-mono tracking-wider tabular-nums">7:14 / 22:10</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isWideLayout ? (
              <>
                <button onClick={() => setIsWideMode(false)} className="text-indigo-400 font-semibold hover:text-indigo-300 p-1">
                  Collapse View ✕
                </button>
                <button onClick={toggleFullscreen} className="hover:text-indigo-300 text-sm flex items-center gap-1 p-1">
                  ⛶ <span>{isFullscreen ? "Minimize" : "Maximize"}</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsWideMode(true)} className="hidden lg:inline-block hover:text-indigo-300 text-xs px-2 py-0.5 border border-white/30 rounded">
                   Wide Mode
                </button>
                <button onClick={toggleFullscreen} className="hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 p-1 bg-white/10 rounded px-2 md:bg-transparent md:p-0">
                  ⛶ <span>{isFullscreen ? "Minimize" : "Maximize"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isWideMode) {
    return (
      <div className="hidden lg:block w-full bg-gray-950 px-4 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {renderPlayerContent(true)}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-14 z-30 md:relative md:top-0 -mx-4 px-4 py-2 bg-gray-50 md:p-0 md:mx-0">
      {renderPlayerContent(false)}
    </div>
  );
}