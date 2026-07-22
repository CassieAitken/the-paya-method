import { useState } from 'react';
import { Icons } from '../components/Icons';

interface WaitlistProps {
  onContinue: () => void;
}

export function Waitlist({ onContinue }: WaitlistProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onContinue();
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-900 rounded-full mb-6">
            <Icons.Leaf className="w-10 h-10 text-stone-50" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-5xl tracking-tight text-stone-900 mb-4">
            Early Access
          </h1>
          <p className="text-lg text-stone-600 max-w-lg mx-auto leading-relaxed">
            Join the waitlist
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 mb-8">
          <p className="text-stone-700 text-center mb-8 leading-relaxed">
            Be among the first to access the complete <strong>Vitality Blueprint</strong> when we launch. We'll notify you the moment it's live.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Droplet className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">The Internal Battery</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Moon className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">The Restorative Cycle</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Wind className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">The Biological Shield</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Users className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">The Pack Bond</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Brain className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">Ancestral Cognition</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <Icons.Activity className="w-6 h-6 text-stone-700 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-stone-600">Biomechanical Flow</p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <p className="text-sm text-stone-600 mb-4 text-center">
              We evaluate your dog across <strong>seven biological pillars</strong> and <strong>90 longevity markers</strong> — then build a personalized roadmap for deeper vitality and a longer, more connected life together.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 transition-colors"
                    placeholder="your@email.com"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Notify Me at Launch'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Icons.Check className="w-8 h-8 text-green-600" strokeWidth={2} />
                </div>
                <p className="text-lg font-medium text-stone-900 mb-2">You're on the list!</p>
                <p className="text-sm text-stone-600">Redirecting...</p>
              </div>
            )}

            <p className="text-xs text-stone-500 text-center mt-6 italic">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors underline"
          >
            I have early access
          </button>
        </div>

        <div className="text-center mt-12">
          <a
            href="mailto:payalabs01@gmail.com"
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            payalabs01@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
