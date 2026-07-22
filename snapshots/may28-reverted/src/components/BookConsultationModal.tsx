import { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { supabase } from '../lib/supabase';

interface BookConsultationModalProps {
  isOpen: boolean;
  dogName?: string;
  ownerEmail?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BookConsultationModal({
  isOpen,
  dogName,
  ownerEmail,
  onClose,
  onSuccess
}: BookConsultationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const [step, setStep] = useState<'slots' | 'details' | 'confirmation'>('slots');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [email, setEmail] = useState(ownerEmail || '');
  const [dogNameInput, setDogNameInput] = useState(dogName || '');
  const [bringDog, setBringDog] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const availableHours = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
  const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'];

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTzAbbr = new Intl.DateTimeFormat('en-US', { timeZone: userTimezone, timeZoneName: 'short' })
    .formatToParts(new Date())
    .find(p => p.type === 'timeZoneName')?.value ?? userTimezone;
  const isEastern = userTzAbbr === 'EST' || userTzAbbr === 'EDT';

  const estToLocal = (dateStr: string, estTimeStr: string): string => {
    const [time, period] = estTimeStr.split(' ');
    const [h, m] = time.split(':').map(Number);
    const hours24 = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
    const estDate = new Date(`${dateStr}T${String(hours24).padStart(2, '0')}:${String(m).padStart(2, '0')}:00-05:00`);
    return estDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: userTimezone,
      hour12: true
    });
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (availableDays.includes(dayName)) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          dayName
        });
      }
    }

    return dates.slice(0, 14);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !email) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;

      const appointmentDateTime = new Date(`${selectedDate}T${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert({
          email,
          dog_name: dogNameInput || null,
          booked_for: appointmentDateTime.toISOString(),
          status: 'confirmed',
          payment_status: 'pending'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBookingId(data.id);
        setStep('confirmation');
        setSelectedDate('');
        setSelectedTime('');

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-consultation-receipt`;
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            dogName: dogNameInput || dogName || 'your dog',
          }),
        }).catch(console.error);

        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const availableDates = getNextAvailableDates();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-b from-stone-50 to-white p-8 lg:p-12 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              {step === 'slots' && (
                <div>
                  <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">Practitioner Deep-Dive</h3>
                  <p className="text-ink-muted text-lg mt-2 font-light">Professional consultation upgrade — valid 90 days from purchase</p>
                </div>
              )}
              {step === 'details' && (
                <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">Your Details</h3>
              )}
              {step === 'confirmation' && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center">
                    <Icons.Check size={24} className="text-white" />
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">Booked!</h3>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Icons.X size={24} className="text-ink-soft" />
            </button>
          </div>

          {/* Slots Selection */}
          {step === 'slots' && (
            <div className="space-y-8">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Icons.Info size={16} className="text-ink-muted" />
                  <p className="text-sm text-ink-soft font-light">
                    Available <strong>Mon–Thu & Sat–Sun, 12pm–7pm EST.</strong>
                    {!isEastern && (
                      <span className="block mt-1 text-ink-faint">
                        Times shown in your local timezone ({userTzAbbr}).
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium block">
                    Date
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availableDates.map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-3 border-2 rounded-lg transition-all text-sm font-light ${
                          selectedDate === d.date
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="font-mono text-[10px] font-medium">{d.display}</div>
                        <div className="text-[11px] opacity-75">{d.dayName}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium block">
                    Time {isEastern ? '(EST)' : `(${userTzAbbr})`}
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availableHours.map((hour) => {
                      const localTime = selectedDate ? estToLocal(selectedDate, hour) : null;
                      const displayTime = localTime && !isEastern ? localTime : hour;
                      const subLabel = localTime && !isEastern ? hour + ' EST' : null;
                      return (
                        <button
                          key={hour}
                          onClick={() => setSelectedTime(hour)}
                          className={`p-3 border-2 rounded-lg transition-all text-sm font-light ${
                            selectedTime === hour
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="font-mono text-[11px] font-medium">{displayTime}</div>
                          {subLabel && (
                            <div className={`text-[9px] mt-0.5 font-mono ${selectedTime === hour ? 'text-stone-400' : 'text-stone-400'}`}>
                              {subLabel}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                {selectedDate && selectedTime ? (
                  <div className="space-y-2">
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium">
                      Selected Time
                    </p>
                    <p className="text-lg text-stone-900 font-serif">
                      {availableDates.find(d => d.date === selectedDate)?.display} at {selectedTime} EST
                    </p>
                    {!isEastern && (
                      <p className="text-sm text-ink-faint font-light">
                        That's {estToLocal(selectedDate, selectedTime)} {userTzAbbr} for you
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-ink-faint text-sm font-light">Select a date and time to continue</p>
                )}
              </div>

              <button
                onClick={() => setStep('details')}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-stone-900 text-white py-4 rounded-lg font-mono text-[11px] tracking-widest font-bold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Details Form */}
          {step === 'details' && (
            <div className="space-y-8">
              <div className="space-y-5">
                <div>
                  <label className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium block mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg font-light focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                  />
                </div>

                <div>
                  <label className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium block mb-3">
                    Dog's Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={dogNameInput}
                    onChange={(e) => setDogNameInput(e.target.value)}
                    placeholder="e.g., Max"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg font-light focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    id="bring-dog"
                    checked={bringDog}
                    onChange={(e) => setBringDog(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor="bring-dog" className="flex-1 cursor-pointer">
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium">
                      Will your dog be joining us?
                    </p>
                    <p className="text-sm text-ink-muted font-light mt-1">
                      We love meeting your dog! They're part of this too.
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-stone-100 border border-stone-200 rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icons.CheckCircle size={16} className="text-ink-soft flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium">
                      What You Get
                    </p>
                    <ul className="text-sm text-ink-soft space-y-1 font-light">
                      <li>• Expert practitioner review of {dogNameInput || 'your dog'}'s full biological profile</li>
                      <li>• Personalized protocol adjustments beyond the self-guided roadmap</li>
                      <li>• 1-hour deep-dive session via Zoom</li>
                      <li>• Valid for 90 days from date of purchase</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('slots')}
                  className="flex-1 border-2 border-stone-300 text-ink-soft py-4 rounded-lg font-mono text-[11px] tracking-widest font-bold hover:bg-stone-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!email || isSubmitting}
                  className="flex-1 bg-stone-900 text-white py-4 rounded-lg font-mono text-[11px] tracking-widest font-bold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Booking...' : 'Book Consultation'}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-8">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 space-y-6 text-center">
                <div>
                  <h4 className="text-2xl font-serif text-stone-900 mb-2">We are so excited to meet {dogNameInput || dogName || 'your dog'}!</h4>
                  <p className="text-ink-muted font-light">A confirmation receipt has been sent to {email}</p>
                </div>

                <div className="border-t border-stone-200 pt-6 space-y-4">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-muted font-medium mb-2">
                      Session Type
                    </p>
                    <p className="text-lg text-stone-900 font-serif">
                      Practitioner Deep-Dive Consultation
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-muted font-medium mb-2">
                      Valid For
                    </p>
                    <p className="text-ink-soft font-light">90 days from today</p>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg p-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-ink-soft font-medium mb-3">
                    To Schedule
                  </p>
                  <p className="text-sm text-ink-soft font-light text-left leading-relaxed">
                    Reply to your confirmation email or write to <strong>payalabs01@gmail.com</strong> with 3 preferred dates and times. Cassie will personally get back to you to lock in your session.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-stone-900 text-white py-4 rounded-lg font-mono text-[11px] tracking-widest font-bold hover:bg-stone-800 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
