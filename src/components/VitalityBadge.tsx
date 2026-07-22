import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';

const PILLAR_LABELS = ['BATTERY', 'REST', 'SHIELD', 'BOND', 'MIND', 'MOTION', 'HARMONY'];

const COLORS = {
  bg: '#F9F5ED',
  primary: '#4A3C2F',
  secondary: '#867766',
  border: '#CDC2B0',
  gold: '#B09469',
  fallbackBg: '#F2EBDC',
};

export function VitalityBadge({
  dogName,
  score,
  dogPhoto,
  phaseScores,
  archetypeName,
  dogNumber,
}: {
  dogName: string;
  score: number;
  dogPhoto: string | null;
  phaseScores?: number[];
  archetypeName?: string;
  dogNumber?: number;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const displayPhoto = uploadedPhoto || dogPhoto;

  const now = new Date();
  const monthYear = `${now.toLocaleString('default', { month: 'long' }).toUpperCase()} ${now.getFullYear()}`;

  const defaultPillarScores = [85, 35, 55, 88, 50, 30, 82];
  const pillars = phaseScores && phaseScores.length >= 7 ? phaseScores : defaultPillarScores;

  const dogNum = dogNumber ? String(dogNumber).padStart(3, '0') : '001';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: COLORS.bg,
        scale: 3,
        logging: false,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${dogName}-vitality-badge.png`;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!badgeRef.current) return;
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: COLORS.bg,
        scale: 3,
        logging: false,
        useCORS: true,
      });
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
      if (!blob) return;
      const file = new File([blob], 'badge.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${dogName}'s Vitality Badge`,
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        alert('Badge copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="space-y-8 pt-12 sm:pt-16 border-t border-stone-200/40">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg sm:text-xl font-serif text-[#2A2421] text-center mb-8">
          Share Your Vitality Badge
        </h3>

        {/* Badge - 3:4 portrait ratio */}
        <div
          ref={badgeRef}
          style={{
            backgroundColor: COLORS.bg,
            width: '360px',
            height: '480px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Thin rounded border */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: '8px',
            pointerEvents: 'none',
          }} />

          {/* Photo area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 'calc(100% - 16px)',
              height: '190px',
              marginTop: '6px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              backgroundColor: displayPhoto ? undefined : COLORS.fallbackBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={dogName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 30%',
                }}
              />
            ) : (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: `1.5px solid ${COLORS.gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="4" r="2" />
                    <circle cx="4.5" cy="8.5" r="2" />
                    <circle cx="17.5" cy="8.5" r="2" />
                    <circle cx="7" cy="13" r="1.5" />
                    <circle cx="17" cy="13" r="1.5" />
                    <path d="M12 17c-3.5 0-5.5 2-5.5 3.5 0 1 1.5 1.5 3 1.5 1 0 1.8-.5 2.5-1.2.7.7 1.5 1.2 2.5 1.2 1.5 0 3-.5 3-1.5 0-1.5-2-3.5-5.5-3.5z" />
                  </svg>
                </div>
                <p style={{
                  marginTop: '8px',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  color: COLORS.secondary,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  textTransform: 'uppercase',
                }}>
                  EVERY DOG IS A GOOD DOG
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />

          {/* DOG BIOLOGY BLUEPRINT label */}
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: COLORS.secondary,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            textTransform: 'uppercase',
            marginTop: '14px',
            marginBottom: '2px',
          }}>
            DOG BIOLOGY BLUEPRINT™
          </p>

          {/* Dog name */}
          <p style={{
            fontSize: '36px',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            color: COLORS.primary,
            margin: '0',
            lineHeight: 1.15,
          }}>
            {dogName}
          </p>

          {/* Archetype */}
          {archetypeName && (
            <p style={{
              fontSize: '16px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 300,
              color: COLORS.secondary,
              margin: '1px 0 0',
            }}>
              {archetypeName}
            </p>
          )}

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
            <span style={{
              fontSize: '64px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              color: COLORS.primary,
              lineHeight: 1,
            }}>
              {score}
            </span>
            <span style={{
              fontSize: '22px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: COLORS.secondary,
              marginLeft: '2px',
            }}>
              /100
            </span>
          </div>

          {/* VITALITY INDEX label */}
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: COLORS.secondary,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            textTransform: 'uppercase',
            margin: '0 0 8px',
          }}>
            VITALITY INDEX
          </p>

          {/* Pillar bars - uniform height outlined pills with fill based on score */}
          <div style={{
            display: 'flex',
            gap: '6px',
            width: 'calc(100% - 44px)',
            marginBottom: '4px',
          }}>
            {PILLAR_LABELS.map((label, i) => {
              const pct = pillars[i] ?? 50;
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: '32px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.border}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${pct}%`,
                      backgroundColor: COLORS.gold,
                      opacity: 0.5,
                      borderRadius: '3px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pillar labels */}
          <div style={{
            display: 'flex',
            gap: '6px',
            width: 'calc(100% - 44px)',
            marginBottom: '10px',
          }}>
            {PILLAR_LABELS.map((label) => (
              <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{
                  fontSize: '7px',
                  letterSpacing: '0.02em',
                  color: COLORS.secondary,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* DOG # and date */}
          <p style={{
            position: 'absolute',
            bottom: '30px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: COLORS.primary,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            textTransform: 'uppercase',
            margin: 0,
          }}>
            DOG #{dogNum} &middot; {monthYear}
          </p>

          {/* payalabs.net */}
          <p style={{
            position: 'absolute',
            bottom: '15px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '8px',
            letterSpacing: '0.15em',
            color: COLORS.secondary,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            margin: 0,
          }}>
            payalabs.net
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#4A3C2F] text-[#F9F5ED] text-[9px] font-mono uppercase tracking-[0.25em] hover:bg-[#3A2E22] transition-all disabled:opacity-50"
          >
            <Icons.Download size={16} strokeWidth={1.5} />
            Download Badge
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-8 py-3 border border-[#CDC2B0] text-[#4A3C2F] text-[9px] font-mono uppercase tracking-[0.25em] hover:border-[#B09469] hover:text-[#B09469] transition-all"
          >
            <Icons.Share size={16} strokeWidth={1.5} />
            Share Badge
          </button>
        </div>
      </div>
    </div>
  );
}
