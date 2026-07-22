import { VitalityBadge } from '../components/VitalityBadge';

export function BadgePreview() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif text-neutral-800">Badge Preview</h1>
        <p className="text-sm text-neutral-500 font-light">Cormorant Garamond + Montserrat</p>
      </div>

      <VitalityBadge
        dogName="Luna"
        score={62}
        dogPhoto={null}
        phaseScores={[85, 35, 55, 88, 50, 30, 82]}
        archetypeName="The Quiet Guardian"
        dogNumber={7}
      />
    </div>
  );
}
