import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import heroOrbitLoop from '@assets/hero-orbit-1007-3-compressed.mp4';
import masterImg from '@assets/hero-orbit-master.jpg';
import { markHeroMediaReady } from '@/lib/hero-media-ready';

/**
 * TEMP: motion-блок = одно зацикленное видео (1007(3).mp4).
 * Сигналит splash через markHeroMediaReady, когда медиа можно показывать.
 */
export function HeroOrbitScene() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const ready = () => {
      markHeroMediaReady();
      void video.play().catch(() => undefined);
    };

    const onError = () => markHeroMediaReady();

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
  }, [reduceMotion]);

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
        <video
          ref={videoRef}
          className="hero-orbit__video hero-orbit__video--active"
          src={heroOrbitLoop}
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
      </div>
    </div>
  );
}
