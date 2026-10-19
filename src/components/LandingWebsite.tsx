import React, { useState } from 'react';
import {
  Flame,
  Compass,
  MapPin,
  Users,
  Shield,
  Sparkles,
  MessageSquare,
  Check,
  ArrowRight,
  Smartphone,
  Clock,
  Star,
  Send,
  X,
  UserCheck,
  UserX,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';
import type { CrewPlan } from '../types';

interface LandingWebsiteProps {
  onLaunchApp: (initialTab?: string) => void;
  isLoggedIn: boolean;
  userName?: string;
  livePlans?: CrewPlan[];
}

interface PreviewVenue {
  id: string;
  name: string;
  city: string;
  area: string;
  type: string;
  rating: number;
  closingTime: string;
  deal: string;
  vibes: string[];
  image: string;
  coords: { top: string; left: string };
  activeCrews: number;
}

const PREVIEW_VENUES: PreviewVenue[] = [
  {
    id: 'v1',
    name: 'Heebie Jeebies',
    city: 'Liverpool',
    area: 'Concert Square',
    type: 'Indie Bar & Courtyard',
    rating: 4.6,
    closingTime: '03:00 AM',
    deal: '£3.50 Doubles before 11pm',
    vibes: ['Party 🎉', 'Indie / Alt 🎸', 'Courtyard 🍻'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    coords: { top: '52%', left: '44%' },
    activeCrews: 4
  },
  {
    id: 'v2',
    name: 'The Raz (Blue Angel)',
    city: 'Liverpool',
    area: 'City Centre',
    type: 'Legendary Student Club',
    rating: 4.8,
    closingTime: '04:00 AM',
    deal: '£2 Entry + Raz Bombs',
    vibes: ['Clubbing 💃', 'Cheap Drinks 💸', 'Cheesy Hits 🎵'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60',
    coords: { top: '64%', left: '56%' },
    activeCrews: 6
  },
  {
    id: 'v3',
    name: 'The Brookhouse',
    city: 'Liverpool',
    area: 'Smithdown Road',
    type: 'Student Pub & Crawl Hub',
    rating: 4.7,
    closingTime: '12:00 AM',
    deal: '£2.80 Student Pints Tonight',
    vibes: ['Pub Crawl 🍺', 'Pool & Sports 🎱', 'Pub Quiz 🧠'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60',
    coords: { top: '34%', left: '72%' },
    activeCrews: 5
  },
  {
    id: 'v4',
    name: 'Baa Bar Fleet Street',
    city: 'Liverpool',
    area: 'Concert Square',
    type: 'Pre-Drinks & Shooters Bar',
    rating: 4.5,
    closingTime: '03:00 AM',
    deal: '2-for-1 Shooters w/ Student ID',
    vibes: ['Pre-Drinks 🥃', 'House & Dance 🔊', 'Party 🎉'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
    coords: { top: '42%', left: '32%' },
    activeCrews: 3
  }
];

const SHOWCASE_PLANS: CrewPlan[] = [
  {
    id: 'demo-1',
    title: 'Raz Hip Hop & RnB Night 🔥',
    category: 'Dancing',
    host: 'Alex Mercer',
    city: 'Liverpool',
    location: 'The Raz (Blue Angel), City Centre',
    time: 'Tonight • 21:30',
    attendeesCount: 5,
    maxPeople: 10,
    joined: false,
    genderPreference: 'Any',
    matchingType: 'Auto-join',
    description: 'Pre-drinks at Concert Square at 9:30pm then heading straight to The Raz before the queue gets long!',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    vibes: ['Dancing 💃', 'Cheap Drinks 💸', 'Hip Hop 🎤']
  },
  {
    id: 'demo-2',
    title: 'Heebies Courtyard & Cocktails 🍹',
    category: 'Party',
    host: 'Chloe Jones',
    city: 'Liverpool',
    location: 'Heebie Jeebies, Concert Square',
    time: 'Tonight • 22:00',
    attendeesCount: 4,
    maxPeople: 6,
    joined: false,
    genderPreference: 'Girls Only',
    matchingType: 'Request to join',
    description: 'Starting in the heated courtyard at Heebies for doubles, then heading to the basement floor around 11!',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
    vibes: ['Cocktails 🍹', 'Girls Night 💖', 'Indie 🎸']
  },
  {
    id: 'demo-3',
    title: 'Smithdown 10-Pub Challenge 🍺',
    category: 'Bar Hopping',
    host: 'Ben & Luke',
    city: 'Liverpool',
    location: 'The Brookhouse, Smithdown Road',
    time: 'Tonight • 19:30',
    attendeesCount: 9,
    maxPeople: 16,
    joined: true,
    genderPreference: 'Any',
    matchingType: 'Auto-join',
    description: 'Kicking off at The Brookhouse and working our way down Smithdown Road to Handyman and Kellys!',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60',
    vibes: ['Pub Crawl 🍺', 'Student Pints 🍻', 'Chatting 💬']
  },
  {
    id: 'demo-4',
    title: 'Northern Quarter Basement House 🔊',
    category: 'Club',
    host: 'Liam Vance',
    city: 'Manchester',
    location: 'Soup Kitchen, Northern Quarter',
    time: 'Tonight • 22:30',
    attendeesCount: 6,
    maxPeople: 8,
    joined: false,
    genderPreference: 'Any',
    matchingType: 'Auto-join',
    description: 'Underground house and UKG set tonight in NQ. Meeting at Stevenson Square for a quick drink first.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60',
    vibes: ['Techno / Rave 🔊', 'House Music 🎧']
  },
  {
    id: 'demo-5',
    title: 'Soho Student Jazz & Late Bars 🎷',
    category: 'Dinner & Drinks',
    host: 'Sarah Jenkins',
    city: 'London',
    location: 'Soho Square, Soho',
    time: 'Tonight • 20:30',
    attendeesCount: 4,
    maxPeople: 6,
    joined: false,
    genderPreference: 'Any',
    matchingType: 'Request to join',
    description: 'UCL & KCL postgrads grabbing happy hour cocktails and live music in Soho.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    vibes: ['Cocktails 🍹', 'Live Music 🎸']
  },
  {
    id: 'demo-6',
    title: 'Call Lane Student Bar Hop 🥂',
    category: 'Bar Hopping',
    host: 'Maya Patel',
    city: 'Leeds',
    location: 'Call Lane, City Centre',
    time: 'Tonight • 21:00',
    attendeesCount: 7,
    maxPeople: 12,
    joined: false,
    genderPreference: 'Any',
    matchingType: 'Auto-join',
    description: 'Hitting Belgrave roof terrace then heading down Call Lane for R&B and student drink deals.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    vibes: ['Bar Hopping 🍸', 'Dancing 💃']
  }
];

export const LandingWebsite: React.FC<LandingWebsiteProps> = ({
  onLaunchApp,
  isLoggedIn,
  userName,
  livePlans = []
}) => {
  // Interactive phone tab in Hero
  const [heroPhoneTab, setHeroPhoneTab] = useState<'feed' | 'map' | 'chat'>('feed');

  // Interactive Feature Showcase Tab
  const [showcaseTab, setShowcaseTab] = useState<'crews' | 'map' | 'venues' | 'mynight'>('crews');
  const [selectedCity, setSelectedCity] = useState<string>('All UK');
  const [joinedDemoIds, setJoinedDemoIds] = useState<string[]>(['demo-3']);
  const [requestedDemoIds, setRequestedDemoIds] = useState<string[]>([]);

  // Interactive Map Showcase state
  const [selectedMapVenueId, setSelectedMapVenueId] = useState<string>('v1');
  const [previewRadiusMiles, setPreviewRadiusMiles] = useState<number>(3);

  // Interactive My Night & Chat state
  const [demoRequests, setDemoRequests] = useState([
    { id: 'req-1', name: 'Hannah W.', uni: 'University of Liverpool • 2nd Year', vibe: 'Cocktails 🍹', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60', status: 'pending' as 'pending' | 'approved' | 'declined' },
    { id: 'req-2', name: 'Marcus T.', uni: 'LJMU • Computer Science', vibe: 'Pub Crawl 🍺', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60', status: 'pending' as 'pending' | 'approved' | 'declined' }
  ]);
  const [demoChatMessages, setDemoChatMessages] = useState([
    { id: 'm1', sender: 'Alex Mercer (Host)', text: 'Yo everyone! Meeting outside Baa Bar in Concert Square at 9:30pm 🎉', time: '21:04', isMe: false },
    { id: 'm2', sender: 'Chloe Jones', text: 'Sweet, bringing two flatmates! Are we still doing The Raz after?', time: '21:06', isMe: false },
    { id: 'm3', sender: 'You', text: 'On my way now! Save me a table 🙌', time: '21:08', isMe: true }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Download / Waitlist Modal & Form State
  const [downloadModalPlatform, setDownloadModalPlatform] = useState<'iOS App Store' | 'Google Play' | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  // Combine Firestore live plans with rich showcase fallback plans
  const combinedPlans = livePlans.length >= 3 ? livePlans.slice(0, 6) : SHOWCASE_PLANS;
  const filteredShowcasePlans = selectedCity === 'All UK'
    ? combinedPlans
    : combinedPlans.filter(p =>
        (p.city && p.city.toLowerCase() === selectedCity.toLowerCase()) ||
        p.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (selectedCity === 'Liverpool' && (p.location.includes('Raz') || p.location.includes('Heebie') || p.location.includes('Smithdown')))
      );

  const selectedMapVenue = PREVIEW_VENUES.find(v => v.id === selectedMapVenueId) || PREVIEW_VENUES[0];

  const handleToggleDemoPlan = (plan: CrewPlan) => {
    if (plan.matchingType === 'Request to join') {
      setRequestedDemoIds(prev =>
        prev.includes(plan.id) ? prev.filter(id => id !== plan.id) : [...prev, plan.id]
      );
    } else {
      setJoinedDemoIds(prev =>
        prev.includes(plan.id) ? prev.filter(id => id !== plan.id) : [...prev, plan.id]
      );
    }
  };

  const handleSendDemoChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setDemoChatMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'You',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
    ]);
    setChatInput('');
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError(null);
    const cleaned = waitlistEmail.trim().toLowerCase();
    if (!cleaned.includes('@') || (!cleaned.endsWith('.ac.uk') && !cleaned.endsWith('.edu'))) {
      setWaitlistError('Please enter a valid university email ending in .ac.uk or .edu');
      return;
    }
    setWaitlistSubmitted(true);
    setWaitlistEmail('');
  };

  return (
    <div className="ut-website">
      {/* Ambient Background Glows */}
      <div className="ut-bg-glow ut-glow-1" />
      <div className="ut-bg-glow ut-glow-2" />
      <div className="ut-bg-glow ut-glow-3" />

      {/* Top Sticky Navbar */}
      <header className="ut-navbar">
        <div className="ut-nav-inner">
          <a href="#top" className="ut-brand">
            <div className="ut-brand-icon">
              <Flame size={22} />
            </div>
            <span className="ut-brand-name">UniTonight</span>
            <span className="ut-brand-tag">.ac.uk</span>
          </a>

          <nav className="ut-nav-links">
            <a href="#preview">Interactive Preview</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#download">Download App</a>
          </nav>

          <div className="ut-nav-actions">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => onLaunchApp('feed')}
                className="ut-btn ut-btn-primary"
              >
                <span>Open App ({userName || 'Student'})</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onLaunchApp('feed')}
                  className="ut-btn ut-btn-ghost"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchApp('feed')}
                  className="ut-btn ut-btn-primary"
                >
                  <span>Launch Web App</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="top" className="ut-hero">
        <div className="ut-container ut-hero-grid">
          <div className="ut-hero-copy">
            <div className="ut-pill-badge">
              <Sparkles size={14} className="ut-badge-icon" />
              <span>Exclusively for Verified <strong>.ac.uk</strong> &amp; <strong>.edu</strong> Students</span>
            </div>

            <h1 className="ut-hero-title">
              Never Go Out Alone.{' '}
              <span className="ut-gradient-text">Find Your Uni Crew Tonight.</span>
            </h1>

            <p className="ut-hero-subtitle">
              UniTonight connects university students in real time for pre-drinks, pub crawls, club nights, and live gigs. See what’s happening on your campus tonight and jump right in.
            </p>

            {/* App Store / Google Play + Web App Launch Buttons */}
            <div className="ut-store-row">
              <button
                type="button"
                onClick={() => {
                  setDownloadModalPlatform('iOS App Store');
                  setWaitlistSubmitted(false);
                  setWaitlistError(null);
                }}
                className="ut-store-btn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3z" />
                </svg>
                <div className="ut-store-btn-text">
                  <span className="ut-store-small">Download on the</span>
                  <span className="ut-store-big">App Store</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDownloadModalPlatform('Google Play');
                  setWaitlistSubmitted(false);
                  setWaitlistError(null);
                }}
                className="ut-store-btn"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="ut-store-btn-text">
                  <span className="ut-store-small">GET IT ON</span>
                  <span className="ut-store-big">Google Play</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onLaunchApp('feed')}
                className="ut-web-launch-btn"
              >
                <Globe size={19} />
                <div className="ut-store-btn-text">
                  <span className="ut-store-small">INSTANT ACCESS</span>
                  <span className="ut-store-big">Launch Web App →</span>
                </div>
              </button>
            </div>

            {/* Trust / Social Proof Metrics */}
            <div className="ut-hero-metrics">
              <div className="ut-metric-item">
                <span className="ut-metric-val">100%</span>
                <span className="ut-metric-label">Verified Student Emails</span>
              </div>
              <div className="ut-metric-divider" />
              <div className="ut-metric-item">
                <span className="ut-metric-val">5+ Cities</span>
                <span className="ut-metric-label">Liverpool, Mcr, London, Leeds, Ncl</span>
              </div>
              <div className="ut-metric-divider" />
              <div className="ut-metric-item">
                <span className="ut-metric-val">Live</span>
                <span className="ut-metric-label">Real-Time Crew Chat &amp; Map</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="ut-hero-phone-wrap">
            <div className="ut-phone-floating-badge ut-float-left">
              <span className="ut-live-dot" />
              <div>
                <strong>14 Crews Active Tonight</strong>
                <span>Concert Square &amp; Smithdown</span>
              </div>
            </div>

            <div className="ut-phone-floating-badge ut-float-right">
              <Shield size={16} style={{ color: '#34d399' }} />
              <div>
                <strong>Verified .ac.uk Only</strong>
                <span>UoL • LJMU • UoM • Leeds</span>
              </div>
            </div>

            <div className="ut-phone-frame">
              <div className="ut-phone-notch" />
              <div className="ut-phone-screen">
                {/* Phone Header */}
                <div className="ut-phone-header">
                  <div>
                    <div className="ut-phone-city">Tonight in Liverpool 🎯</div>
                    <div className="ut-phone-sub">Join a crew or start one</div>
                  </div>
                  <span className="ut-phone-going-pill">✨ Going out</span>
                </div>

                {/* Phone Content based on selected mini-tab */}
                {heroPhoneTab === 'feed' && (
                  <div className="ut-phone-body">
                    <div className="ut-phone-pills">
                      <span className="active">📍 All areas</span>
                      <span>Concert Square</span>
                      <span>Smithdown</span>
                    </div>

                    <div className="ut-phone-card">
                      <div className="ut-phone-card-top">
                        <span className="ut-tag-dancing">Dancing</span>
                        <span className="ut-tag-auto">⚡ Auto-join</span>
                      </div>
                      <h4>Raz Hip Hop &amp; RnB Night</h4>
                      <p className="ut-phone-meta">📍 The Raz, City Centre • 21:30</p>
                      <div className="ut-phone-card-footer">
                        <span className="ut-phone-avatars">👥 5/10 joined</span>
                        <button
                          type="button"
                          onClick={() => onLaunchApp('feed')}
                          className="ut-phone-join-btn"
                        >
                          Join Crew
                        </button>
                      </div>
                    </div>

                    <div className="ut-phone-card">
                      <div className="ut-phone-card-top">
                        <span className="ut-tag-party">Party</span>
                        <span className="ut-tag-girls">💖 Girls Only</span>
                      </div>
                      <h4>Heebies Courtyard Doubles</h4>
                      <p className="ut-phone-meta">📍 Heebie Jeebies • 22:00</p>
                      <div className="ut-phone-card-footer">
                        <span className="ut-phone-avatars">👥 4/6 joined</span>
                        <button
                          type="button"
                          onClick={() => onLaunchApp('feed')}
                          className="ut-phone-join-btn secondary"
                        >
                          Request
                        </button>
                      </div>
                    </div>

                    <div className="ut-phone-card">
                      <div className="ut-phone-card-top">
                        <span className="ut-tag-bar">Bar Hopping</span>
                        <span className="ut-tag-auto">⚡ Auto-join</span>
                      </div>
                      <h4>Smithdown Pub Crawl 🍺</h4>
                      <p className="ut-phone-meta">📍 The Brookhouse • 19:30</p>
                      <div className="ut-phone-card-footer">
                        <span className="ut-phone-avatars">👥 9/16 joined</span>
                        <button
                          type="button"
                          onClick={() => onLaunchApp('feed')}
                          className="ut-phone-join-btn joined"
                        >
                          ✓ Joined
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {heroPhoneTab === 'map' && (
                  <div className="ut-phone-body ut-phone-map-view">
                    <div className="ut-mini-map-canvas">
                      <div className="ut-mini-radar" />
                      <div className="ut-mini-pin" style={{ top: '32%', left: '38%' }}>
                        <span>🍹 Heebies (4)</span>
                      </div>
                      <div className="ut-mini-pin active" style={{ top: '55%', left: '54%' }}>
                        <span>💃 The Raz (6)</span>
                      </div>
                      <div className="ut-mini-pin" style={{ top: '72%', left: '30%' }}>
                        <span>🍺 Brookhouse (9)</span>
                      </div>
                    </div>
                    <div className="ut-phone-card" style={{ marginTop: '0.6rem' }}>
                      <h4>📍 3 Crews within 1.5 miles</h4>
                      <p className="ut-phone-meta">Tap any live hotspot to join students nearby</p>
                      <button
                        type="button"
                        onClick={() => onLaunchApp('map')}
                        className="ut-phone-join-btn"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      >
                        Open Full Live Map →
                      </button>
                    </div>
                  </div>
                )}

                {heroPhoneTab === 'chat' && (
                  <div className="ut-phone-body">
                    <div className="ut-mini-chat-box">
                      <div className="ut-mini-chat-title">💬 Raz Hip Hop Night (5 members)</div>
                      <div className="ut-mini-bubble">
                        <strong>Alex:</strong> Pre-drinks at Concert Square at 9:30!
                      </div>
                      <div className="ut-mini-bubble">
                        <strong>Chloe:</strong> Grabbing a table outside Baa Bar 🍻
                      </div>
                      <div className="ut-mini-bubble me">
                        <strong>You:</strong> Be there in 10 mins! 🙌
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLaunchApp('mynight')}
                      className="ut-phone-join-btn"
                      style={{ width: '100%', marginTop: '0.75rem' }}
                    >
                      Open My Night &amp; Chats →
                    </button>
                  </div>
                )}

                {/* Interactive Phone Bottom Nav */}
                <div className="ut-phone-bottom-nav">
                  <button
                    type="button"
                    className={heroPhoneTab === 'feed' ? 'active' : ''}
                    onClick={() => setHeroPhoneTab('feed')}
                  >
                    <Flame size={16} />
                    <span>Crews</span>
                  </button>
                  <button
                    type="button"
                    className={heroPhoneTab === 'map' ? 'active' : ''}
                    onClick={() => setHeroPhoneTab('map')}
                  >
                    <MapPin size={16} />
                    <span>Live Map</span>
                  </button>
                  <button
                    type="button"
                    className={heroPhoneTab === 'chat' ? 'active' : ''}
                    onClick={() => setHeroPhoneTab('chat')}
                  >
                    <MessageSquare size={16} />
                    <span>My Night</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE APP PREVIEW & FEATURE SHOWCASE SECTION */}
      <section id="preview" className="ut-section">
        <div className="ut-container">
          <div className="ut-section-header">
            <span className="ut-eyebrow">INTERACTIVE APP PREVIEW</span>
            <h2 className="ut-section-title">Test-Drive UniTonight Right Here</h2>
            <p className="ut-section-desc">
              Explore how students find crews, check the live campus map, browse student venue deals, and coordinate in group chat.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="ut-showcase-tabs">
            <button
              type="button"
              onClick={() => setShowcaseTab('crews')}
              className={`ut-showcase-tab ${showcaseTab === 'crews' ? 'active' : ''}`}
            >
              <Flame size={18} />
              <span>Tonight’s Crews</span>
            </button>
            <button
              type="button"
              onClick={() => setShowcaseTab('map')}
              className={`ut-showcase-tab ${showcaseTab === 'map' ? 'active' : ''}`}
            >
              <MapPin size={18} />
              <span>Live Campus Map</span>
            </button>
            <button
              type="button"
              onClick={() => setShowcaseTab('venues')}
              className={`ut-showcase-tab ${showcaseTab === 'venues' ? 'active' : ''}`}
            >
              <Compass size={18} />
              <span>Student Venues</span>
            </button>
            <button
              type="button"
              onClick={() => setShowcaseTab('mynight')}
              className={`ut-showcase-tab ${showcaseTab === 'mynight' ? 'active' : ''}`}
            >
              <MessageSquare size={18} />
              <span>My Night &amp; Crew Chat</span>
            </button>
          </div>

          {/* Showcase Stage */}
          <div className="ut-showcase-stage">
            {/* TAB 1: CREWS FEED PREVIEW */}
            {showcaseTab === 'crews' && (
              <div className="ut-stage-content">
                <div className="ut-stage-toolbar">
                  <div className="ut-city-pills">
                    {['All UK', 'Liverpool', 'Manchester', 'London', 'Leeds'].map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSelectedCity(city)}
                        className={`ut-city-pill ${selectedCity === city ? 'active' : ''}`}
                      >
                        {city === 'All UK' ? '🇬🇧 All UK Campuses' : `📍 ${city}`}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchApp('create')}
                    className="ut-btn ut-btn-outline-sm"
                  >
                    + Host Your Own Crew
                  </button>
                </div>

                <div className="ut-preview-cards-grid">
                  {filteredShowcasePlans.map((plan) => {
                    const isJoined = joinedDemoIds.includes(plan.id) || plan.joined;
                    const isRequested = requestedDemoIds.includes(plan.id);
                    return (
                      <div key={plan.id} className="ut-crew-card">
                        <div
                          className="ut-crew-card-img"
                          style={{
                            backgroundImage: `linear-gradient(to top, rgba(9,9,11,0.95), rgba(9,9,11,0.2)), url(${plan.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60'})`
                          }}
                        >
                          <span className="ut-crew-cat-badge">{plan.category}</span>
                          {plan.genderPreference && plan.genderPreference !== 'Any' && (
                            <span className="ut-crew-gender-badge">{plan.genderPreference}</span>
                          )}
                          <div className="ut-crew-img-bottom">
                            <h3>{plan.title}</h3>
                            <span>Hosted by {plan.host}</span>
                          </div>
                        </div>

                        <div className="ut-crew-card-body">
                          <div className="ut-crew-info-row">
                            <span><MapPin size={14} /> {plan.location}</span>
                            <span><Clock size={14} /> {plan.time}</span>
                          </div>

                          <p className="ut-crew-desc">{plan.description}</p>

                          {plan.vibes && plan.vibes.length > 0 && (
                            <div className="ut-vibe-row">
                              {plan.vibes.map(v => (
                                <span key={v} className="ut-vibe-chip">{v}</span>
                              ))}
                            </div>
                          )}

                          <div className="ut-crew-card-footer">
                            <div>
                              <div className="ut-attendee-count">
                                <Users size={15} />
                                <span>
                                  {plan.attendeesCount + (joinedDemoIds.includes(plan.id) && !plan.joined ? 1 : 0)}
                                  /{plan.maxPeople || 10} students
                                </span>
                              </div>
                              <span className="ut-match-type">{plan.matchingType || 'Auto-join'}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleDemoPlan(plan)}
                              className={`ut-crew-action-btn ${isJoined ? 'joined' : isRequested ? 'requested' : ''}`}
                            >
                              {isJoined ? (
                                <>
                                  <Check size={15} />
                                  <span>Joined Crew</span>
                                </>
                              ) : isRequested ? (
                                <span>Request Sent ✓</span>
                              ) : plan.matchingType === 'Request to join' ? (
                                <span>Request to Join</span>
                              ) : (
                                <span>Join Crew</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: LIVE CAMPUS MAP PREVIEW */}
            {showcaseTab === 'map' && (
              <div className="ut-stage-content ut-map-showcase-grid">
                <div className="ut-map-interactive-canvas">
                  <div className="ut-map-grid-overlay" />
                  <div
                    className="ut-map-radius-circle"
                    style={{
                      width: `${Math.min(92, previewRadiusMiles * 22)}%`,
                      height: `${Math.min(92, previewRadiusMiles * 22)}%`
                    }}
                  />

                  <div className="ut-map-top-bar">
                    <span className="ut-map-status-pill">
                      <span className="ut-live-dot" /> Live Campus Radar — Liverpool
                    </span>
                    <div className="ut-map-radius-control">
                      <span>Radius: <strong>{previewRadiusMiles} mi</strong></span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={previewRadiusMiles}
                        onChange={(e) => setPreviewRadiusMiles(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {PREVIEW_VENUES.map((venue) => {
                    const isSelected = venue.id === selectedMapVenue.id;
                    return (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => setSelectedMapVenueId(venue.id)}
                        className={`ut-map-hotspot-pin ${isSelected ? 'selected' : ''}`}
                        style={{ top: venue.coords.top, left: venue.coords.left }}
                      >
                        <span className="ut-pin-pulse" />
                        <span className="ut-pin-label">
                          <strong>{venue.name}</strong>
                          <em>{venue.activeCrews} crews</em>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Map Venue / Crew Drawer */}
                <div className="ut-map-sidebar-card">
                  <div
                    className="ut-map-venue-banner"
                    style={{ backgroundImage: `url(${selectedMapVenue.image})` }}
                  >
                    <span className="ut-venue-open-badge">● Open Tonight • Until {selectedMapVenue.closingTime}</span>
                  </div>
                  <div className="ut-map-venue-details">
                    <div className="ut-venue-title-row">
                      <div>
                        <h3>{selectedMapVenue.name}</h3>
                        <p>{selectedMapVenue.area}, {selectedMapVenue.city} • {selectedMapVenue.type}</p>
                      </div>
                      <span className="ut-venue-rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" /> {selectedMapVenue.rating}
                      </span>
                    </div>

                    <div className="ut-venue-deal-box">
                      <span>🔥 Student Deal:</span>
                      <strong>{selectedMapVenue.deal}</strong>
                    </div>

                    <div className="ut-vibe-row">
                      {selectedMapVenue.vibes.map(v => (
                        <span key={v} className="ut-vibe-chip">{v}</span>
                      ))}
                    </div>

                    <div className="ut-venue-active-crews-box">
                      <Users size={16} />
                      <span><strong>{selectedMapVenue.activeCrews} active student crews</strong> heading here tonight</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onLaunchApp('map')}
                      className="ut-btn ut-btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Explore on Interactive Map</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPLORE VENUES PREVIEW */}
            {showcaseTab === 'venues' && (
              <div className="ut-stage-content">
                <div className="ut-venues-grid">
                  {PREVIEW_VENUES.map(venue => (
                    <div key={venue.id} className="ut-venue-card">
                      <div
                        className="ut-venue-card-img"
                        style={{ backgroundImage: `url(${venue.image})` }}
                      >
                        <span className="ut-venue-area-tag">{venue.area}</span>
                        <span className="ut-venue-rating-pill">★ {venue.rating}</span>
                      </div>
                      <div className="ut-venue-card-body">
                        <div className="ut-venue-card-head">
                          <h3>{venue.name}</h3>
                          <span className="ut-venue-type">{venue.type}</span>
                        </div>
                        <div className="ut-venue-deal-inline">
                          💸 {venue.deal}
                        </div>
                        <div className="ut-vibe-row">
                          {venue.vibes.map(v => (
                            <span key={v} className="ut-vibe-chip">{v}</span>
                          ))}
                        </div>
                        <div className="ut-venue-card-foot">
                          <span>🕒 Closes {venue.closingTime}</span>
                          <button
                            type="button"
                            onClick={() => onLaunchApp('explore')}
                            className="ut-link-btn"
                          >
                            View {venue.activeCrews} Crews <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MY NIGHT & GROUP CHAT PREVIEW */}
            {showcaseTab === 'mynight' && (
              <div className="ut-stage-content ut-mynight-showcase-grid">
                {/* Host Approval Queue Demo */}
                <div className="ut-mynight-panel">
                  <div className="ut-panel-header">
                    <Shield size={18} style={{ color: 'var(--primary)' }} />
                    <div>
                      <h3>Host Approval Queue</h3>
                      <p>You control who joins your crew before sharing the meetup spot.</p>
                    </div>
                  </div>

                  <div className="ut-requests-list">
                    {demoRequests.map(req => (
                      <div key={req.id} className="ut-request-item">
                        <img src={req.avatar} alt={req.name} className="ut-req-avatar" />
                        <div className="ut-req-info">
                          <strong>{req.name}</strong>
                          <span>{req.uni}</span>
                          <span className="ut-vibe-chip" style={{ width: 'fit-content', marginTop: '0.25rem' }}>
                            {req.vibe}
                          </span>
                        </div>
                        <div className="ut-req-actions">
                          {req.status === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setDemoRequests(prev =>
                                    prev.map(r => (r.id === req.id ? { ...r, status: 'approved' } : r))
                                  )
                                }
                                className="ut-req-btn approve"
                                title="Approve Student"
                              >
                                <UserCheck size={16} /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDemoRequests(prev =>
                                    prev.map(r => (r.id === req.id ? { ...r, status: 'declined' } : r))
                                  )
                                }
                                className="ut-req-btn decline"
                                title="Decline"
                              >
                                <UserX size={16} />
                              </button>
                            </>
                          ) : (
                            <span className={`ut-req-status ${req.status}`}>
                              {req.status === 'approved' ? '✓ Approved into Crew' : 'Declined'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Crew Group Chat Demo */}
                <div className="ut-mynight-panel ut-chat-panel">
                  <div className="ut-panel-header">
                    <MessageSquare size={18} style={{ color: '#34d399' }} />
                    <div>
                      <h3>Raz Hip Hop &amp; RnB Crew Chat</h3>
                      <p>Real-time group chat unlocked once you join a crew</p>
                    </div>
                  </div>

                  <div className="ut-chat-messages">
                    {demoChatMessages.map(msg => (
                      <div key={msg.id} className={`ut-chat-msg ${msg.isMe ? 'me' : ''}`}>
                        <div className="ut-chat-meta">
                          <strong>{msg.sender}</strong>
                          <span>{msg.time}</span>
                        </div>
                        <div className="ut-chat-text">{msg.text}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendDemoChat} className="ut-chat-input-bar">
                    <input
                      type="text"
                      placeholder="Try sending a message to the crew..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button type="submit" aria-label="Send message">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE FEATURES BENTO GRID */}
      <section id="features" className="ut-section ut-section-alt">
        <div className="ut-container">
          <div className="ut-section-header">
            <span className="ut-eyebrow">BUILT FOR UNI NIGHTLIFE</span>
            <h2 className="ut-section-title">Everything You Need for a Better Night Out</h2>
            <p className="ut-section-desc">
              Designed around real campus safety, spontaneous plans, and student budgets.
            </p>
          </div>

          <div className="ut-bento-grid">
            <div className="ut-bento-card">
              <div className="ut-bento-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34d399' }}>
                <Lock size={24} />
              </div>
              <h3>Verified .ac.uk &amp; .edu Students Only</h3>
              <p>
                Every account is verified with an official university email address. No randoms, no bots—just real students from your campus and neighboring unis.
              </p>
            </div>

            <div className="ut-bento-card">
              <div className="ut-bento-icon" style={{ background: 'rgba(168, 85, 247, 0.14)', color: '#c084fc' }}>
                <Users size={24} />
              </div>
              <h3>Auto-Join or Request-to-Join</h3>
              <p>
                Hosting a massive 20-person Smithdown pub crawl? Turn on <strong>Auto-Join</strong>. Organizing a smaller group or a <strong>Girls Only</strong> pre-drinks? Use <strong>Request-to-Join</strong> and review profiles first.
              </p>
            </div>

            <div className="ut-bento-card">
              <div className="ut-bento-icon" style={{ background: 'rgba(244, 114, 182, 0.14)', color: '#f472b6' }}>
                <MapPin size={24} />
              </div>
              <h3>Live Campus Nightlife Radar</h3>
              <p>
                Filter by student neighborhoods like Concert Square, Smithdown Road, Soho, Fallowfield, or Headingley and see where crews are heading right now.
              </p>
            </div>

            <div className="ut-bento-card">
              <div className="ut-bento-icon" style={{ background: 'rgba(96, 165, 250, 0.14)', color: '#60a5fa' }}>
                <MessageSquare size={24} />
              </div>
              <h3>Instant Crew Group Chats</h3>
              <p>
                As soon as you join a crew, you unlock its dedicated group chat to coordinate pre-drinks, share tables, and meet up smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="ut-section">
        <div className="ut-container">
          <div className="ut-section-header">
            <span className="ut-eyebrow">3 SIMPLE STEPS</span>
            <h2 className="ut-section-title">From Flat to Dancefloor in 60 Seconds</h2>
          </div>

          <div className="ut-steps-grid">
            <div className="ut-step-card">
              <span className="ut-step-num">01</span>
              <h3>Verify Your Uni Email</h3>
              <p>Sign up in seconds with your <code>.ac.uk</code> or <code>.edu</code> student email and pick your favourite music &amp; nightlife vibes.</p>
            </div>
            <div className="ut-step-card">
              <span className="ut-step-num">02</span>
              <h3>Browse Tonight’s Crews</h3>
              <p>See live plans in your city or drop your own pin for pre-drinks, a society social, a pub quiz, or a club night.</p>
            </div>
            <div className="ut-step-card">
              <span className="ut-step-num">03</span>
              <h3>Chat &amp; Link Up</h3>
              <p>Jump into the crew group chat, meet at the starting bar, and turn a quiet night into your best uni memory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD / WAITLIST & WEB APP CTA BANNER */}
      <section id="download" className="ut-section">
        <div className="ut-container">
          <div className="ut-cta-banner">
            <div className="ut-cta-content">
              <span className="ut-eyebrow">GET UNITONIGHT</span>
              <h2>Ready for Tonight?</h2>
              <p>
                Download the iOS or Android app, get early campus drop alerts with your student email, or launch the full UniTonight Web App right in your browser.
              </p>

              <form onSubmit={handleWaitlistSubmit} className="ut-waitlist-form">
                <input
                  type="email"
                  placeholder="Enter your university email (e.g. you@liverpool.ac.uk)"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  required
                />
                <button type="submit" className="ut-btn ut-btn-primary">
                  Get App Link
                </button>
              </form>
              {waitlistError && <p className="ut-form-error">{waitlistError}</p>}
              {waitlistSubmitted && (
                <p className="ut-form-success">
                  🎉 You’re on the list! We’ve sent the mobile download details—or you can launch the Web App below right now.
                </p>
              )}

              <div className="ut-store-row" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setDownloadModalPlatform('iOS App Store');
                    setWaitlistSubmitted(false);
                    setWaitlistError(null);
                  }}
                  className="ut-store-btn"
                >
                  <Smartphone size={20} />
                  <div className="ut-store-btn-text">
                    <span className="ut-store-small">iOS App</span>
                    <span className="ut-store-big">App Store</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDownloadModalPlatform('Google Play');
                    setWaitlistSubmitted(false);
                    setWaitlistError(null);
                  }}
                  className="ut-store-btn"
                >
                  <Smartphone size={20} />
                  <div className="ut-store-btn-text">
                    <span className="ut-store-small">Android App</span>
                    <span className="ut-store-big">Google Play</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchApp('feed')}
                  className="ut-web-launch-btn"
                >
                  <Globe size={20} />
                  <div className="ut-store-btn-text">
                    <span className="ut-store-small">USE IN BROWSER</span>
                    <span className="ut-store-big">Open Web App →</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ut-footer">
        <div className="ut-container ut-footer-inner">
          <div className="ut-footer-brand">
            <div className="ut-brand">
              <div className="ut-brand-icon">
                <Flame size={18} />
              </div>
              <span className="ut-brand-name">UniTonight</span>
            </div>
            <p>Discover active student crews and campus nightlife in real time.</p>
          </div>

          <div className="ut-footer-links">
            <a href="#preview">Interactive Preview</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <button type="button" onClick={() => onLaunchApp('feed')} className="ut-footer-btn-link">
              Launch Web App
            </button>
          </div>

          <div className="ut-footer-copy">
            © {new Date().getFullYear()} UniTonight (unitonight.com). Exclusively for verified university students.
          </div>
        </div>
      </footer>

      {/* DOWNLOAD / EARLY ACCESS MODAL */}
      {downloadModalPlatform && (
        <div className="ut-modal-backdrop" onClick={() => setDownloadModalPlatform(null)}>
          <div className="ut-modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="ut-modal-close"
              onClick={() => setDownloadModalPlatform(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="ut-modal-badge">
              <Smartphone size={22} />
            </div>
            <h3>Get UniTonight for {downloadModalPlatform}</h3>
            <p>
              Enter your <code>.ac.uk</code> or <code>.edu</code> email to receive your direct {downloadModalPlatform} invite link, or use UniTonight immediately in your browser!
            </p>

            <form onSubmit={handleWaitlistSubmit} className="ut-modal-form">
              <input
                type="email"
                placeholder="you@university.ac.uk"
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                required
              />
              <button type="submit" className="ut-btn ut-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send {downloadModalPlatform} Link
              </button>
            </form>

            {waitlistError && <p className="ut-form-error">{waitlistError}</p>}
            {waitlistSubmitted && (
              <p className="ut-form-success">
                ✨ Sent! Check your student inbox—or jump straight into the Web App below.
              </p>
            )}

            <div className="ut-modal-divider">
              <span>or start right now</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setDownloadModalPlatform(null);
                onLaunchApp('feed');
              }}
              className="ut-btn ut-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Globe size={16} />
              <span>Launch UniTonight Web App Now</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .ut-website {
          min-height: 100vh;
          background-color: var(--bg-dark);
          color: var(--text-primary);
          position: relative;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .ut-container {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 2;
        }

        /* Ambient Glows */
        .ut-bg-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          z-index: 0;
        }
        .ut-glow-1 {
          top: -120px;
          right: 8%;
          width: 480px;
          height: 480px;
          background: rgba(168, 85, 247, 0.16);
        }
        .ut-glow-2 {
          top: 40%;
          left: -140px;
          width: 440px;
          height: 440px;
          background: rgba(59, 130, 246, 0.11);
        }
        .ut-glow-3 {
          bottom: 5%;
          right: 15%;
          width: 400px;
          height: 400px;
          background: rgba(244, 114, 182, 0.1);
        }

        /* Navbar */
        .ut-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(9, 9, 11, 0.82);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ut-nav-inner {
          max-width: 1220px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .ut-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .ut-brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7, #7e22ce);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
        }
        .ut-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .ut-brand-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(52, 211, 153, 0.12);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.25);
        }
        .ut-nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .ut-nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .ut-nav-links a:hover {
          color: var(--text-primary);
        }
        .ut-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Buttons */
        .ut-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.2rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: inherit;
        }
        .ut-btn-primary {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.35);
        }
        .ut-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5);
        }
        .ut-btn-secondary {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .ut-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .ut-btn-ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid transparent;
        }
        .ut-btn-ghost:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }
        .ut-btn-outline-sm {
          background: rgba(168, 85, 247, 0.1);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 0.5rem 0.95rem;
          font-size: 0.84rem;
        }
        .ut-btn-outline-sm:hover {
          background: rgba(168, 85, 247, 0.2);
        }

        /* Hero Section */
        .ut-hero {
          padding: 4.5rem 0 5rem;
        }
        .ut-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
        }
        .ut-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.28);
          color: #e9d5ff;
          font-size: 0.84rem;
          margin-bottom: 1.5rem;
        }
        .ut-badge-icon {
          color: #c084fc;
        }
        .ut-hero-title {
          font-size: clamp(2.5rem, 4.6vw, 4rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .ut-gradient-text {
          background: linear-gradient(135deg, #c084fc 0%, #f472b6 55%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ut-hero-subtitle {
          font-size: 1.12rem;
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 580px;
          margin-bottom: 2rem;
        }

        /* Store & Launch Buttons */
        .ut-store-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-bottom: 2.5rem;
        }
        .ut-store-btn,
        .ut-web-launch-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.2rem;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
        }
        .ut-store-btn {
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: var(--text-primary);
        }
        .ut-store-btn:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          background: #1b1b22;
        }
        .ut-web-launch-btn {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(244, 114, 182, 0.18));
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: white;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }
        .ut-web-launch-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(244, 114, 182, 0.28));
        }
        .ut-store-btn-text {
          display: flex;
          flex-direction: column;
        }
        .ut-store-small {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
        }
        .ut-store-big {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .ut-hero-metrics {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ut-metric-item {
          display: flex;
          flex-direction: column;
        }
        .ut-metric-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .ut-metric-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .ut-metric-divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Interactive Phone Mockup */
        .ut-hero-phone-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .ut-phone-floating-badge {
          position: absolute;
          z-index: 4;
          background: rgba(20, 20, 25, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.65rem 0.95rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
          font-size: 0.78rem;
        }
        .ut-phone-floating-badge div {
          display: flex;
          flex-direction: column;
        }
        .ut-phone-floating-badge span {
          color: var(--text-secondary);
          font-size: 0.7rem;
        }
        .ut-float-left {
          top: 12%;
          left: -18px;
        }
        .ut-float-right {
          bottom: 16%;
          right: -14px;
        }
        .ut-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px #34d399;
          display: inline-block;
        }

        .ut-phone-frame {
          width: 330px;
          background: #121216;
          border: 8px solid #27272f;
          border-radius: 44px;
          padding: 0.85rem;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.65), 0 0 40px rgba(168, 85, 247, 0.18);
          position: relative;
        }
        .ut-phone-notch {
          width: 100px;
          height: 20px;
          background: #09090b;
          border-radius: 999px;
          margin: 0 auto 0.75rem;
        }
        .ut-phone-screen {
          background: #09090b;
          border-radius: 30px;
          padding: 1rem;
          min-height: 510px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ut-phone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .ut-phone-city {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1rem;
        }
        .ut-phone-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .ut-phone-going-pill {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.3rem 0.55rem;
          border-radius: 999px;
          background: rgba(168, 85, 247, 0.16);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.35);
        }
        .ut-phone-pills {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        .ut-phone-pills span {
          font-size: 0.68rem;
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          background: #18181c;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .ut-phone-pills span.active {
          background: var(--primary);
          color: white;
          font-weight: 600;
        }
        .ut-phone-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .ut-phone-card {
          background: #16161b;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 0.75rem;
        }
        .ut-phone-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.35rem;
          font-size: 0.65rem;
          font-weight: 700;
        }
        .ut-tag-dancing { color: #c084fc; }
        .ut-tag-party { color: #f472b6; }
        .ut-tag-bar { color: #fbbf24; }
        .ut-tag-auto { color: #34d399; }
        .ut-tag-girls { color: #f472b6; }
        .ut-phone-card h4 {
          font-size: 0.86rem;
          margin-bottom: 0.2rem;
        }
        .ut-phone-meta {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 0.55rem;
        }
        .ut-phone-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ut-phone-avatars {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        .ut-phone-join-btn {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.32rem 0.65rem;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
        }
        .ut-phone-join-btn.secondary {
          background: rgba(244, 114, 182, 0.18);
          color: #f472b6;
          border: 1px solid rgba(244, 114, 182, 0.35);
        }
        .ut-phone-join-btn.joined {
          background: rgba(52, 211, 153, 0.16);
          color: #34d399;
        }
        .ut-mini-map-canvas {
          height: 240px;
          border-radius: 16px;
          background: radial-gradient(circle at center, #1e1b2e 0%, #111115 100%);
          border: 1px solid rgba(168, 85, 247, 0.25);
          position: relative;
          overflow: hidden;
        }
        .ut-mini-radar {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 170px;
          height: 170px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px dashed rgba(168, 85, 247, 0.45);
          background: rgba(168, 85, 247, 0.06);
        }
        .ut-mini-pin {
          position: absolute;
          background: rgba(18, 18, 22, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
        }
        .ut-mini-pin.active {
          border-color: var(--primary);
          background: rgba(168, 85, 247, 0.25);
        }
        .ut-mini-chat-box {
          background: #15151a;
          border-radius: 16px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ut-mini-chat-title {
          font-size: 0.74rem;
          font-weight: 700;
          color: #c084fc;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ut-mini-bubble {
          background: #1f1f27;
          padding: 0.45rem 0.6rem;
          border-radius: 10px;
          font-size: 0.72rem;
          line-height: 1.35;
        }
        .ut-mini-bubble.me {
          background: rgba(168, 85, 247, 0.22);
          border: 1px solid rgba(168, 85, 247, 0.35);
          align-self: flex-end;
        }
        .ut-phone-bottom-nav {
          display: flex;
          justify-content: space-around;
          padding-top: 0.65rem;
          margin-top: 0.65rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ut-phone-bottom-nav button {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.65rem;
          cursor: pointer;
        }
        .ut-phone-bottom-nav button.active {
          color: var(--primary);
          font-weight: 700;
        }

        /* Sections */
        .ut-section {
          padding: 5rem 0;
        }
        .ut-section-alt {
          background: rgba(18, 18, 21, 0.6);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ut-section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 2.75rem;
        }
        .ut-eyebrow {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--primary);
          margin-bottom: 0.6rem;
        }
        .ut-section-title {
          font-size: clamp(1.85rem, 3.2vw, 2.6rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .ut-section-desc {
          color: var(--text-secondary);
          font-size: 1.02rem;
          line-height: 1.6;
        }

        /* Interactive Showcase Tabs */
        .ut-showcase-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-bottom: 2rem;
        }
        .ut-showcase-tab {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.8rem 1.35rem;
          border-radius: 14px;
          background: #141418;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ut-showcase-tab:hover {
          color: var(--text-primary);
          border-color: var(--border-focus);
        }
        .ut-showcase-tab.active {
          background: var(--primary-glow);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.2);
        }

        .ut-showcase-stage {
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 26px;
          padding: 2rem;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
        }
        .ut-stage-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .ut-city-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ut-city-pill {
          padding: 0.48rem 0.95rem;
          border-radius: 999px;
          background: #1a1a20;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ut-city-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        /* Crew Preview Cards Grid */
        .ut-preview-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.35rem;
        }
        .ut-crew-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ut-crew-card:hover {
          transform: translateY(-3px);
          border-color: rgba(168, 85, 247, 0.4);
        }
        .ut-crew-card-img {
          height: 155px;
          background-size: cover;
          background-position: center;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .ut-crew-cat-badge {
          align-self: flex-start;
          background: rgba(9, 9, 11, 0.78);
          backdrop-filter: blur(8px);
          color: #c084fc;
          border: 1px solid rgba(192, 132, 252, 0.35);
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
        }
        .ut-crew-gender-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(244, 114, 182, 0.2);
          border: 1px solid rgba(244, 114, 182, 0.45);
          color: #f9a8d4;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .ut-crew-img-bottom h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 0.15rem;
        }
        .ut-crew-img-bottom span {
          font-size: 0.78rem;
          color: #d4d4d8;
        }
        .ut-crew-card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1;
        }
        .ut-crew-info-row {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .ut-crew-info-row span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .ut-crew-desc {
          font-size: 0.86rem;
          color: #d4d4d8;
          line-height: 1.5;
          flex: 1;
        }
        .ut-vibe-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .ut-vibe-chip {
          font-size: 0.73rem;
          padding: 0.24rem 0.6rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ut-crew-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ut-attendee-count {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .ut-match-type {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        .ut-crew-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.55rem 1rem;
          border-radius: 10px;
          background: var(--primary);
          color: white;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ut-crew-action-btn.joined {
          background: rgba(52, 211, 153, 0.16);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.35);
        }
        .ut-crew-action-btn.requested {
          background: rgba(251, 191, 36, 0.16);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.35);
        }

        /* Map Showcase */
        .ut-map-showcase-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.85fr;
          gap: 1.5rem;
          align-items: stretch;
        }
        .ut-map-interactive-canvas {
          min-height: 400px;
          border-radius: 20px;
          background: radial-gradient(circle at 50% 50%, #1c1830 0%, #0d0d12 100%);
          border: 1px solid rgba(168, 85, 247, 0.25);
          position: relative;
          overflow: hidden;
        }
        .ut-map-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 36px 36px;
        }
        .ut-map-radius-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px dashed rgba(168, 85, 247, 0.5);
          background: rgba(168, 85, 247, 0.06);
          transition: all 0.25s ease;
          pointer-events: none;
        }
        .ut-map-top-bar {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          z-index: 3;
        }
        .ut-map-status-pill,
        .ut-map-radius-control {
          background: rgba(15, 15, 20, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ut-map-hotspot-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          background: rgba(18, 18, 24, 0.94);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 0.45rem 0.75rem;
          color: white;
          cursor: pointer;
          z-index: 4;
          transition: all 0.2s ease;
        }
        .ut-map-hotspot-pin.selected {
          background: var(--primary);
          border-color: #f472b6;
          transform: translate(-50%, -50%) scale(1.08);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5);
        }
        .ut-pin-label {
          display: flex;
          flex-direction: column;
          text-align: left;
          font-size: 0.75rem;
        }
        .ut-pin-label em {
          font-style: normal;
          font-size: 0.68rem;
          opacity: 0.85;
        }
        .ut-map-sidebar-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .ut-map-venue-banner {
          height: 150px;
          background-size: cover;
          background-position: center;
          padding: 1rem;
          display: flex;
          align-items: flex-end;
        }
        .ut-venue-open-badge {
          background: rgba(9, 9, 11, 0.85);
          color: #34d399;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
        }
        .ut-map-venue-details {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }
        .ut-venue-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .ut-venue-title-row h3 {
          font-size: 1.25rem;
        }
        .ut-venue-title-row p {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .ut-venue-rating {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .ut-venue-deal-box {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #fde68a;
          padding: 0.65rem 0.85rem;
          border-radius: 12px;
          font-size: 0.84rem;
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .ut-venue-active-crews-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #c084fc;
          margin-top: auto;
        }

        /* Venues Tab Grid */
        .ut-venues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .ut-venue-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .ut-venue-card-img {
          height: 140px;
          background-size: cover;
          background-position: center;
          padding: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .ut-venue-area-tag,
        .ut-venue-rating-pill {
          background: rgba(9, 9, 11, 0.82);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .ut-venue-rating-pill {
          color: #fbbf24;
        }
        .ut-venue-card-body {
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .ut-venue-type {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .ut-venue-deal-inline {
          font-size: 0.8rem;
          font-weight: 700;
          color: #34d399;
        }
        .ut-venue-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 0.65rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .ut-link-btn {
          background: none;
          border: none;
          color: #c084fc;
          font-weight: 700;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          cursor: pointer;
        }

        /* My Night & Chat Showcase */
        .ut-mynight-showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .ut-mynight-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .ut-panel-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ut-panel-header h3 {
          font-size: 1.05rem;
        }
        .ut-panel-header p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .ut-requests-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .ut-request-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.85rem;
          border-radius: 14px;
        }
        .ut-req-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
        }
        .ut-req-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          font-size: 0.82rem;
        }
        .ut-req-info span {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }
        .ut-req-actions {
          display: flex;
          gap: 0.4rem;
        }
        .ut-req-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          border: none;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
        }
        .ut-req-btn.approve {
          background: rgba(52, 211, 153, 0.16);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.35);
        }
        .ut-req-btn.decline {
          background: rgba(239, 68, 68, 0.14);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .ut-req-status.approved {
          font-size: 0.76rem;
          font-weight: 700;
          color: #34d399;
        }
        .ut-req-status.declined {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .ut-chat-messages {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 220px;
          overflow-y: auto;
        }
        .ut-chat-msg {
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.65rem 0.85rem;
          border-radius: 12px;
          max-width: 88%;
        }
        .ut-chat-msg.me {
          align-self: flex-end;
          background: rgba(168, 85, 247, 0.18);
          border-color: rgba(168, 85, 247, 0.35);
        }
        .ut-chat-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
        .ut-chat-text {
          font-size: 0.84rem;
        }
        .ut-chat-input-bar {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        .ut-chat-input-bar input {
          flex: 1;
          background: #121216;
          border: 1px solid var(--border);
          color: white;
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          font-size: 0.85rem;
          outline: none;
        }
        .ut-chat-input-bar button {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0 0.9rem;
          cursor: pointer;
        }

        /* Bento Grid */
        .ut-bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.35rem;
        }
        .ut-bento-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .ut-bento-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ut-bento-card h3 {
          font-size: 1.2rem;
        }
        .ut-bento-card p {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        /* Steps Grid */
        .ut-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .ut-step-card {
          background: linear-gradient(180deg, #18181d 0%, #121216 100%);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 2rem;
        }
        .ut-step-num {
          font-family: 'Outfit', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary);
          opacity: 0.85;
          display: block;
          margin-bottom: 0.75rem;
        }
        .ut-step-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ut-step-card p {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        /* CTA Banner */
        .ut-cta-banner {
          background: radial-gradient(circle at top right, rgba(168, 85, 247, 0.28), rgba(24, 24, 28, 0.95) 65%);
          border: 1px solid rgba(168, 85, 247, 0.35);
          border-radius: 28px;
          padding: 3.5rem 2.5rem;
          text-align: center;
        }
        .ut-cta-content {
          max-width: 660px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ut-cta-content h2 {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin-bottom: 0.75rem;
        }
        .ut-cta-content p {
          color: var(--text-secondary);
          font-size: 1.02rem;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }
        .ut-waitlist-form {
          display: flex;
          gap: 0.65rem;
          width: 100%;
          max-width: 520px;
        }
        .ut-waitlist-form input {
          flex: 1;
          background: #09090b;
          border: 1px solid var(--border);
          color: white;
          padding: 0.85rem 1.1rem;
          border-radius: 12px;
          font-size: 0.92rem;
          outline: none;
        }
        .ut-waitlist-form input:focus {
          border-color: var(--primary);
        }
        .ut-form-error {
          color: #f87171;
          font-size: 0.85rem;
          margin-top: 0.65rem;
        }
        .ut-form-success {
          color: #34d399;
          font-size: 0.88rem;
          font-weight: 600;
          margin-top: 0.65rem;
        }

        /* Footer */
        .ut-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding: 2.5rem 0;
          background: #070709;
        }
        .ut-footer-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }
        .ut-footer-brand p {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-top: 0.4rem;
        }
        .ut-footer-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .ut-footer-links a,
        .ut-footer-btn-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.88rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .ut-footer-links a:hover,
        .ut-footer-btn-link:hover {
          color: white;
        }
        .ut-footer-copy {
          width: 100%;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Modal */
        .ut-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
        }
        .ut-modal-card {
          background: #16161b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          max-width: 440px;
          width: 100%;
          padding: 2rem;
          position: relative;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        }
        .ut-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ut-modal-badge {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .ut-modal-card h3 {
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
        }
        .ut-modal-card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        .ut-modal-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ut-modal-form input {
          width: 100%;
          background: #09090b;
          border: 1px solid var(--border);
          color: white;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-size: 0.92rem;
          outline: none;
        }
        .ut-modal-divider {
          margin: 1.25rem 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        @media (max-width: 960px) {
          .ut-hero-grid,
          .ut-map-showcase-grid,
          .ut-mynight-showcase-grid {
            grid-template-columns: 1fr;
          }
          .ut-nav-links {
            display: none;
          }
          .ut-float-left,
          .ut-float-right {
            display: none;
          }
          .ut-waitlist-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
