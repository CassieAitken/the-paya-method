import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from '../components/Icons';

export function BadgePreview() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const dogName = 'Luna';
  const archetypeName = 'The Quiet Guardian';
  const score = 62;
  const uniqueId = 'PL-0847';
  const pillarScores = [85, 35, 55, 88, 50, 30, 82];
  const pillarLabels = ['Nutrition', 'Sleep', 'Movement', 'Stress', 'Dental', 'Gut', 'Longevity'];

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: null,
        scale: 3,
        logging: false,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${dogName}-vitality-badge.png`;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const bg = '#1C1433';
  const accent = '#C4B5D4';
  const accentMuted = 'rgba(196, 181, 212, 0.4)';
  const accentFaint = 'rgba(196, 181, 212, 0.12)';
  const cream = '#F0EBF5';
  const creamMuted = 'rgba(240, 235, 245, 0.6)';

  const serif = "'Cormorant Garamond', Georgia, serif";
  const mono = "'Courier Prime', 'Courier New', monospace";
  const sans = "'Inter', -apple-system, sans-serif";

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Thriving';
    if (s >= 65) return 'On the Right Path';
    if (s >= 45) return 'Room to Grow';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8 gap-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif text-neutral-200">Badge Preview</h1>
        <p className="text-sm text-neutral-500 font-light">Cormorant Garamond + Courier Prime + Inter</p>
      </div>

      {/* THE BADGE */}
      <div
        ref={badgeRef}
        style={{
          width: '520px',
          height: '620px',
          backgroundColor: bg,
          borderRadius: '28px',
          position: 'relative',
          overflow: 'hidden',
          padding: '40px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Inner border */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          bottom: '14px',
          borderRadius: '22px',
          border: `1px solid ${accentFaint}`,
          pointerEvents: 'none',
        }} />

        {/* Corner accents */}
        <div style={{ position: 'absolute', top: '22px', left: '22px', width: '22px', height: '22px', borderTop: `1.5px solid ${accentMuted}`, borderLeft: `1.5px solid ${accentMuted}` }} />
        <div style={{ position: 'absolute', top: '22px', right: '22px', width: '22px', height: '22px', borderTop: `1.5px solid ${accentMuted}`, borderRight: `1.5px solid ${accentMuted}` }} />
        <div style={{ position: 'absolute', bottom: '22px', left: '22px', width: '22px', height: '22px', borderBottom: `1.5px solid ${accentMuted}`, borderLeft: `1.5px solid ${accentMuted}` }} />
        <div style={{ position: 'absolute', bottom: '22px', right: '22px', width: '22px', height: '22px', borderBottom: `1.5px solid ${accentMuted}`, borderRight: `1.5px solid ${accentMuted}` }} />

        {/* Top header */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.28em',
            color: accentMuted,
            fontFamily: mono,
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            CERTIFIED VITALITY ASSESSMENT
          </p>
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: 'rgba(196, 181, 212, 0.25)',
            fontFamily: mono,
            marginTop: '3px',
          }}>
            {uniqueId}
          </p>
        </div>

        {/* Name row: icon + text */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '28px',
          marginBottom: '32px',
          paddingLeft: '12px',
        }}>
          {/* Dog icon circle */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(196, 181, 212, 0.06)',
            border: `1.5px solid rgba(196, 181, 212, 0.18)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="4" />
              <path d="M8 6c-1-2-3-2.5-4-1.5s0 3 1 4" />
              <path d="M16 6c1-2 3-2.5 4-1.5s0 3-1 4" />
              <path d="M12 14c-4 0-6 3-6 5 0 1 1 2 3 2 1.5 0 2-.5 3-1.5 1 1 1.5 1.5 3 1.5 2 0 3-1 3-2 0-2-2-5-6-5z" />
            </svg>
          </div>

          {/* Name + archetype */}
          <div>
            <h2 style={{
              fontSize: '46px',
              fontWeight: 300,
              color: cream,
              fontFamily: serif,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: 0,
            }}>
              {dogName}
            </h2>
            <p style={{
              fontSize: '16px',
              color: accent,
              fontStyle: 'italic',
              fontFamily: serif,
              fontWeight: 300,
              letterSpacing: '0.01em',
              marginTop: '6px',
            }}>
              {archetypeName}
            </p>
          </div>
        </div>

        {/* Score + Bars row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '32px',
          flex: 1,
          paddingLeft: '12px',
        }}>
          {/* Score circle */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: `2px solid rgba(196, 181, 212, 0.2)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: '-7px',
                borderRadius: '50%',
                border: '1px solid rgba(196, 181, 212, 0.06)',
              }} />
              <span style={{
                fontSize: '52px',
                fontWeight: 300,
                color: cream,
                lineHeight: 1,
                fontFamily: serif,
              }}>
                {score}
              </span>
              <span style={{
                fontSize: '12px',
                color: accentMuted,
                letterSpacing: '0.06em',
                fontFamily: mono,
              }}>
                /100
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: accent,
              fontStyle: 'italic',
              fontFamily: serif,
              fontWeight: 300,
              letterSpacing: '0.01em',
              textAlign: 'center',
            }}>
              {getScoreLabel(score)}
            </p>
          </div>

          {/* Pillar bar chart */}
          <div style={{
            flex: 1,
            display: 'flex',
            gap: '9px',
            alignItems: 'flex-end',
            height: '160px',
            paddingBottom: '50px',
            position: 'relative',
          }}>
            {pillarLabels.map((label, i) => {
              const pct = pillarScores[i];
              const barHeight = Math.max(14, (pct / 100) * 130);
              const barColor = pct >= 70 ? cream : pct >= 45 ? creamMuted : 'rgba(240, 235, 245, 0.22)';
              return (
                <div key={label} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '130px',
                  position: 'relative',
                }}>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    borderRadius: '3px 3px 1px 1px',
                    backgroundColor: barColor,
                  }} />
                  {/* Rotated label */}
                  <span style={{
                    position: 'absolute',
                    bottom: '-46px',
                    fontSize: '8px',
                    fontFamily: mono,
                    letterSpacing: '0.04em',
                    color: accentMuted,
                    textTransform: 'uppercase',
                    transform: 'rotate(-50deg)',
                    transformOrigin: 'top center',
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider + footer */}
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <div style={{
            width: '100%',
            height: '0.5px',
            backgroundColor: accentFaint,
            marginBottom: '18px',
          }} />

          {/* Download icon + branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: `1px solid rgba(196, 181, 212, 0.25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
            <span style={{
              fontSize: '12px',
              fontFamily: sans,
              letterSpacing: '0.22em',
              color: accent,
              fontWeight: 500,
              textTransform: 'uppercase',
            }}>
              PAYALABS.NET
            </span>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-3 px-10 py-4 bg-neutral-800 text-neutral-100 text-xs font-mono uppercase tracking-[0.2em] rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
      >
        <Icons.Download size={16} />
        {downloading ? 'Exporting...' : 'Download PNG'}
      </button>
    </div>
  );
}
