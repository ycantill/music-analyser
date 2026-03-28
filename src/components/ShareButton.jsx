import { useState } from 'react';
import html2canvas from 'html2canvas';

export default function ShareButton() {
  if (!navigator.share) return null;

  const [loading, setLoading] = useState(false);

  async function handleShare() {
    setLoading(true);
    try {
      const region = document.getElementById('fretboard-region');

      // Temporarily expand overflow so html2canvas captures the full fretboard
      const prevOverflow = region.style.overflow;
      region.style.overflow = 'visible';

      const canvas = await html2canvas(region, {
        backgroundColor: '#ededed',
        scale: 2,
        width: region.scrollWidth + 40,
        height: region.scrollHeight + 50,
        x: -30,
        y: -10,
        scrollX: 0,
        scrollY: 0,
      });

      region.style.overflow = prevOverflow;

      const canShare = navigator.canShare?.({ files: [new File([], 'test.png', { type: 'image/png' })] });

      if (canShare) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'intervalos.png', { type: 'image/png' });
        await navigator.share({
          title: 'Analizador Musical',
          text: 'Mis intervalos en la guitarra',
          files: [file],
        });
      } else {
        await navigator.share({
          title: 'Analizador Musical',
          text: 'Mástil de guitarra interactivo para análisis de teoría musical',
          url: window.location.href,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="share-button" onClick={handleShare} disabled={loading} aria-label="Compartir esta app">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {loading ? 'Capturando…' : 'Compartir mi diapasón'}
    </button>
  );
}
