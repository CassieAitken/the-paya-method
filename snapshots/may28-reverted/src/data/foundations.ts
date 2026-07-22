import { Icons } from '../components/Icons';

export type FrequencyLevel = 'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | 'resilient' | 'whispering' | 'burdened';

export const frequencyLabels: Record<FrequencyLevel, string> = {
  never: 'Never',
  rarely: 'Rarely',
  sometimes: 'Sometimes',
  often: 'Usually',
  daily: 'Always',
  resilient: 'Resilient',
  whispering: 'Whispering',
  burdened: 'Burdened',
};

export const frequencyWeights: Record<FrequencyLevel, number> = {
  never: 0,
  rarely: 0.25,
  sometimes: 0.5,
  often: 0.75,
  daily: 1.0,
  resilient: 1.0,
  whispering: 0.5,
  burdened: 0,
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
    title: "The Internal Battery",
    label: "The Internal Battery",
    Icon: Icons.Activity,
    categoryWeight: 1.5,
    tagline: "Fueling the Spark.",
    guidance: "Food is the foundation of everything we measure. We're looking at what goes in, how it goes in, and whether your dog's body can actually use it.",
    insight: "When you slow down at mealtimes, your dog's nervous system gets a clear signal: safe. That calm shifts their body from stress mode into digest-and-absorb mode. The food matters. The energy around the food matters just as much.",
    endpointDesc: "What goes into the bowl — and the energy around the bowl — shapes every other pillar we measure.",
    dogNote: (name: string) => `A Note from ${name}: I notice when the colorful things from the earth land on your plate, too. When we're both nourished by nature, you move lighter. You laugh more. I love what this does for us.`,
    rituals: [
      { id: 'n1', label: 'Fresh, Real Food', weight: 2.0, desc: (name: string) => `${name}'s meals include real, whole ingredients -- fresh vegetables, organ meats, or bone broth alongside their regular food.` },
      { id: 'n2', label: 'Rest Around Meals', weight: 1.8, desc: (name: string) => `${name} gets a window of calm before and after eating -- no intense play or exercise within an hour or two of mealtime.` },
      { id: 'n3', label: 'Predictable Mealtimes', weight: 1.9, desc: (name: string) => `${name} eats at roughly the same times each day, so their body knows when to expect food.` },
      { id: 'n4', label: 'Relaxed Around Food', weight: 1.9, desc: (name: string) => `${name} can eat comfortably with people or other animals nearby -- no guarding, tension, or stress.` },
      { id: 'n5', label: 'Real Food Treats', weight: 1.6, desc: (name: string) => `${name}'s treats are real food -- bits of meat, raw bones, or vegetables rather than processed snacks.` },
      { id: 'n6', label: 'Clean, Fresh Water', weight: 1.8, desc: (name: string) => `${name} has access to clean, filtered water in a bowl that is washed and refilled at least twice a day.` },
      { id: 'n7', label: 'Moisture in Meals', weight: 1.7, desc: (name: string) => `${name}'s food has real moisture in it -- bone broth, wet food, or a splash of water mixed in.` },
      { id: 'n8', label: 'Healthy Fats', weight: 1.9, desc: (name: string) => `${name}'s diet includes foods rich in healthy fats -- like fish, eggs, or seeds.` },
      { id: 'n9', label: 'Rotating Proteins', weight: 1.7, desc: (name: string) => `${name}'s main protein source changes every month or so -- cycling through beef, chicken, fish, or game.` },
      { id: 'n10', label: 'Safe Food Bowls', weight: 1.5, desc: (name: string) => `${name} eats from stainless steel, ceramic, or glass -- not plastic.` },
      { id: 'n11', label: 'Thoughtful Portions', weight: 1.8, desc: (name: string) => `${name}'s portions are adjusted based on how their body looks and feels rather than just a fixed measurement.` },
      { id: 'n12', label: 'Healthy, Consistent Stools', weight: 2.0, desc: (name: string) => `${name}'s stools are consistently firm, uniform in color, and easy to pick up.`, legacySignal: true },
      { id: 'n13', label: 'Comfortable Eating Position', weight: 1.6, desc: (name: string) => `${name} eats from a surface height that feels natural for their body -- elevated for larger or older dogs so they don't strain.`, legacySignal: true },
      { id: 'n14', label: 'Overnight Fasting Window', weight: 1.7, desc: (name: string) => `${name} has at least a 10-12 hour window between the last meal of the day and the first of the next -- giving their gut time to rest.` },
      { id: 'n15', label: 'Healthy Appetite', weight: 2.0, desc: (name: string) => `${name} approaches meals with clear enthusiasm and finishes eating within a reasonable time -- no prolonged disinterest or walking away from a full bowl.`, legacySignal: true },
      { id: 'n16', label: 'Comfortable Elimination', weight: 1.8, desc: (name: string) => `${name} urinates and defecates easily and on a predictable schedule -- no straining, frequent urgency, or visible discomfort.` }
    ]
  },
  {
    id: 'repair',
    title: "The Restorative Cycle",
    label: "The Restorative Cycle",
    Icon: Icons.Moon,
    categoryWeight: 1.4,
    tagline: "The Art of Stillness.",
    guidance: "Cellular recovery happens when the world goes quiet. We're measuring sleep quality, recovery speed, and whether your dog's body gets the stillness it needs to repair.",
    insight: "When your dog feels safe and the house goes quiet, their body drops into deep restoration -- repairing what each day wears down. No safety signal, no repair. It's that simple.",
    endpointDesc: "How well your dog rests — and whether their body gets the deep quiet it needs to heal.",
    dogNote: (name: string) => `A Note from ${name}: The air feels different when your spirit is calm. I notice when you breathe deeper. Your peace heals and strengthens me in ways you might not see, but I feel all of it.`,
    rituals: [
      { id: 's4', label: 'Easy Morning Movement', weight: 1.3, desc: (name: string) => `${name} moves easily when they wake up -- no lingering stiffness, "walking it off," or reluctance to stand and stretch.`, legacySignal: true },
      { id: 's5', label: 'Calm When Alone', weight: 1.3, desc: (name: string) => `${name} settles comfortably when left alone -- no destructive behavior, excessive barking, pacing, or signs of distress when you leave.` },
      { id: 's8', label: 'Emotional Steadiness', weight: 1.3, desc: (name: string) => `${name} recovers quickly from stressful moments -- a loud noise, a stranger, or an unexpected change -- returning to calm without prolonged panting, trembling, or hiding.` },
      { id: 's10', label: 'Sleeping Through the Night', weight: 1.2, desc: (name: string) => `${name} sleeps through the night without frequent repositioning, pacing, or searching for a new spot.`, legacySignal: true }
    ]
  },
  {
    id: 'environmental',
    title: "The Biological Shield",
    label: "The Biological Shield",
    Icon: Icons.Home,
    categoryWeight: 1.3,
    tagline: "Designing for Purity.",
    guidance: "Your home is either supporting your dog's immune system or quietly working against it. We're measuring the invisible exposures -- the ones they absorb before you even notice.",
    insight: "Dogs live closer to the ground. They breathe faster than you. They're the first to absorb what's in the air, on the floor, and in the water. Creating a pure environment isn't extra -- it's foundational.",
    endpointDesc: "Your home either supports their immune system or slowly wears it down. We measure which one.",
    dogNote: (name: string) => `A Note from ${name}: When the air feels fresh and clean, my whole being feels lighter. Thank you for making our home a sanctuary.`,
    rituals: [
      { id: 'e1', label: 'Natural Pest Control', weight: 1.6, desc: (name: string) => `${name}'s home uses natural or pet-safe solutions for pest control rather than harsh chemical sprays or synthetic traps.` },
      { id: 'e2', label: 'Clean, Natural Scents', weight: 1.5, desc: (name: string) => `${name}'s home favors natural scents -- essential oils, fresh air -- over synthetic plug-ins, paraffin candles, or chemical room sprays.` },
      { id: 'e4', label: 'Natural Light Exposure', weight: 1.4, desc: (name: string) => `${name}'s living spaces allow real natural light in during the day -- not just artificial lighting -- helping their body maintain a healthy circadian rhythm.` },
      { id: 'e6', label: 'A Chemical-Free Yard', weight: 1.6, desc: (name: string) => `${name}'s outdoor spaces are managed without synthetic weed killers or pesticides -- you favor hand-weeding or organic methods.` }
    ]
  },
  {
    id: 'sync',
    title: "The Pack Bond",
    label: "The Pack Bond",
    Icon: Icons.Heart,
    categoryWeight: 1.6,
    tagline: "The Architecture of Belonging.",
    guidance: "Your presence -- real presence, not distracted -- is the most powerful input in your dog's biology. We're measuring the quality of your shared time and the nervous system conversation between you.",
    insight: "When you're grounded, their inflammation drops. When you're scattered, their repair systems downshift. Your calm isn't metaphor. It's measurable biology.",
    endpointDesc: "Your nervous system is their anchor. We measure how well it's holding.",
    dogNote: (name: string) => `A Note from ${name}: When you put the glowing rectangle away and your eyes find mine, I feel your heart slow down. In those moments, I know I'm not alone. That's when I feel safe enough to truly heal and recover.`,
    rituals: [
      { id: 'pb1', label: 'Undivided Presence', weight: 1.2, desc: (name: string) => `${name} gets 15-30 minutes of your full attention every day -- no phones, no screens, no mental to-do lists. Just you and them.` },
      { id: 'pb6', label: 'Managing Your Own Stress', weight: 1.2, desc: (name: string) => `${name}'s human is aware of their own stress levels and actively works to keep that energy from spilling over into their time together.` },
      { id: 'pb8', label: 'Time with Other Dogs', weight: 1.4, desc: (name: string) => `${name} gets regular time with other dogs -- whether through play dates, walks together, or just relaxed coexistence -- fulfilling their need for same-species connection.` },
      { id: 'pb10', label: 'They Come to You', weight: 1.1, desc: (name: string) => `${name} frequently approaches you on their own to start a game or ask for attention -- a sign of deep relational trust.`, legacySignal: true }
    ]
  },
  {
    id: 'cognitive',
    title: "Ancestral Cognition",
    label: "Ancestral Cognition",
    Icon: Icons.Brain,
    categoryWeight: 1.0,
    tagline: "Activating the Instinctual Mind.",
    guidance: "Mental stagnation ages a dog faster than most physical ailments. We're measuring how often your dog's ancestral senses -- scent, problem-solving, and exploration -- get activated.",
    insight: "When you invite your dog to use their nose or explore new terrain, you're not just entertaining them. You're activating neural pathways that keep their mind sharp and their body resilient.",
    endpointDesc: "A stimulated mind protects the body. We measure how often those ancestral circuits fire.",
    dogNote: (name: string) => `A Note from ${name}: When you hide my toys and ask me to use my nose, I remember what it feels like to be fully alive. Every puzzle you give me keeps my mind young.`,
    rituals: [
      { id: 'c1', label: 'Nose Games', weight: 0.7, desc: (name: string) => `A few times a week, you hide treats or toys and let ${name} use their nose to find them -- turning sniffing into a game.` },
      { id: 'c5', label: 'Sniff Walks', weight: 0.7, desc: (name: string) => `${name} gets to lead the walk -- following their nose at their own pace, no destination required.` },
      { id: 'c11', label: 'Breed-Specific Play', weight: 0.6, desc: (name: string) => `You give ${name} outlets for their breed instincts -- whether that's retrieving, chasing, herding, or guarding-style play.` },
      { id: 'c12', label: 'Loves to Chew', weight: 1.2, desc: (name: string) => `${name} regularly gets appropriate things to chew on -- raw bones, bully sticks, or tough rubber toys -- and engages with them calmly and happily.` }
    ]
  },
  {
    id: 'biomechanical',
    title: "Biomechanical Flow",
    label: "Biomechanical Flow",
    Icon: Icons.Compass,
    categoryWeight: 1.2,
    tagline: "The Dialogue of Motion.",
    guidance: "Movement is the most honest signal your dog sends. We're measuring gait quality, joint freedom, recovery speed, and whether their body moves the way nature designed it to.",
    insight: "The way your dog moves is a dialogue between muscles, joints, and the earth they stand on. Stiffness isn't just stiffness -- it's a signal. Fluid motion isn't luck -- it's the result of the right inputs.",
    endpointDesc: "How freely they move reveals how well the whole system works. We measure the signal.",
    dogNote: (name: string) => `A Note from ${name}: When we walk at my pace through the dirt instead of hard concrete, my whole body feels lighter. I remember what it feels like to move freely.`,
    rituals: [
      { id: 'bf0', label: 'Daily Exercise', weight: 2.0, desc: (name: string) => `${name} gets meaningful physical exercise appropriate for their age and ability every day -- a real walk, a run, active play, or swimming -- enough to leave them pleasantly tired.` },
      { id: 'bf3', label: 'Smooth, Balanced Movement', weight: 1.6, desc: (name: string) => `${name} moves fluidly and looks balanced from side to side -- no limping, favoring a leg, or "bunny hopping" with the back legs.` },
      { id: 'bf6', label: 'Free Running Time', weight: 1.6, desc: (name: string) => `${name} gets regular chances to move freely off-leash in a safe space -- at whatever pace and intensity feels right for their body.` },
      { id: 'bf13', label: 'Time Outside', weight: 1.8, desc: (name: string) => `${name} spends real time outdoors every day -- not just quick bathroom breaks, but extended time in fresh air, natural light, and open space.` }
    ]
  },
  {
    id: 'baseline',
    title: "Physiological Harmony",
    label: "Physiological Harmony",
    Icon: Icons.Thermometer,
    categoryWeight: 1.4,
    tagline: "Reading the Biological Map.",
    guidance: "Clear eyes. A shiny coat. Easy breathing. These aren't cosmetic -- they're your dog's early warning system. We're measuring the physical markers that signal shifts before anything goes clinically wrong.",
    insight: "The body communicates health through visible, tangible signs every day, in plain sight. These markers are the first to shift when something's off, and the first to improve when you get the inputs right.",
    endpointDesc: "The visible markers that tell you everything before anything goes wrong. We read them for you.",
    dogNote: (name: string) => `A Note from ${name}: When you check my paws and look closely into my eyes, I feel seen. Thank you for noticing the quiet things my body is trying to tell you.`,
    rituals: [
      { id: 'v1', label: 'Healthy Weight', weight: 2.1, desc: (name: string) => `${name} carries a healthy weight -- you can feel their ribs easily, see a defined waist, and there's no belly sag or heavy fat pad at the base of the tail.` },
      { id: 'v2', label: 'Bright, Clear Eyes', weight: 1.9, desc: (name: string) => `${name}'s eyes are clear, bright, and alert -- no persistent cloudiness, redness, or excessive discharge.`, legacySignal: true },
      { id: 'v3', label: 'Comfortable Skin', weight: 2.1, desc: (name: string) => `${name}'s skin looks calm and healthy -- no persistent redness, hot spots, scabs, or constant scratching in one spot.` },
      { id: 'v4', label: 'Healthy Mouth', weight: 1.9, desc: (name: string) => `${name}'s gums are a healthy pink, teeth are free of heavy tartar, and breath is neutral rather than offensive.` },
      { id: 'v5', label: 'Soft, Shiny Coat', weight: 1.7, desc: (name: string) => `${name}'s coat has a natural shine and softness to it -- shedding follows normal seasonal patterns rather than being constant or patchy.` },
      { id: 'v6', label: 'Healthy Paw Pads', weight: 1.7, desc: (name: string) => `${name}'s paw pads are smooth and intact -- no deep cracks, peeling, or rough overgrowth.` },
      { id: 'v7', label: 'Clean, Healthy Ears', weight: 1.7, desc: (name: string) => `${name}'s ears are clean and odor-free -- no dark buildup, yeasty smell, or flinching when you rub the base of the ear.` },
      { id: 'v9', label: 'Easy, Quiet Breathing', weight: 1.9, desc: (name: string) => `At rest, ${name} breathes easily and quietly through the nose -- no heavy panting, wheezing, or labored effort when they should be relaxed.`, legacySignal: true },
      { id: 'v10', label: 'Right Energy for Their Age', weight: 2.1, desc: (name: string) => `${name}'s energy fits where they are in life -- retaining that "spark" and desire to engage with the world around them.` },
      { id: 'v11', label: 'The Hydration Snap', weight: 1.5, desc: (name: string) => `When you gently pinch the skin between ${name}'s shoulder blades, it snaps back into place right away -- a sign of deep, healthy hydration.` },
      { id: 'v13', label: 'Vivid Gums and Tongue', weight: 1.5, desc: (name: string) => `When you look at ${name}'s tongue and gums, they appear vivid and rich in color -- a sign of strong circulation and healthy oxygenation.` },
      { id: 'v14', label: 'Regular Brushing', weight: 1.6, desc: (name: string) => `${name} gets brushed regularly -- not just for appearance, but to stimulate circulation, check for lumps or irritation, and keep their coat and skin healthy.` },
      { id: 'v15', label: 'Clean, Healthy Nose', weight: 1.5, desc: (name: string) => `${name}'s nose is typically moist and free of persistent discharge, cracking, or sores.`, legacySignal: true }
    ]
  }
];
