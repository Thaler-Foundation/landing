'use client';

import { useEffect } from 'react';

export function MediaChrome() {
  useEffect(() => {
    import('media-chrome');

    const videos = [...document.querySelectorAll<HTMLVideoElement>('.blog-video video')];

    const onPlay = (e: Event) => {
      for (const video of videos) if (video !== e.target) video.pause();
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) (entry.target as HTMLVideoElement).pause();
      }
    });

    for (const video of videos) {
      video.addEventListener('play', onPlay);
      observer.observe(video);
    }

    return () => {
      observer.disconnect();
      for (const video of videos) video.removeEventListener('play', onPlay);
    };
  }, []);

  return null;
}
