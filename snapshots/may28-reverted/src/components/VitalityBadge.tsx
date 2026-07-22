import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';

const PILLAR_LABELS = ['Battery', 'Rest', 'Shield', 'Bond', 'Mind', 'Motion', 'Harmony'];

export function VitalityBadge({
  dogName,
  score,
  dogPhoto,
  phaseScores,
  archetypeName,
}: {
  dogName: string;
  score: number;
  dogPhoto: string | null;
  phaseScores?: number[];
  archetypeName?: string;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const displayPhoto = uploadedPhoto || dogPhoto;

  const now = new Date();
  const dateLabel = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

  const defaultPillarScores = [85, 35, 55, 88, 50, 30, 82];
  const pillars = phaseScores && phaseScores.length >= 7 ? phaseScores : defaultPillarScores;

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
        backgroundColor: '#1A0B2E',
        scale: 2,
        logging: false,
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
        backgroundColor: '#1A0B2E',
        scale: 2,
        logging: false,
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
        <h3 className="text-lg sm:text-xl font-serif text-[#1A0B2E] text-center mb-8">
          Share Your Vitality Badge
        </h3>

        {/* Badge */}
        <div
          ref={badgeRef}
          style={{
            backgroundColor: '#1A0B2E',
            borderRadius: '24px',
            border: '1px solid rgba(20,184,166,0.15)',
            padding: '32px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '280px',
            margin: '0 auto',
            gap: '0',
          }}
        >
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'rgba(20,184,166,0.7)',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            VITALITY ASSESSMENT
          </p>

          {/* Photo circle with upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(20,184,166,0.08)',
              border: '2px dashed rgba(20,184,166,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              marginBottom: '14px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={dogName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: 'rgba(20,184,166,0.6)' }}>
                <Icons.Camera size={20} strokeWidth={1.5} />
                <span style={{ fontSize: '7px', color: 'rgba(20,184,166,0.5)', letterSpacing: '0.05em' }}>ADD PHOTO</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />

          <p style={{
            fontSize: '22px',
            fontWeight: 500,
            color: '#ffffff',
            marginBottom: '4px',
            textAlign: 'center',
          }}>
            {dogName}
          </p>

          {archetypeName && (
            <p style={{
              fontSize: '12px',
              color: 'rgba(20,184,166,0.7)',
              letterSpacing: '0.04em',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {archetypeName}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
            <span style={{ fontSize: '56px', fontWeight: 500, color: '#ffffff', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '20px', color: '#14B8A6' }}>/100</span>
          </div>

          <p style={{
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(20,184,166,0.6)',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            VITALITY INDEX
          </p>

          <div style={{
            width: '100%',
            height: '0.5px',
            backgroundColor: 'rgba(20,184,166,0.2)',
            marginBottom: '16px',
          }} />

          {/* Pillar bars with dramatic variation */}
          <div style={{
            display: 'flex',
            gap: '6px',
            width: '100%',
            marginBottom: '16px',
            alignItems: 'flex-end',
            height: '80px',
          }}>
            {PILLAR_LABELS.map((label, i) => {
              const pct = pillars[i] ?? 50;
              const barHeight = pct >= 70 ? 60 : pct >= 40 ? 35 : 15;
              const barColor = pct >= 70 ? '#14B8A6' : pct >= 40 ? '#F59E0B' : '#F87171';
              const barOpacity = pct >= 70 ? 1 : pct >= 40 ? 0.8 : 0.7;
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    borderRadius: '4px',
                    backgroundColor: barColor,
                    opacity: barOpacity,
                  }} />
                  <span style={{
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    marginTop: '3px',
                    lineHeight: 1,
                  }}>
                    {pct}%
                  </span>
                  <span style={{
                    fontSize: '7px',
                    color: 'rgba(20,184,166,0.6)',
                    textAlign: 'center',
                    lineHeight: 1.1,
                    letterSpacing: '0.02em',
                    marginTop: '2px',
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            width: '100%',
            height: '0.5px',
            backgroundColor: 'rgba(20,184,166,0.2)',
            marginBottom: '12px',
          }} />

          <p style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            loved and on the path to vitality
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '10px', color: 'rgba(20,184,166,0.5)' }}>{dateLabel}</span>
            <span style={{ fontSize: '10px', color: 'rgba(20,184,166,0.5)', letterSpacing: '0.06em' }}>payalabs.net</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#14B8A6] text-white text-[9px] font-mono uppercase tracking-[0.25em] rounded-xl hover:bg-[#0D9488] transition-all shadow-lg shadow-[#14B8A6]/20 disabled:opacity-50"
          >
            <Icons.Download size={16} strokeWidth={1.5} />
            Download Badge
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#1A0B2E] text-[#1A0B2E] text-[9px] font-mono uppercase tracking-[0.25em] rounded-xl hover:bg-[#1A0B2E] hover:text-white transition-all"
          >
            <Icons.Share size={16} strokeWidth={1.5} />
            Share Badge
          </button>
        </div>
      </div>
    </div>
  );
}
