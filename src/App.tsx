import React, { useState } from 'react';
import {
  Instagram,
  Mail,
  Send,
  Copy,
  Check,
  ArrowUpRight,
  Clapperboard,
  Sparkles,
  Music,
  Sliders,
  Eye,
  TrendingUp,
  Lock,
  Unlock,
  Edit3,
  X,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import officialLogo from './assets/images/velune_official_logo_1790754979829.jpg';
import natureBg from './assets/images/velune_reel_nature_1790753989633.jpg';

const INSTAGRAM_URL = 'https://www.instagram.com/velune_visuals_?stkn=NXZycXA1YjFqd3hm';
const CONTACT_EMAIL = 'velune.visuals92@gmail.com';

const INQUIRY_TYPES = [
  'Reel & Video Editing',
  'Brand Collaboration & Promo',
  'Music / Audio Sync & Pacing',
  'Atmospheric Color Grading',
  'Custom Aesthetic Edit',
  'General Inquiries',
];

interface CreatorStats {
  monthlyViews: string;
  followers: string;
}

const DEFAULT_STATS: CreatorStats = {
  monthlyViews: '708.0K',
  followers: '1,353',
};

const DEFAULT_PIN = '7080';

export default function App() {
  // Public inquiries form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Reel & Video Editing',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editable stats state (saved to localStorage so changes persist)
  const [stats, setStats] = useState<CreatorStats>(() => {
    try {
      const saved = localStorage.getItem('velune_creator_stats');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  // Owner authentication state
  const [isOwnerAuth, setIsOwnerAuth] = useState(() => {
    return sessionStorage.getItem('velune_owner_session') === 'true';
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Temp form inside editor modal
  const [tempStats, setTempStats] = useState<CreatorStats>(stats);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleMailtoLaunch = () => {
    const subject = encodeURIComponent(
      `[Velune Visuals] ${formData.inquiryType || 'Inquiry'} from ${formData.name || 'Client'}`
    );
    const body = encodeURIComponent(
      `Hi Velune Visuals,\n\nName: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.inquiryType}\n\nProject details:\n${formData.message}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: 'Reel & Video Editing',
      message: '',
    });
    setIsSubmitted(false);
    setErrorMsg('');
  };

  // Owner Authentication logic
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    const savedPin = localStorage.getItem('velune_owner_pin') || DEFAULT_PIN;
    if (enteredPin.trim() === savedPin) {
      sessionStorage.setItem('velune_owner_session', 'true');
      setIsOwnerAuth(true);
      setIsPinModalOpen(false);
      setEnteredPin('');
      setTempStats(stats);
      setIsEditorModalOpen(true);
      showToast('Owner access granted.');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempStats.monthlyViews.trim() || !tempStats.followers.trim()) {
      return;
    }

    setStats(tempStats);
    try {
      localStorage.setItem('velune_creator_stats', JSON.stringify(tempStats));
    } catch {
      // ignore
    }

    setIsEditorModalOpen(false);
    showToast('Stats updated and saved!');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      return;
    }
    try {
      localStorage.setItem('velune_owner_pin', newPin.trim());
      setPinChangeSuccess(true);
      setNewPin('');
      setTimeout(() => setPinChangeSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleLockOwnerMode = () => {
    sessionStorage.removeItem('velune_owner_session');
    setIsOwnerAuth(false);
    setIsEditorModalOpen(false);
    showToast('Owner mode locked.');
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#eceff4] font-body flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-neutral-900 border border-amber-500/40 rounded-xl text-xs text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <header className="border-b border-white/[0.08] backdrop-blur-md sticky top-0 z-40 bg-[#07080c]/90">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Zone 1: Single text wordmark with official PFP */}
          <a
            href="/"
            className="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight text-white hover:text-amber-200 transition-colors flex items-center gap-2 sm:gap-2.5 min-w-0 shrink"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-amber-500/40 p-[1.5px] bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-600 shrink-0">
              <img
                src={officialLogo}
                alt="Velune Visuals Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="truncate">Velune Visuals</span>
          </a>

          {/* Zone 2: Navigation Links (hidden on mobile to prevent crowding, visible on tablet/laptop) */}
          <nav className="hidden sm:flex items-center gap-4 sm:gap-5 text-xs sm:text-sm font-medium text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </nav>

          {/* Zone 3: Primary Action & Owner indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerAuth ? (
              <button
                type="button"
                onClick={() => {
                  setTempStats(stats);
                  setIsEditorModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                title="Edit views and followers"
              >
                <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Edit Stats</span>
              </button>
            ) : null}

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              title="Instagram Profile"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">@velune_visuals_</span>
            </a>
            <a
              href="#contact"
              className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-white rounded-lg transition-all whitespace-nowrap shadow-sm shrink-0"
            >
              Reach Out
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 md:py-12 space-y-6 sm:space-y-10 overflow-x-hidden">
        {/* Profile & Creative Identity Card */}
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-4 sm:p-6 md:p-8">
          {/* Dreamy Nature Backdrop */}
          <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
            <img
              src={natureBg}
              alt="Velune Visuals Aesthetic Atmosphere"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/85 to-transparent" />
          </div>

          <div className="relative z-10">
            {/* Top Creator Metadata line */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400 mb-4 sm:mb-5 font-medium flex-wrap">
              <span className="text-amber-300">Reel Creator & Video Editor</span>
              <span className="text-neutral-600">·</span>
              <span>Cinematic Moments</span>
              <span className="text-neutral-600 hidden sm:inline">·</span>
              <span className="hidden sm:inline">Atmospheric Nature & Vibes</span>
            </div>

            {/* Profile Header Row */}
            <div className="flex items-center gap-3.5 sm:gap-5 mb-5 sm:mb-6">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-lg">
                  <img
                    src={officialLogo}
                    alt="Velune Visuals Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover bg-neutral-950"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight truncate">
                    Velune Visuals
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      if (isOwnerAuth) {
                        setTempStats(stats);
                        setIsEditorModalOpen(true);
                      } else {
                        setIsPinModalOpen(true);
                      }
                    }}
                    className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-neutral-800 border border-white/20 text-neutral-300 text-[9px] sm:text-[10px] hover:border-amber-400/60 transition-colors cursor-pointer shrink-0"
                    title={isOwnerAuth ? 'Click to edit stats' : 'Verified Creator'}
                  >
                    ✓
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 truncate">
                  @velune_visuals_ · Reel creator curating visual stories
                </p>

                {/* Dynamic Stats Row (Editable ONLY by Owner) */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-neutral-300 font-medium">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {stats.monthlyViews}
                    </span>
                    <span className="text-neutral-400 text-[11px]">Views</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 shrink-0">
                    <Eye className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-white tabular-nums">
                      {stats.followers}
                    </span>
                    <span className="text-neutral-400 text-[11px]">Followers</span>
                  </div>

                  {/* Owner Controls Trigger */}
                  {isOwnerAuth ? (
                    <button
                      type="button"
                      onClick={() => {
                        setTempStats(stats);
                        setIsEditorModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-white px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-colors cursor-pointer shrink-0"
                      title="Update stats"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPinModalOpen(true)}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity p-1 text-neutral-600 hover:text-neutral-400 cursor-pointer shrink-0"
                      title="Owner Login to edit stats"
                      aria-label="Owner login to edit stats"
                    >
                      <Lock className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Prose */}
            <div id="about" className="max-w-2xl text-sm sm:text-base text-neutral-300 space-y-2 leading-relaxed mb-8">
              <p>
                I take visual footage from across the web and craft them into captivating, dreamy reels — combining serene nature, cinematic pacing, immersive music, and atmospheric color tones.
              </p>
              <p className="text-xs sm:text-sm text-neutral-400">
                Whether you need aesthetic video edits for your own profile, sound promotions, reel pacing & syncing, or creative visual collaborations — let’s connect.
              </p>
            </div>

            {/* Primary Instagram Direct CTA */}
            <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <span>Follow & Watch Reels on Instagram</span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Watch latest edits: nature, atmosphere, and moody vibes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-90 rounded-lg transition-opacity whitespace-nowrap shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Open Instagram Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What I Offer & Edit */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-white/[0.08] bg-neutral-900/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 mb-3">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white">Reel & Video Editing</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Curating, trimming, and transforming video clips into high-engagement, aesthetic vertical shorts.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-neutral-900/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-rose-300 mb-3">
              <Music className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white">Audio Sync & Pacing</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Precision audio syncing, rhythm-matched cuts, and soundscape selection that creates emotional resonance.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-neutral-900/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 mb-3">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white">Atmospheric Grading</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Crafting dreamy tones, cinematic sunset warmth, film grain, and cohesive visual aesthetics.
            </p>
          </div>
        </section>

        {/* Contact & Reach Out Section */}
        <section id="contact" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Direct Contact Sidebar */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
                  Get in Touch
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Have an edit in mind, want to collaborate on a sound or brand campaign, or have a question? Leave a message or reach out directly.
                </p>
              </div>

              {/* Instagram Direct */}
              <div className="p-5 rounded-xl border border-white/[0.08] bg-neutral-900/40 space-y-3">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-rose-400" />
                  <span>Instagram DM</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-white">
                    @velune_visuals_
                  </div>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <span>Message</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Direct Email */}
              <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-neutral-900/40 space-y-3">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Direct Email</span>
                </div>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-white truncate font-mono min-w-0 flex-1">
                    {CONTACT_EMAIL}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="shrink-0 p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Note about collaborations */}
              <div className="p-4 rounded-xl border border-white/5 bg-black/30 text-xs text-neutral-400 space-y-1.5">
                <div className="text-white font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open for Opportunities</span>
                </div>
                <p>
                  Accepting requests for video curation, aesthetic short-form editing, audio promotions, and creator shoutouts.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
                {isSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                      Message Received!
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{formData.name}</strong>. Your message for <strong className="text-amber-200">{formData.inquiryType}</strong> is ready. You can also open your mail app to send directly or ping on Instagram.
                    </p>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left text-xs space-y-1.5 max-w-md mx-auto text-neutral-300 font-mono">
                      <div>
                        <span className="text-neutral-500">From:</span> {formData.name} ({formData.email})
                      </div>
                      <div>
                        <span className="text-neutral-500">Topic:</span> {formData.inquiryType}
                      </div>
                      <div className="pt-2 text-neutral-400 border-t border-white/5 line-clamp-3">
                        {formData.message}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleMailtoLaunch}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send via Mail App</span>
                      </button>

                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Instagram className="w-3.5 h-3.5 text-rose-400" />
                        <span>DM on Instagram</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        New Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white">
                        Send a Message
                      </h3>
                      <span className="text-[11px] text-neutral-400">
                        * Required fields
                      </span>
                    </div>

                    {errorMsg && (
                      <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-neutral-300"
                        >
                          Your Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="e.g. Liam Parker"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-black/40 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="block text-xs font-medium text-neutral-300"
                        >
                          Email Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder="liam@example.com"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-black/40 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="inquiryType"
                        className="block text-xs font-medium text-neutral-300"
                      >
                        Inquiry Topic
                      </label>
                      <select
                        id="inquiryType"
                        value={formData.inquiryType}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, inquiryType: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#111219] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300 transition-colors cursor-pointer"
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-[#111219] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="message"
                          className="block text-xs font-medium text-neutral-300"
                        >
                          Message Details <span className="text-rose-400">*</span>
                        </label>
                        <span className="text-[11px] text-neutral-500 tabular-nums">
                          {formData.message.length}/1000
                        </span>
                      </div>
                      <textarea
                        id="message"
                        required
                        maxLength={1000}
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                        placeholder="Tell me about the edit you need, song/sound you want to use, footage style, deadline, or collaboration details..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-black/40 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300 transition-colors resize-y min-h-[110px]"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Instagram className="w-3.5 h-3.5 text-rose-400" />
                        <span>Prefer Instagram DM? Click here</span>
                      </a>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-white disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Preparing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-neutral-400 text-xs">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Velune Visuals</span>
            <span>·</span>
            <span>Reel Creator & Video Editor</span>
            <span>·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@velune_visuals_</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>

            {/* Owner Access Trigger in Footer */}
            {isOwnerAuth ? (
              <button
                type="button"
                onClick={() => {
                  setTempStats(stats);
                  setIsEditorModalOpen(true);
                }}
                className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Mode</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPinModalOpen(true)}
                className="text-neutral-700 hover:text-neutral-400 transition-colors p-1 cursor-pointer"
                title="Creator Security"
                aria-label="Creator Security"
              >
                <Lock className="w-2.5 h-2.5 opacity-30 hover:opacity-100" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* --- OWNER PIN AUTHENTICATION MODAL --- */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-sm rounded-2xl border border-white/10 bg-[#101218] p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Owner Verification</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setEnteredPin('');
                  setPinError('');
                }}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your private security PIN to access the creator controls.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              {pinError && (
                <div className="p-2.5 text-xs text-rose-300 bg-rose-950/50 border border-rose-800/50 rounded-lg">
                  {pinError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-300">
                  Creator PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  maxLength={10}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-3.5 py-2 text-sm bg-black/50 border border-white/15 rounded-lg text-white tracking-widest text-center focus:outline-none focus:ring-1 focus:ring-amber-300 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setEnteredPin('');
                    setPinError('');
                  }}
                  className="w-1/2 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Unlock Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- OWNER STATS EDITOR MODAL --- */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded-2xl border border-white/10 bg-[#101218] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Edit Views & Followers</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Preview Pill */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                Live Preview On Website
              </span>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{tempStats.monthlyViews || '0'}</span>
                  <span className="text-neutral-400 font-normal">Monthly Views</span>
                </div>
                <span className="text-neutral-600">/</span>
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{tempStats.followers || '0'}</span>
                  <span className="text-neutral-400 font-normal">Followers</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveStats} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Monthly Views Display
                </label>
                <input
                  type="text"
                  required
                  value={tempStats.monthlyViews}
                  onChange={(e) =>
                    setTempStats((prev) => ({ ...prev, monthlyViews: e.target.value }))
                  }
                  placeholder="e.g. 708.0K or 1.2M+"
                  className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-300 font-mono"
                />
                <span className="text-[11px] text-neutral-500">
                  Format as you wish: e.g. 708.0K, 750K+, 1.2M+
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Follower Count Display
                </label>
                <input
                  type="text"
                  required
                  value={tempStats.followers}
                  onChange={(e) =>
                    setTempStats((prev) => ({ ...prev, followers: e.target.value }))
                  }
                  placeholder="e.g. 1,353 or 2.5K+"
                  className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-300 font-mono"
                />
                <span className="text-[11px] text-neutral-500">
                  Format as you wish: e.g. 1,353, 1.4K+, 5,000
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="w-1/2 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Save & Publish
                </button>
              </div>
            </form>

            {/* Change PIN toggle */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowPinChange(!showPinChange)}
                  className="text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>{showPinChange ? 'Hide PIN Settings' : 'Change Creator PIN'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLockOwnerMode}
                  className="text-neutral-500 hover:text-rose-400 transition-colors text-[11px] cursor-pointer"
                >
                  Lock & Exit
                </button>
              </div>

              {showPinChange && (
                <form onSubmit={handleSaveNewPin} className="mt-3 space-y-2 p-3 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-[11px] text-neutral-400">
                    Set a new 4-digit PIN for editing:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={10}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="New PIN (min 4 digits)"
                      className="flex-1 px-3 py-1.5 text-xs bg-black border border-white/15 rounded-lg text-white font-mono"
                    />
                    <button
                      type="submit"
                      disabled={newPin.length < 4}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                    >
                      Update PIN
                    </button>
                  </div>
                  {pinChangeSuccess && (
                    <div className="text-[11px] text-emerald-400">
                      PIN updated successfully!
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
