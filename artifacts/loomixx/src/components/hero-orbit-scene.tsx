import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import heroOrbitLoop from '@assets/hero-orbit-1007-3-compressed.mp4';
import masterImg from '@assets/hero-orbit-master.jpg';
import { markHeroMediaReady } from '@/lib/hero-media-ready';
import { ensureHeroVideoCached } from '@/lib/hero-video-cache';

/**
 * Hero motion = зацикленное видео.
 * src из Cache Storage (blob URL); кадр скрыт до canplaythrough.
 */
export function HeroOrbitScene() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    void ensureHeroVideoCached(heroOrbitLoop).then((url) => {
      if (!cancelled) setVideoSrc(url);
    });

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !videoSrc) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const ready = () => {
      setFrameReady(true);
      markHeroMediaReady();
      void video.play().catch(() => undefined);
    };

    const onError = () => {
      setFrameReady(true);
      markHeroMediaReady();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      ready();
    } else {
      video.addEventListener('canplaythrough', ready, { once: true });
      video.addEventListener('error', onError, { once: true });
    }

    return () => {
      video.removeEventListener('canplaythrough', ready);
      video.removeEventListener('error', onError);
    };
  }, [reduceMotion, videoSrc]);

  if (reduceMotion) {
    return (
      <div className="hero-orbit hero-orbit--static" aria-label="Иллюстрация продуктовой студии">
        <img
          className="hero-orbit__master"
          src={masterImg}
          alt=""
          draggable={false}
          onLoad={() => markHeroMediaReady()}
          onError={() => markHeroMediaReady()}
        />
      </div>
    );
  }

  return (
    <div className="hero-orbit hero-orbit--video" aria-label="Анимированная иллюстрация продуктовой студии">
      <div className="hero-orbit__video-feather">
        {videoSrc ? (
          <video
            ref={videoRef}
            className={`hero-orbit__video${frameReady ? ' hero-orbit__video--active is-ready' : ''}`}
            src={videoSrc}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
