import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const KATSEYE_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ57opDSYuzTsOez2w6ZE8z85EV2NlXXQf3GQ&s";
const SONG_TITLE = "Internet Girl - KATSEYE";
const YOUTUBE_VIDEO_ID = "5q9EjSUovc4";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  height: string;
  width: string;
  videoId: string;
  playerVars: {
    autoplay: number;
    loop: number;
    playlist: string;
    controls: number;
    disablekb: number;
    fs: number;
    modestbranding: number;
    rel: number;
  };
  events: {
    onReady: (event: YTPlayerEvent) => void;
    onStateChange: (event: YTPlayerEvent) => void;
  };
}

interface YTConstructor {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    PLAYING: number;
  };
}

declare global {
  interface Window {
    YT: YTConstructor;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MusicPlayer = () => {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(true);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  // Keep refs in sync with state
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          setIsReady(true);
          event.target.setVolume(volumeRef.current);
          event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }, []);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer]);

  // Listen for first interaction to unmute (only register once)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (playerRef.current && isMutedRef.current) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volumeRef.current);
        setIsMuted(false);
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  const handleDiscClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent document click handler from firing
    if (!playerRef.current) return;

    // If muted, just unmute (video is already playing)
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
      return;
    }

    // If unmuted, toggle play/pause
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
      if (newVolume === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div ref={containerRef} className="hidden">
        <div id="youtube-player" />
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-background/60 backdrop-blur-md rounded-full px-4 py-2 border border-primary/20 shadow-lg">
        {/* Rotating Disc - Click to Play/Pause */}
        <button
          onClick={handleDiscClick}
          disabled={!isReady}
          className="relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isMuted ? "Unmute" : isPlaying ? "Pause" : "Play"}
        >
          <img
            src={KATSEYE_LOGO}
            alt="Album Art"
            className={`w-10 h-10 rounded-full object-cover transition-transform hover:scale-105 ${isPlaying && !isMuted ? "music-thumbnail" : "music-thumbnail paused"}`}
          />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none" />
        </button>

        {/* Song Title */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground/80 whitespace-nowrap">
            {SONG_TITLE}
          </span>
          <span className="text-[10px] text-foreground/50">
            {!isReady ? "Loading..." : isMuted ? "Click to unmute" : "Now Playing"}
          </span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            disabled={!isReady}
            className="text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-16"
            disabled={!isReady}
          />
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
