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
  const [showMobileControls, setShowMobileControls] = useState(false);
  
  const containerRef = useRef(null); // الـ ref الخاص بالـ div للكمبيوتر والـ Wide Mode
  const videoRef = useRef(null);     // الـ ref الخاص بالفيديو الحقيقي لحل مشكلة الموبايل والآيفون
  const controlsTimeoutRef = useRef(null);
 
  // فحص حالة الفل سكرين من المتصفح
  const checkFullscreenStatus = () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      videoRef.current?.webkitDisplayingFullscreen // إضافة فحص خاص بآيفون
    );
  };
 
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(checkFullscreenStatus());
    };
 
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    
    // مستمع خاص لهواتف iOS
    const videoElem = videoRef.current;
    if (videoElem) {
      videoElem.addEventListener("webkitbeginfullscreen", () => setIsFullscreen(true));
      videoElem.addEventListener("webkitendfullscreen", () => setIsFullscreen(false));
    }
 
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      if (videoElem) {
        videoElem.removeEventListener("webkitbeginfullscreen", () => setIsFullscreen(true));
        videoElem.removeEventListener("webkitendfullscreen", () => setIsFullscreen(false));
      }
    };
  }, []);
 
  // التعامل مع النقر على الهاتف لإظهار عناصر التحكم
  const handlePlayerTap = (e) => {
    if (e.target.closest("button") || e.target.closest(".cursor-pointer")) {
      return;
    }
 
    setShowMobileControls((prev) => !prev);
 
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
 
    controlsTimeoutRef.current = setTimeout(() => {
      setShowMobileControls(false);
    }, 3500);
  };
 
  // دالة تشغيل وإيقاف الفل سكرين التفاعلية للموبايل والكمبيوتر
  const toggleFullscreen = async (e) => {
    e?.stopPropagation();
 
    // تحديد العنصر المستهدف: إذا كان هاتفاً نختار الـ <video> مباشرة، وإذا كان كمبيوتراً نختار الـ <div> الحاضن
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const targetElement = isMobileDevice ? videoRef.current : containerRef.current;
 
    if (!targetElement) {
      console.error("Target element for fullscreen not found");
      return;
    }
 
    try {
      if (!isFullscreen) {
        // ── Entering Fullscreen ──
        
        // حل خاص وحصري لهواتف الآيفون (iOS Safari)
        if (isMobileDevice && videoRef.current?.webkitEnterFullscreen) {
          videoRef.current.webkitEnterFullscreen();
          setIsFullscreen(true);
          return;
        }
 
        // المتصفحات القياسية الأخرى (Android Chrome, Desktop)
        if (targetElement.requestFullscreen) {
          await targetElement.requestFullscreen();
        } else if (targetElement.webkitRequestFullscreen) {
          await targetElement.webkitRequestFullscreen();
        } else if (targetElement.mozRequestFullScreen) {
          await targetElement.mozRequestFullScreen();
        } else if (targetElement.msRequestFullscreen) {
          await targetElement.msRequestFullscreen();
        }
 
        // محاولة إجبار الشاشة على الدوران العرضي (Landscape) في الموبايل
        try {
          if (window.screen?.orientation?.lock) {
            await window.screen.orientation.lock("landscape");
          }
        } catch (err) {
          console.log("Orientation lock setup ignored:", err);
        }
      } else {
        // ── Exiting Fullscreen ──
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
 
        try {
          if (window.screen?.orientation?.unlock) {
            await window.screen.orientation.unlock();
          }
        } catch (err) {
          console.log("Orientation unlock setup ignored:", err);
        }
      }
    } catch (error) {
      console.error("Fullscreen Error:", error);
    }
  };
 
  const renderPlayerContent = (isWideLayout) => (
    <div
      ref={containerRef}
      onClick={handlePlayerTap}
      className={`relative bg-gray-900 overflow-hidden aspect-video shadow-lg group mx-auto w-full select-none ${
        isWideLayout ? "rounded-2xl max-h-[70vh]" : "rounded-xl md:rounded-2xl"
      }`}
    >
      {/* 🛑 العنصر السحري المضاف: فيديو حقيقي مخفي خلف الواجهة لتمكين الـ Fullscreen للموبايل */}
      <video
        ref={videoRef}
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        src="https://www.w3schools.com/html/mov_bbb.mp4" // يمكنك استبداله برابط الفيديو الخاص بك
      />
 
      {/* Video Placeholder State Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-gray-500 text-5xl md:text-6xl mb-2">▶</div>
          <p className="text-gray-400 text-xs md:text-sm">
            {lessonTitle} {isWideLayout && "(Wide Mode)"}
          </p>
        </div>
      </div>
 
      {/* Middle Big Play Button overlay */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
          if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play().catch(() => {});
          }
        }}
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
                if (videoRef.current) {
                  isPlaying ? videoRef.current.pause() : videoRef.current.play().catch(() => {});
                }
              }}
              className="hover:text-indigo-300 p-1"
            >
              <PlayIcon />
            </button>
            <span className="font-mono tracking-wider tabular-nums">7:14 / 22:10</span>
          </div>
 
          <div className="flex items-center gap-3">
            {isWideLayout ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWideMode(false);
                  }}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 p-1"
                >
                  Collapse View ✕
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-indigo-300 text-sm flex items-center gap-1 p-1"
                >
                  ⛶ <span>{isFullscreen ? "Minimize" : "Maximize"}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWideMode(true);
                  }}
                  className="hidden lg:inline-block hover:text-indigo-300 text-xs px-2 py-0.5 border border-white/30 rounded"
                >
                  Wide Mode
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 p-1 bg-white/10 rounded px-2 md:bg-transparent md:p-0"
                >
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
        <div className="max-w-7xl mx-auto">{renderPlayerContent(true)}</div>
      </div>
    );
  }
 
  return (
    <div className="sticky top-14 z-30 md:relative md:top-0 -mx-4 px-4 py-2 bg-gray-50 md:p-0 md:mx-0">
      {renderPlayerContent(false)}
    </div>
  );
}