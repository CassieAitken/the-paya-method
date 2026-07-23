import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';
import { foundations } from '../data/foundations';

const MARKER_LABELS = ['Battery', 'Rest', 'Shield', 'Bond', 'Mind', 'Motion', 'Harmony'];

export function BlueprintSummaryPoster({
  dogData,
  results,
  directives,
  dogPhoto,
  dogNumber,
}: {
  dogData: any;
  results: any;
  directives: any;
  dogPhoto: string | null;
  dogNumber?: number | null;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const name = dogData.name || 'Your Companion';
  const { topPillar, bottomPillar, priorityShift } = directives;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dogNum = dogNumber ? String(dogNumber).padStart(3, '0') : '001';

  const capture = async (): Promise<Blob | null> => {
    if (!posterRef.current) return null;
    const canvas = await html2canvas(posterRef.current, {
      backgroundColor: '#FDFBF7',
      scale: 2.5,
      logging: false,
      useCORS: true,
    });
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await capture();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dogData.name || 'dog'}-blueprint-summary.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const blob = await capture();
      if (!blob) return;
      const file = new File([blob], 'blueprint-summary.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${name}'s Dog Biology Blueprint™` });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div
        ref={posterRef}
        style={{
          backgroundColor: '#FDFBF7',
          width: '480px',
          margin: '0 auto',
          overflow: 'hidden',
          fontFamily: "'Inter', Helvetica, sans-serif",
        }}
      >
        {/* Header band */}
        <div style={{ backgroundColor: '#4B1D5C', padding: '32px 36px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#9AB8C4', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 6px' }}>
            The Paya Method
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '15px', fontStyle: 'italic', color: '#E4D9E8', margin: 0 }}>
            Dog Biology Blueprint™
          </p>
        </div>

        {/* Dog identity + score */}
        <div style={{ padding: '32px 36px 24px', textAlign: 'center' }}>
          {dogPhoto ? (
            <img src={dogPhoto} alt={name} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4B1D5C', margin: '0 auto 14px' }} />
          ) : (
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', border: '2px solid #4B1D5C', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F5EE' }}>
              <span style={{ fontSize: '32px' }}>🐾</span>
            </div>
          )}
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#2A2421', margin: '0 0 2px', fontWeight: 500 }}>{name}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '15px', fontStyle: 'italic', color: '#5C534E', margin: '0 0 18px' }}>{results.archetype?.name}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '64px', color: '#4B1D5C', fontWeight: 500, lineHeight: 1 }}>{results.score}</span>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', color: '#8A7F72', marginLeft: '4px' }}>/100</span>
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#8A7F72', textTransform: 'uppercase', margin: '4px 0 0' }}>Vitality Score</p>
        </div>

        {/* 7 Markers */}
        <div style={{ padding: '0 36px 24px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#0A4682', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 14px' }}>The 7 Biology Markers</p>
          {foundations.map((f, i) => {
            const score = results.phaseScores?.[i] ?? 0;
            const barColor = score >= 70 ? '#166534' : score >= 45 ? '#92400e' : '#991b1b';
            return (
              <div key={f.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12px', color: '#2A2421', fontWeight: 500 }}>{MARKER_LABELS[i]}</span>
                  <span style={{ fontSize: '12px', color: barColor, fontWeight: 600 }}>{score}</span>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: '#E8E2D9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', backgroundColor: barColor, borderRadius: '3px' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Take chips */}
        <div style={{ padding: '0 36px 24px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, backgroundColor: '#F8F5EE', borderRadius: '10px', padding: '14px 16px' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#166534', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px' }}>Strength</p>
            <p style={{ fontSize: '13px', color: '#2A2421', fontWeight: 600, margin: 0 }}>{topPillar?.title}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#F8F5EE', borderRadius: '10px', padding: '14px 16px' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#0A4682', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px' }}>Priority</p>
            <p style={{ fontSize: '13px', color: '#2A2421', fontWeight: 600, margin: 0 }}>{bottomPillar?.title}</p>
          </div>
        </div>

        {/* Priority Protocol */}
        {priorityShift && (
          <div style={{ padding: '0 36px 28px' }}>
            <div style={{ backgroundColor: '#4B1D5C', borderRadius: '12px', padding: '20px 22px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#9AB8C4', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px' }}>Your Priority Protocol</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', color: '#FDFBF7', margin: '0 0 8px', fontWeight: 500 }}>{priorityShift.protocolTitle}</p>
              <p style={{ fontSize: '12px', color: '#E4D9E8', lineHeight: 1.6, margin: 0 }}>{priorityShift.compassionateWhat}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '0 36px 28px', textAlign: 'center', borderTop: '1px solid #E8E2D9', paddingTop: '18px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#8A7F72', textTransform: 'uppercase', margin: '0 0 2px' }}>
            Dog #{dogNum} &middot; {dateStr}
          </p>
          <p style={{ fontSize: '10px', color: '#8A7F72', margin: 0 }}>payalabs.net</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#2A2421] text-white text-[10px] uppercase tracking-[0.15em] hover:bg-[#3A3330] transition-all disabled:opacity-50"
        >
          <Icons.Download size={16} strokeWidth={1.5} />
          Download Full Summary
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-8 py-3 border border-[#E8E2D9] text-[#2A2421] text-[10px] uppercase tracking-[0.15em] hover:border-[#4B1D5C] hover:text-[#4B1D5C] transition-all"
        >
          <Icons.Share size={16} strokeWidth={1.5} />
          Share Full Summary
        </button>
      </div>
    </div>
  );
}
