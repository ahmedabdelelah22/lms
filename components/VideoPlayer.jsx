"use client";

import { useState, useRef, useEffect } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoPlayer({ lessonTitle = "Current Lesson", isWideMode, setIsWideMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // حالة لمتابعة وضع الفل سكرين
  const playerRef = useRef(null);

  // مراقبة تغييرات الفل سكرين من المتصفح (مثلاً لو المستخدم ضغط Esc للخروج)
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

  // دالة الـ Toggle لزر الـ Maximize
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      // الدخول إلى وضع الـ Fullscreen
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen(); // Safari
      }
      
      // محاولة تدوير الشاشة برمجياً للموبايل
      if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape").catch(() => {});
      }
    } else {
      // الخروج من وضع الـ Fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      }
      
      // إرجاع تدوير الشاشة للوضع الطبيعي
      if (window.screen.orientation && window.screen.orientation.unlock) {
        window.screen.orientation.unlock();
      }
    }
  };

  const renderPlayerContent = (isWideLayout) => (
    <div className={`relative bg-gray-900 overflow-hidden aspect-video shadow-lg group mx-auto ${
      isWideLayout ? "rounded-2xl w-full max-h-[70vh]" : "rounded-xl md:rounded-2xl"
    }`}>
      <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-5xl md:text-6xl mb-2">▶</div>
          <p className="text-gray-400 text-xs md:text-sm">{lessonTitle} {isWideLayout && "(Wide Mode)"}</p>
        </div>
      </div>

      <button onClick={() => setIsPlaying(!isPlaying)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          <PlayIcon />
        </div>
      </button>
      
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-4 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div className="w-full bg-white/30 rounded-full h-1 mb-2 cursor-pointer">
          <div className="bg-indigo-400 h-1 rounded-full w-1/3" />
        </div>
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-indigo-300"><PlayIcon /></button>
            <span>7:14 / 22:10</span>
          </div>
          <div className="flex items-center gap-3">
            {isWideLayout ? (
              <>
                <button onClick={() => setIsWideMode(false)} className="text-indigo-400 font-semibold hover:text-indigo-300">
                  Collapse View ✕
                </button>
                <button onClick={toggleFullscreen} className="hover:text-indigo-300 text-sm">
                  {isFullscreen ? "⛶ Minimize" : "⛶ Maximize"}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsWideMode(true)} className="hidden lg:inline-block hover:text-indigo-300 text-xs px-2 py-0.5 border border-white/30 rounded">
                   Wide Mode
                </button>
                <button onClick={toggleFullscreen} className="hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
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
      <div ref={playerRef} className="hidden lg:block w-full bg-gray-950 px-4 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {renderPlayerContent(true)}
        </div>
      </div>
    );
  }

  return (
    <div ref={playerRef} className="sticky top-14 z-30 md:relative md:top-0 -mx-4 px-4 py-2 bg-gray-50 md:p-0 md:mx-0">
      {renderPlayerContent(false)}
    </div>
  );
}