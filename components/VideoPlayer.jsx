
"use client";

import { useState, useRef, useEffect } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const FullscreenIcon = () => (
  <span className="text-xl">⛶</span>
);


export default function VideoPlayer({
  lessonTitle = "Current Lesson",
  isWideMode,
  setIsWideMode,
}) {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef(null);


  // Track fullscreen changes (including ESC button)
  useEffect(() => {

    const handleFullscreenChange = () => {

      const fullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement;

      setIsFullscreen(Boolean(fullscreen));

    };


    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );


    return () => {

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );

    };

  }, []);



  const toggleFullscreen = async () => {

    const player = playerRef.current;

    if (!player) return;


    try {

      if (!isFullscreen) {


        if (player.requestFullscreen) {

          await player.requestFullscreen();

        } 
        else if (player.webkitRequestFullscreen) {

          player.webkitRequestFullscreen();

        }


        // Mobile landscape
        if (
          window.screen.orientation &&
          window.screen.orientation.lock
        ) {

          window.screen.orientation
            .lock("landscape")
            .catch(() => {});

        }


      } 
      else {


        if (document.exitFullscreen) {

          await document.exitFullscreen();

        }
        else if (document.webkitExitFullscreen) {

          document.webkitExitFullscreen();

        }


        if (
          window.screen.orientation &&
          window.screen.orientation.unlock
        ) {

          window.screen.orientation.unlock();

        }

      }


    } catch (error) {

      console.log(
        "Fullscreen error:",
        error
      );

    }

  };




  const PlayerContent = ({ wide }) => (

    <div
      className={`
        relative
        bg-gray-900
        overflow-hidden
        aspect-video
        shadow-lg
        group

        ${
          wide
          ? "rounded-2xl w-full max-h-[70vh]"
          : "rounded-xl md:rounded-2xl"
        }

        fullscreen:w-screen
        fullscreen:h-screen
        fullscreen:rounded-none
        fullscreen:max-h-none
      `}
    >


      {/* Video Placeholder */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-gray-800
          to-gray-950
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              text-gray-500
              text-5xl
              md:text-6xl
              mb-2
            "
          >
            ▶
          </div>


          <p
            className="
              text-gray-400
              text-xs
              md:text-sm
            "
          >
            {lessonTitle}
          </p>

        </div>

      </div>




      {/* Center Play */}

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center

          opacity-100
          lg:opacity-0
          lg:group-hover:opacity-100

          transition-opacity
          z-10
        "
      >

        <div
          className="
            w-14
            h-14
            rounded-full
            bg-white/20
            backdrop-blur-sm
            flex
            items-center
            justify-center
            hover:bg-white/30
          "
        >
          <PlayIcon />
        </div>

      </button>





      {/* Controls */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0

          px-4
          pt-8
          pb-3

          bg-gradient-to-t
          from-black/80
          to-transparent


          opacity-100
          lg:opacity-0
          lg:group-hover:opacity-100

          transition-opacity

          z-20
        "
      >


        {/* Progress */}

        <div
          className="
            h-1
            w-full
            bg-white/30
            rounded-full
            mb-3
          "
        >

          <div
            className="
              h-1
              w-1/3
              bg-indigo-400
              rounded-full
            "
          />

        </div>




        <div
          className="
            flex
            justify-between
            items-center
            text-white
            text-xs
          "
        >


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
              onClick={() =>
                setIsPlaying(!isPlaying)
              }
              className="hover:text-indigo-300"
            >
              <PlayIcon />
            </button>


            <span>
              7:14 / 22:10
            </span>


          </div>





          <div
            className="
              flex
              items-center
              gap-3
            "
          >


            {wide && (

              <button
                onClick={() =>
                  setIsWideMode(false)
                }
                className="
                  text-indigo-400
                  font-semibold
                  hover:text-indigo-300
                "
              >
                Collapse ✕
              </button>

            )}



            {!wide && (

              <button
                onClick={() =>
                  setIsWideMode(true)
                }
                className="
                  hidden
                  lg:block
                  border
                  border-white/30
                  rounded
                  px-2
                  py-1
                "
              >
                Wide Mode
              </button>

            )}



            <button
              onClick={toggleFullscreen}
              className="
                flex
                items-center
                gap-1
                hover:text-indigo-300
              "
            >

              <FullscreenIcon />

              {
                isFullscreen
                ? "Minimize"
                : "Maximize"
              }

            </button>


          </div>


        </div>


      </div>


    </div>

  );





  if (isWideMode) {

    return (

      <div
        ref={playerRef}
        className="
          block
          w-full
          bg-gray-950
          px-4
          py-4
          border-b
          border-gray-800
        "
      >

        <div className="max-w-7xl mx-auto">

          <PlayerContent wide />

        </div>

      </div>

    );

  }





  return (

    <div
      ref={playerRef}
      className="
        sticky
        top-14
        z-30

        -mx-4
        px-4
        py-2

        bg-gray-50

        md:relative
        md:top-0
        md:mx-0
        md:p-0
      "
    >

      <PlayerContent wide={false} />

    </div>

  );

}
