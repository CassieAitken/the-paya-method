import { Icons } from '../components/Icons';

export type FrequencyLevel = 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';

export const frequencyLabels: Record<FrequencyLevel, string> = {
  never: 'Not Currently',
  rarely: 'Occasionally',
  sometimes: 'Sometimes',
  often: 'Often',
  daily: 'Regularly'
};

export const frequencyWeights: Record<FrequencyLevel, number> = {
  never: 0,
  rarely: 0.25,
  sometimes: 0.5,
  often: 0.75,
  daily: 1.0
};

export interface Ritual {
  id: string;
  label: string;
  weight: number;
  desc: (dogName: string) => string;
}

// @ts-nocheck
export const foundations: any[] = [
  {
    id: 'metabolic',
    title: "Nutritional Alchemy",
    label: "Nutritional Alchemy",
    Icon: Icons.Activity,
    categoryWeight: 1.5,
    guidance: "Food is the foundation of vitality. In this phase, we explore how diet influences your dog's nutrition and wellbeing.",
    insight: "The rhythm of your daily life is the biological metronome for your dog's gut. When mealtimes are treated with intention and a grounded presence, you send a profound signal of safety to their cells. This calm authorization allows their body to shift into a deep parasympathetic state—the only state where true nutritional alchemy and cellular repair can occur.",
    endpointDesc: "Analysis: Nutritional Foundations — Evaluates how daily diet directly influences gene expression, immune function, and cellular nutrient uptake. Proper enzymatic function requires a parasympathetic baseline that domestic dogs often lack due to metabolic timing issues. By focusing on bioavailable whole foods, you are essentially providing the 'software' for their DNA to run the protocols of longevity and repair.",
    dogNote: (name: string) => `"A Note from ${name}: I notice when the colorful things from the earth land on your plate, too. When we're both nourished by nature, you move lighter. You laugh more. I love what this does for us."`,
    rituals: [
      { id: 'n1', label: 'Fresh Whole Food Integration', weight: 2.0, desc: (name) => `${name} receives fresh whole foods (vegetables, organ meats, broth) comprising 25%+ of daily meals.` },
      { id: 'n2', label: 'Exercise-Meal Spacing', weight: 1.8, desc: (name) => `Vigorous activity is avoided for 1-2 hours before and after ${name}'s meals.` },
      { id: 'n3', label: 'Consistent Mealtime Routine', weight: 1.9, desc: (name) => `${name} eats at fixed times daily (same hours for breakfast and dinner).` },
      { id: 'n4', label: 'Calm Eating Behavior', weight: 1.9, desc: (name) => `${name} eats slowly and calmly without gulping; you don't observe stress or food anxiety during meals.` },
      { id: 'n5', label: 'Whole Food Treat Protocol', weight: 1.6, desc: (name) => `${name}'s treats are whole foods (meat, bones, vegetables) without processed binders or artificial ingredients.` },
      { id: 'n6', label: 'Water Quality & Freshness', weight: 1.8, desc: (name) => `${name} has access to filtered water; the bowl is refilled and washed at least twice daily.` },
      { id: 'n7', label: 'Meal Moisture Content', weight: 1.7, desc: (name) => `${name}'s meals include visible moisture (broth, wet food, or added water); at least 20% liquid content.` },
      { id: 'n8', label: 'Omega-3 Inclusion', weight: 1.9, desc: (name) => `${name} receives omega-rich foods (fish, eggs, seeds) 3-4 times per week with measurable amounts.` },
      { id: 'n9', label: 'Primary Protein Rotation', weight: 1.7, desc: (name) => `${name}'s main protein source rotates every 4-6 weeks (beef, poultry, fish, game).` },
      { id: 'n10', label: 'Food-Grade Vessels', weight: 1.5, desc: (name) => `${name} eats from ceramic, glass, or stainless steel—never plastic bowls.` },
      { id: 'n11', label: 'Portion Size Intentionality', weight: 1.8, desc: (name) => `You measure ${name}'s portions intentionally based on condition; you weigh or portion daily/weekly.` }
    ]
  },
  {
    id: 'repair',
    title: "Somatic Restoration",
    label: "Somatic Restoration",
    Icon: Icons.Moon,
    categoryWeight: 1.4,
    guidance: "Cellular recovery happens when the world is quiet. We explore sleep quality and restorative rest.",
    insight: "Sleep is the sacred window where the body translates the day's experiences into cellular wisdom and physical repair. When you cultivate deep, regulated peace, you give them permission to lower their ancestral guard and heal.",
    endpointDesc: "Analysis: Circadian Biology & Cellular Repair — Measures the efficiency of daily sleep-wake cycles and the environment's capacity for tissue regeneration. Domestic light pollution and sonic noise are the primary disruptors of longevity. When the central nervous system cannot sink into deep parasympathetic rest, cellular turnover slows and biological age accelerates.",
    dogNote: (name: string) => `"A Note from ${name}: The air feels different when your spirit is calm. I notice when you breathe deeper. Your peace heals me in ways you might not see, but I feel all of it."`,
    rituals: [
      { id: 's1', label: 'Dark Sleep Environment', weight: 1.1, desc: (name) => `${name}'s primary sleeping area is completely dark (minimal streetlight, covered indicator lights, blackout covering).` },
      { id: 's2', label: 'Consistent Sleep Schedule', weight: 1.2, desc: (name) => `${name} goes to bed and wakes within a 1-hour window daily (consistency helps circadian rhythm).` },
      { id: 's3', label: 'Secure Sleep Proximity', weight: 1.0, desc: (name) => `${name} sleeps near a companion (human, other dog/cat) or in a secure, enclosed space for psychological safety.` },
      { id: 's4', label: 'Post-Rest Movement Quality', weight: 1.3, desc: (name) => `After naps or overnight, ${name} rises without stiffness, limping, or reluctance; movement is fluid within seconds.` },
      { id: 's5', label: 'Circadian Light Schedule', weight: 0.9, desc: () => "You reduce bright overhead lighting 1-2 hours before bedtime; evening environment uses only warm amber/red-spectrum lights." },
      { id: 's6', label: 'Orthopedic Sleep Surface', weight: 1.0, desc: (name) => `${name} sleeps on a memory foam or orthopedic bed (not thin mat or bare floor).` },
      { id: 's7', label: 'Activity Recovery Speed', weight: 0.9, desc: (name) => `After vigorous activity, ${name} returns to calm, settled breathing within 15-20 minutes.` },
      { id: 's8', label: 'Thermal Comfort', weight: 0.7, desc: (name) => `${name}'s sleeping area is free from cold drafts and temperature extremes (stable 65-72F).` },
      { id: 's9', label: 'Bathroom Consistency', weight: 1.4, desc: (name) => `${name} has bowel movements at predictable times daily; consistency is firm; no straining observed.` },
      { id: 's10', label: 'Safe Retreat Space', weight: 0.8, desc: (name) => `${name} has a semi-enclosed, den-like space (crate, tent, under furniture) for secure rest.` },
      { id: 's11', label: 'Post-Meal Rest Period', weight: 0.9, desc: (name) => `After meals, ${name} rests calmly for 30+ minutes before significant activity.` }
    ]
  },
  {
    id: 'environmental',
    title: "Environmental Purity",
    label: "Environmental Purity",
    Icon: Icons.Home,
    categoryWeight: 1.3,
    guidance: "A dog's vitality is influenced by their surroundings. We explore your home's environmental wellness.",
    insight: "Your home is a biological sanctuary, but it is also a sponge for the invisible modern world. Because dogs live closer to the ground and breathe more frequently than you, they are the first to absorb exposures. Creating a pure environment is an act of deep love.",
    endpointDesc: "Analysis: Environmental Purity — Tracks the cumulative impact of household factors on long-term immune function. Domestic surfaces influence immune health. Supporting clean environments supports overall wellbeing.",
    dogNote: (name: string) => `"A Note from ${name}: When the air feels fresh and clean, my whole being feels lighter. Thank you for making our home a sanctuary."`,
    rituals: [
      { id: 'e1', label: 'Chemical-Free Pest Control', weight: 1.6, desc: () => "Your home avoids synthetic pesticides; pest management uses natural methods (diatomaceous earth, sealed gaps) or professional barriers only." },
      { id: 'e2', label: 'Synthetic Fragrance Elimination', weight: 1.5, desc: () => "No plug-in air fresheners, scented candles, or synthetic fragrances are used in the home." },
      { id: 'e3', label: 'Natural Surface Cleaning', weight: 1.3, desc: () => "Floors and surfaces are cleaned with natural products (vinegar, castile soap, baking soda) rather than chemical cleaners." },
      { id: 'e4', label: 'Daily Fresh Air Exchange', weight: 0.9, desc: () => "Windows are opened 20-30 minutes daily (opposite sides of home) for cross-ventilation and air quality." },
      { id: 'e5', label: 'Non-Slip Flooring Safety', weight: 1.0, desc: (name) => `${name} has non-slip flooring (rugs, mats) in high-traffic areas to prevent joint strain.` },
      { id: 'e6', label: 'Pesticide-Free Yard', weight: 1.6, desc: () => "Your yard is completely free of synthetic herbicides and pesticides; weeds are managed manually or naturally." },
      { id: 'e7', label: 'Regular Deep Cleaning', weight: 0.8, desc: () => "Home is vacuumed with HEPA filter at least weekly; carpets and furniture are deep-cleaned monthly." },
      { id: 'e8', label: 'Quiet Retreat Zone', weight: 1.0, desc: () => "At least one room in your home is permanently free from TV, speakers, and loud electronics." },
      { id: 'e9', label: 'EMF Distance Management', weight: 0.7, desc: (name) => `Wi-Fi router and heavy electronics are positioned 10+ feet away from ${name}'s primary sleeping area.` },
      { id: 'e10', label: 'Natural Material Toys', weight: 1.0, desc: (name) => `${name}'s toys are made from natural materials (wood, rope, leather, rubber) without degrading plastics.` },
      { id: 'e11', label: 'Natural Body Care Products', weight: 1.0, desc: (name) => `${name} is bathed with plant-based, sulfate-free shampoo (or none, just water and vinegar rinse).` }
    ]
  },
  {
    id: 'sync',
    title: "The Pack Bond",
    label: "The Pack Bond",
    Icon: Icons.Heart,
    categoryWeight: 1.6,
    guidance: "Your presence is a powerful influence on their wellbeing. We explore your connection and shared time.",
    insight: "In an age of infinite digital noise, your focused, undivided attention is the rarest and most potent gift. When you choose to be truly 'here', you trigger a mutual healing loop that benefits both your nervous systems.",
    endpointDesc: "Analysis: Heart Resonance & Belonging — Assesses human-dog connection and emotional wellbeing. Your calm presence is a primary factor in their overall vitality. When the Pack Bond is strong, they thrive.",
    dogNote: (name: string) => `"A Note from ${name}: When you put the glowing rectangle away and your eyes find mine, I feel your heart slow down. In those moments, I know I'm not alone. That's when I feel safe enough to truly heal."`,
    rituals: [
      { id: 'pb1', label: 'Undivided Attention Time', weight: 1.2, desc: (name) => `You spend 15-30 minutes daily with ${name} with zero phone/screen time (not thinking about work either).` },
      { id: 'pb2', label: 'Calm Reunion Protocol', weight: 1.0, desc: () => "When returning home, you wait 1-2 minutes for calm before greeting; no frantic excitement or reward." },
      { id: 'pb3', label: 'Daily Companionship Pattern', weight: 1.0, desc: (name) => `You and ${name} share the same room for at least 50% of your waking hours at home.` },
      { id: 'pb4', label: 'Shared Activity Engagement', weight: 0.9, desc: (name) => `You and ${name} engage in activities you both enjoy 3-4 times weekly (walks, play, training, games).` },
      { id: 'pb5', label: 'Midday Reconnection Ritual', weight: 0.8, desc: (name) => `You take a dedicated 10-15 minute midday pause with ${name} (breaks up their alone time, even briefly).` },
      { id: 'pb6', label: 'Owner Nervous System Calm', weight: 1.2, desc: () => "You describe yourself as generally calm and emotionally regulated; you manage stress without taking it out on your dog." },
      { id: 'pb7', label: 'Frequent Gentle Touch', weight: 0.9, desc: (name) => `You touch ${name} affectionately (petting, massage) multiple times throughout the day without demand.` },
      { id: 'pb8', label: 'Calm Tone Communication', weight: 0.9, desc: (name) => `You speak to ${name} in low, calm, regulated tones (not high-pitched, sharp, or reactive).` },
      { id: 'pb9', label: 'Conflict Resolution Pattern', weight: 1.1, desc: () => "When disagreements occur, you resolve them calmly without punishment or frustration; teaching, not reacting." },
      { id: 'pb10', label: 'Visible Play Initiation', weight: 1.1, desc: (name) => `${name} frequently initiates play, asks for attention, or engages you without hesitation or anxiety.` },
      { id: 'pb11', label: 'Enthusiasm & Greeting Behavior', weight: 1.0, desc: (name) => `${name} greets you with relaxed tail wagging, soft eyes, and enthusiastic but calm engagement.` }
    ]
  },
  {
    id: 'cognitive',
    title: "Ancestral Cognition",
    label: "Ancestral Cognition",
    Icon: Icons.Brain,
    categoryWeight: 1.0,
    guidance: "A sharp mind supports physical vitality. We explore mental engagement and cognitive enrichment.",
    insight: "A dog's mind thrives on engagement and novel experiences. When you invite them to use their ancestral senses through scent and challenge, you support their mental wellness and keep their mind young.",
    endpointDesc: "Analysis: Neural Vitality & Cognitive Reserve — Measures mental engagement and cognitive enrichment. Novelty supports brain health. By engaging your dog's mind with interesting textures, scents, and challenges, you support cognitive wellbeing.",
    dogNote: (name: string) => `"A Note from ${name}: When you hide my toys and ask me to use my nose, I remember what it feels like to be fully alive. Every puzzle you give me keeps my mind young."`,
    rituals: [
      { id: 'c1', label: 'Scent Work Frequency', weight: 0.7, desc: (name) => `${name} engages in scent-based games (hidden treats, nosework) 3-4 times weekly, 10-15 minutes per session.` },
      { id: 'c2', label: 'Puzzle Toy Engagement', weight: 0.6, desc: (name) => `${name} works with puzzle toys 3-4 times weekly; engagement time is 10-20 minutes per session.` },
      { id: 'c3', label: 'Ongoing Vocabulary Expansion', weight: 0.6, desc: (name) => `You actively teach ${name} new words or commands; they've learned at least 3 new behaviors in the past 6 months.` },
      { id: 'c4', label: 'Natural Foraging Access', weight: 0.5, desc: (name) => `${name} has a safe area to dig, sniff, and forage in natural soil 2-3 times weekly for 10-15 minutes.` },
      { id: 'c5', label: 'Scent-Led Walking', weight: 0.7, desc: (name) => `During walks, ${name} leads and sniffs freely (you follow their nose) at least 1-2 times weekly.` },
      { id: 'c6', label: 'Novel Environment Exposure', weight: 0.6, desc: (name) => `${name} visits genuinely new places (parks, trails, neighborhoods) at least monthly.` },
      { id: 'c7', label: 'Proprioceptive Challenge', weight: 0.6, desc: (name) => `${name} navigates varied terrain (hills, logs, sand, water) during regular outings; not always the same surfaces.` },
      { id: 'c8', label: 'Social Name Recognition', weight: 0.6, desc: () => "Your dog reliably recognizes and locates family members by name (\"Go find Mom\") consistently." },
      { id: 'c9', label: 'Directional Cue Learning', weight: 0.5, desc: (name) => `You use and ${name} responds to directional cues (left, right, forward) during walks or play.` },
      { id: 'c10', label: 'Task Persistence & Confidence', weight: 0.6, desc: (name) => `When faced with a puzzle or challenge, ${name} tries to solve it rather than giving up immediately; shows curiosity.` },
      { id: 'c11', label: 'Diverse Terrain Exposure', weight: 0.6, desc: (name) => `${name} walks on at least 4 different surface types weekly (grass, sand, dirt, water, gravel, concrete, etc.).` }
    ]
  },
  {
    id: 'biomechanical',
    title: "Biomechanical Flow",
    label: "Biomechanical Flow",
    Icon: Icons.Compass,
    categoryWeight: 1.2,
    guidance: "We explore how your dog moves through their world and physical freedom.",
    insight: "The way a dog moves through the world is a reflection of physical freedom and health. Movement is a dialogue between their muscles, joints, and the earth they stand on.",
    endpointDesc: "Analysis: Musculoskeletal Integrity — Evaluates movement quality and physical wellbeing. Regular, natural movement supports structural health. Maintaining muscle tone and flexibility supports quality of life.",
    dogNote: (name: string) => `"A Note from ${name}: When we walk at my pace through the dirt instead of hard concrete, my whole body feels lighter. I remember what it feels like to move freely."`,
    rituals: [
      { id: 'bf1', label: 'Body Condition Monitoring', weight: 1.6, desc: (name) => `You perform weekly body checks on ${name}; you can easily feel ribs without pressing hard.` },
      { id: 'bf2', label: 'Dog-Paced Walking', weight: 1.3, desc: (name) => `Most walks allow ${name} to set the pace with slack leash; you walk at their natural rhythm, not forcing speed.` },
      { id: 'bf3', label: 'Fluid Movement Quality', weight: 1.6, desc: (name) => `${name} moves fluidly without limping, stiffness after rest, or favoring any limbs; gait is even and balanced.` },
      { id: 'bf4', label: 'Early Morning Sunlight', weight: 1.5, desc: (name) => `${name} gets 10-15 minutes of unfiltered morning sunlight within 1 hour of waking.` },
      { id: 'bf5', label: 'Natural Ground Contact', weight: 1.3, desc: (name) => `${name} regularly walks on natural surfaces (dirt, grass, sand) for 50%+ of total walking time.` },
      { id: 'bf6', label: 'Off-Leash Running Access', weight: 1.6, desc: (name) => `${name} has 20-30 minutes of safe, unrestricted off-leash running 2-3 times weekly.` },
      { id: 'bf7', label: 'Stairs & Jumping Comfort', weight: 1.4, desc: (name) => `${name} navigates stairs without limping or reluctance; can jump on/off furniture without pain or hesitation.` },
      { id: 'bf8', label: 'No Joint Strain Behaviors', weight: 1.3, desc: (name) => `You don't observe reluctance to rise after rest, stiffness in hind legs, or pain-avoidance behaviors.` },
      { id: 'bf9', label: 'Natural Stretching Behavior', weight: 1.1, desc: (name) => `${name} stretches naturally (front bows, hip circles) multiple times throughout the day.` },
      { id: 'bf10', label: 'Visible Muscle Tone', weight: 1.5, desc: (name) => `${name} has visible muscle tone in hind legs and shoulders (not soft, not overly bulky); athletic appearance.` }
    ]
  },
  {
    id: 'baseline',
    title: "Physiological Harmony",
    label: "Physiological Harmony",
    Icon: Icons.Thermometer,
    categoryWeight: 1.4,
    guidance: "We explore physical wellness markers that reflect your dog's overall health.",
    insight: "The body communicates health through visible and tangible signs. These physical markers are the early warning system, signaling subtle shifts in your dog's wellbeing.",
    endpointDesc: "Analysis: Physical Health Markers — Tracks indicators like coat quality and eye brightness that signal internal health. By becoming familiar with your dog's unique wellness patterns, you support proactive care.",
    dogNote: (name: string) => `"A Note from ${name}: When you check my paws and look closely into my eyes, I feel seen. Thank you for noticing the quiet things my body is trying to tell you."`,
    rituals: [
      { id: 'v1', label: 'Lean Body Condition', weight: 2.1, desc: (name) => `${name} maintains a lean condition: ribs easily felt, visible waist, no abdominal sag.` },
      { id: 'v2', label: 'Clear, Bright Eyes', weight: 1.9, desc: (name) => `${name}'s eyes are clear, bright, and alert with minimal discharge (less than occasional eye boogers).` },
      { id: 'v3', label: 'Calm Skin Baseline', weight: 2.1, desc: (name) => `${name}'s skin is calm with no chronic redness, hot spots, scabs, or excessive itching (less than 1-2 times daily).` },
      { id: 'v4', label: 'Oral Health', weight: 1.9, desc: (name) => `${name} has pink, healthy gums; clean teeth without excessive tartar; fresh breath (no foul odor).` },
      { id: 'v5', label: 'Coat Luster & Shedding', weight: 1.7, desc: (name) => `${name}'s coat is soft, shiny, and shedding is seasonal (not excessive year-round; manageable quantity).` },
      { id: 'v6', label: 'Paw Pad Health', weight: 1.7, desc: (name) => `${name}'s paw pads are smooth without deep cracks, peeling, or excessive dry growth; pink/grey coloring normal.` },
      { id: 'v7', label: 'Ear Cleanliness', weight: 1.7, desc: (name) => `${name}'s ears are clean, odor-free, with no dark buildup, redness, or sensitivity to touch.` },
      { id: 'v8', label: 'Healthy Digestion', weight: 2.1, desc: (name) => `${name}'s stools are consistently firm, appropriately colored, easy to pick up, low-odor; no diarrhea or constipation.` },
      { id: 'v9', label: 'Easy Breathing & Comfort', weight: 1.9, desc: (name) => `${name} breathes silently during rest; no excessive panting, wheezing, snoring, or labored breathing.` },
      { id: 'v10', label: 'Age-Appropriate Vitality', weight: 2.1, desc: (name) => `${name}'s energy level is appropriate for their age: puppies play frequently; adults engage 1-2x daily; seniors still active.` }
    ]
  }
];
