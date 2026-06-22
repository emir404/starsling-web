"use client";

import { Maximize, Minimize, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Custom-chrome video player for the product-demo section. The controls follow
 * the blueprint design system — hard edges (no radius), 1.5px rails in the
 * `rgba(215,234,237,…)` family, teal `brand-bright` for the played track, a
 * tick "ruler" on the scrubber, mono timecodes, and corner brackets on the
 * play target. Rendered over a dark video, so the chrome is light-on-dark in
 * both site themes. Built on a plain <video> (no autoplay) — play/pause, seek,
 * mute/volume, and fullscreen are all wired by hand, with full keyboard support.
 */

/** Shared hard-edged stroke defaults for the lucide glyphs. */
const ICON = {
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  strokeWidth: 1.75,
} as const;

const SEEK_STEP = 5; // seconds per arrow press on the scrubber / player
const HIDE_DELAY = 2600; // ms of inactivity before controls fade while playing

function formatTime(seconds: number) {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

/** 0–1 position of a pointer along an element's width, clamped. */
function fractionOf(el: HTMLElement, clientX: number) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return 0;
  return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
}

/** Sharp filled play triangle — avoids lucide's rounded joins. */
function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M8 4 20 12 8 20Z" />
    </svg>
  );
}

/** Sharp filled pause bars. */
function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <rect x="5" y="4" width="5" height="16" />
      <rect x="14" y="4" width="5" height="16" />
    </svg>
  );
}

/** A square chrome button: hard edges, teal keyboard ring. */
function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 shrink-0 place-items-center text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-bright"
    >
      {children}
    </button>
  );
}

export function VideoPlayer({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const playedPct = duration ? (time / duration) * 100 : 0;
  const bufferedPct = duration ? Math.min(100, (buffered / duration) * 100) : 0;

  // --- playback controls ------------------------------------------------

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play();
    else v.pause();
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    void v.play();
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      const v = videoRef.current;
      if (!v || !duration) return;
      const t = Math.min(duration, Math.max(0, seconds));
      v.currentTime = t;
      setTime(t);
      if (t < duration) setEnded(false);
    },
    [duration],
  );

  const changeVolume = useCallback((next: number) => {
    const v = videoRef.current;
    if (!v) return;
    const clamped = Math.min(1, Math.max(0, next));
    v.volume = clamped;
    v.muted = clamped === 0;
    setVolume(clamped);
    setMuted(clamped === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !(v.muted || v.volume === 0);
    v.muted = next;
    if (!next && v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
    setMuted(next);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => void })
      | null;
    const doc = document as Document & { webkitExitFullscreen?: () => void };
    const fsEl =
      document.fullscreenElement ??
      (document as Document & { webkitFullscreenElement?: Element })
        .webkitFullscreenElement;
    if (fsEl) {
      void (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
    } else if (el) {
      void (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(el);
    }
  }, []);

  // --- controls auto-hide -----------------------------------------------

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  /** Show chrome and keep it up — used while paused / ended. */
  const showControls = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);
  }, [clearHideTimer]);

  /** Show chrome, then fade it after inactivity if still playing. */
  const revealControls = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, HIDE_DELAY);
  }, [clearHideTimer]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  // --- fullscreen sync (incl. ESC + Safari prefix) ----------------------

  useEffect(() => {
    const sync = () =>
      setFullscreen(
        Boolean(
          document.fullscreenElement ??
            (document as Document & { webkitFullscreenElement?: Element })
              .webkitFullscreenElement,
        ),
      );
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  // --- scrubber pointer + keyboard --------------------------------------

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    e.preventDefault();
    trackRef.current.setPointerCapture(e.pointerId);
    setScrubbing(true);
    seekTo(fractionOf(trackRef.current, e.clientX) * duration);
  };

  const onTrackPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const f = fractionOf(trackRef.current, e.clientX);
    setHover(f);
    if (scrubbing) seekTo(f * duration);
  };

  const onTrackPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    trackRef.current?.releasePointerCapture(e.pointerId);
    setScrubbing(false);
  };

  const onTrackKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, () => void> = {
      ArrowLeft: () => seekTo(time - SEEK_STEP),
      ArrowRight: () => seekTo(time + SEEK_STEP),
      Home: () => seekTo(0),
      End: () => seekTo(duration),
    };
    const handler = map[e.key];
    if (handler) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    }
  };

  // --- player-level keyboard shortcuts (only when the frame itself holds
  //     focus, so they never double-fire with a focused button/slider) ----

  const onWrapKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        e.preventDefault();
        seekTo(time - SEEK_STEP);
        break;
      case "ArrowRight":
        e.preventDefault();
        seekTo(time + SEEK_STEP);
        break;
      case "ArrowUp":
        e.preventDefault();
        changeVolume((muted ? 0 : volume) + 0.1);
        break;
      case "ArrowDown":
        e.preventDefault();
        changeVolume((muted ? 0 : volume) - 0.1);
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullscreen();
        break;
    }
  };

  const volumeValue = muted ? 0 : volume;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      aria-label={label}
      role="group"
      onPointerMove={(e) => {
        if (e.pointerType !== "touch") revealControls();
      }}
      onPointerLeave={() => {
        if (playing) setControlsVisible(false);
      }}
      onKeyDown={onWrapKeyDown}
      className={cn(
        "group/player relative w-full select-none overflow-hidden bg-black outline-none focus-visible:ring-1 focus-visible:ring-brand-bright focus-visible:ring-offset-0",
        fullscreen ? "h-full" : "aspect-video",
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        aria-label={label}
        className="absolute inset-0 size-full object-contain"
        onClick={() => {
          revealControls();
          togglePlay();
        }}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          setEnded(false);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          showControls();
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          setTime(duration);
          showControls();
        }}
        onTimeUpdate={(e) => {
          if (!scrubbing) setTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
        }}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
      />

      {/* Dim the poster/paused frame so the play target reads clearly. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-black/25 transition-opacity duration-300 motion-reduce:transition-none",
          playing ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Center play / replay target (hidden during playback). */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <button
            type="button"
            aria-label={ended ? "Replay video" : "Play video"}
            onClick={ended ? replay : togglePlay}
            className="group/play pointer-events-auto relative grid size-16 place-items-center border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-bright hover:bg-black/45 focus-visible:border-brand-bright focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-bright motion-reduce:transition-none sm:size-20"
          >
            {/* blueprint corner brackets */}
            <span aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute -left-px -top-px size-2.5 border-l border-t border-brand-bright/70 transition-colors group-hover/play:border-brand-bright" />
              <span className="absolute -right-px -top-px size-2.5 border-r border-t border-brand-bright/70 transition-colors group-hover/play:border-brand-bright" />
              <span className="absolute -bottom-px -left-px size-2.5 border-b border-l border-brand-bright/70 transition-colors group-hover/play:border-brand-bright" />
              <span className="absolute -bottom-px -right-px size-2.5 border-b border-r border-brand-bright/70 transition-colors group-hover/play:border-brand-bright" />
            </span>
            {ended ? (
              <RotateCcw className="size-6 sm:size-7" {...ICON} />
            ) : (
              <PlayGlyph className="size-6 sm:size-7" />
            )}
          </button>
        </div>
      )}

      {/* Bottom control bar (available once playback has started). */}
      {started && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-12 transition-opacity duration-300 motion-reduce:transition-none sm:gap-2 sm:px-4 sm:pb-4",
            controlsVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          {/* Scrubber: tick ruler + buffered + played + square thumb. */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration) || 0}
            aria-valuenow={Math.floor(time)}
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={onTrackPointerUp}
            onPointerLeave={() => setHover(null)}
            onKeyDown={onTrackKeyDown}
            className="group/track relative flex h-6 cursor-pointer touch-none items-center focus-visible:outline-none"
          >
            {/* measurement ruler */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(215,234,237,0.45) 0 1.5px, transparent 1.5px 18px)",
              }}
            />
            {/* base / buffered / played */}
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/15">
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 bg-white/25"
                style={{ width: `${bufferedPct}%` }}
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 bg-brand-bright shadow-[0_0_10px_rgba(48,166,187,0.6)]"
                style={{ width: `${playedPct}%` }}
              />
            </div>
            {/* hover guide + timecode tooltip */}
            {hover !== null && (
              <>
                <div
                  aria-hidden
                  className="absolute top-1/2 h-3.5 w-px -translate-y-1/2 bg-white/50"
                  style={{ left: `${hover * 100}%` }}
                />
                <div
                  aria-hidden
                  className="absolute -top-7 -translate-x-1/2 border border-white/20 bg-black/85 px-1.5 py-0.5 font-mono text-[10px] leading-none text-white/90"
                  style={{
                    left: `${Math.min(96, Math.max(4, hover * 100))}%`,
                  }}
                >
                  {formatTime(hover * duration)}
                </div>
              </>
            )}
            {/* square thumb */}
            <div
              aria-hidden
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border border-white/70 bg-brand-bright shadow-[0_0_8px_rgba(48,166,187,0.7)] transition-opacity",
                scrubbing
                  ? "opacity-100"
                  : "opacity-0 group-hover/track:opacity-100 group-focus-visible/track:opacity-100",
              )}
              style={{ left: `${playedPct}%` }}
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ControlButton
              label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              {playing ? (
                <PauseGlyph className="size-5" />
              ) : (
                <PlayGlyph className="size-5" />
              )}
            </ControlButton>

            <div className="flex items-center gap-1.5">
              <ControlButton
                label={volumeValue === 0 ? "Unmute" : "Mute"}
                onClick={toggleMute}
              >
                {volumeValue === 0 ? (
                  <VolumeX className="size-5" {...ICON} />
                ) : (
                  <Volume2 className="size-5" {...ICON} />
                )}
              </ControlButton>
              <VolumeBar value={volumeValue} onChange={changeVolume} />
            </div>

            <div className="ml-1 flex items-baseline gap-1 font-mono text-[11px] tabular-nums tracking-tight text-white/60 sm:text-xs">
              <span className="text-white/90">{formatTime(time)}</span>
              <span className="text-white/30">/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <ControlButton
                label={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={toggleFullscreen}
              >
                {fullscreen ? (
                  <Minimize className="size-5" {...ICON} />
                ) : (
                  <Maximize className="size-5" {...ICON} />
                )}
              </ControlButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact blueprint volume slider — hidden on the smallest screens. */
function VolumeBar({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  const set = (clientX: number) => {
    if (ref.current) onChange(fractionOf(ref.current, clientX));
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={(e) => {
        if (!ref.current) return;
        e.preventDefault();
        ref.current.setPointerCapture(e.pointerId);
        setDrag(true);
        set(e.clientX);
      }}
      onPointerMove={(e) => drag && set(e.clientX)}
      onPointerUp={(e) => {
        ref.current?.releasePointerCapture(e.pointerId);
        setDrag(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          onChange(value - 0.1);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          onChange(value + 0.1);
        }
      }}
      className="group/vol relative hidden h-6 w-16 cursor-pointer touch-none items-center focus-visible:outline-none sm:flex"
    >
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/15">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 bg-white/80"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <div
        aria-hidden
        className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 border border-white/70 bg-white opacity-0 transition-opacity group-hover/vol:opacity-100 group-focus-visible/vol:opacity-100"
        style={{ left: `${value * 100}%` }}
      />
    </div>
  );
}
