import React, { useState } from 'react';
import type { CrewPlan, UserProfile } from '../types';
import type { User as FirebaseUser } from 'firebase/auth';
import { MapPin, Calendar, Users, Check, CircleAlert, Sparkles, UserCheck, UserX, Shield, Loader2 } from 'lucide-react';
import { CITY_NEIGHBORHOODS } from '../App';

interface FeedProps {
  plans: CrewPlan[];
  toggleRSVP: (id: string) => void;
  isGoingOut: boolean;
  setIsGoingOut: (val: boolean) => void;
  currentCity: string;
  setCurrentCity: (val: string) => void;
  setUserCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  currentUser: FirebaseUser | null;
  handleRequestAction: (planId: string, requesterUid: string, action: 'approve' | 'decline') => void;
  profiles: UserProfile[];
}

export const Feed: React.FC<FeedProps> = ({ 
  plans, 
  toggleRSVP, 
  isGoingOut, 
  setIsGoingOut, 
  currentCity, 
  currentUser,
  handleRequestAction,
  profiles
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('All areas');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Retrieve neighborhoods for the current city
  const areas = ['All areas', ...(CITY_NEIGHBORHOODS[currentCity] || ['City Centre'])];

  // Filter plans based on the current city and selected neighborhood
  const filteredPlans = plans.filter(p => {
    // 1. Expiration check (hide if crew is scheduled and is older than 6 hours)
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    if (p.eventTimestamp && (Date.now() - p.eventTimestamp > SIX_HOURS_MS)) {
      return false;
    }

    // 2. Filter by City Name
    const isPlanInSelectedCity = 
      (p.city && p.city.toLowerCase() === currentCity.toLowerCase()) ||
      (!p.city && (
        p.location.toLowerCase().includes(currentCity.toLowerCase()) ||
        (currentCity === 'Liverpool' && (p.location.toLowerCase().includes('brookhouse') || p.location.toLowerCase().includes('heebie') || p.location.toLowerCase().includes('raz'))) ||
        (currentCity === 'London' && (p.location.toLowerCase().includes('soho') || p.location.toLowerCase().includes('shoreditch') || p.location.toLowerCase().includes('camden') || p.location.toLowerCase().includes('greenwich')))
      ));
    
    if (!isPlanInSelectedCity) return false;

    // 3. Filter by selected Area pill
    if (selectedArea === 'All areas') return true;
    return p.location.toLowerCase().includes(selectedArea.toLowerCase()) ||
           (selectedArea.includes('Smithdown') && p.location.toLowerCase().includes('smithdown')) ||
           (selectedArea.includes('Concert Square') && p.location.toLowerCase().includes('concert'));
  });

  const getBadgeStyle = (category: CrewPlan['category']) => {
    switch (category) {
      case 'Dancing':
        return { color: 'var(--color-dancing)', bg: 'var(--bg-dancing)' };
      case 'Party':
        return { color: 'var(--color-party)', bg: 'var(--bg-party)' };
      case 'Dinner & Drinks':
        return { color: 'var(--color-drinks)', bg: 'var(--bg-drinks)' };
      case 'Bar Hopping':
        return { color: 'var(--color-bar)', bg: 'var(--bg-bar)' };
      case 'Club':
        return { color: 'var(--color-club)', bg: 'var(--bg-club)' };
      default:
        return { color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.05)' };
    }
  };

  // SECOND PAGE: FEED LANDING PAGE (Tonight in [City])
  return (
    <div className="feed-container">
      {/* Top Header Section */}
      <header className="feed-header">
        <div className="title-area">
          <div className="title-row">
            <h1 className="feed-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span>Tonight in {currentCity} 🎯</span>
              <span style={{ 
                fontSize: '0.85rem', 
                color: 'var(--primary)', 
                fontWeight: 700, 
                fontFamily: 'monospace',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                display: 'inline-block',
                width: 'fit-content'
              }}>
                ⏰ {currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} | {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </h1>
          </div>
          <p className="feed-subtitle">Join a crew or start one</p>
        </div>
        <button 
          onClick={() => setIsGoingOut(!isGoingOut)}
          className={`going-out-btn ${isGoingOut ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>{isGoingOut ? "I'm going out!" : "I'm staying in"}</span>
        </button>
      </header>

      {/* Dynamic Area Filter Pills */}
      <div className="filter-scroll">
        <div className="filter-container">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`filter-pill ${selectedArea === area ? 'active' : ''}`}
            >
              {area === 'All areas' ? '📍 All areas' : area}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Info / Count */}
      <div className="section-header">
        <Users size={18} className="section-icon" />
        <h2>Looking for people — jump in ({filteredPlans.length})</h2>
      </div>

      {/* Grid of Crew Cards */}
      {filteredPlans.length === 0 ? (
        <div className="empty-state">
          <CircleAlert size={40} className="empty-icon" />
          <h3>No crews in {currentCity} tonight</h3>
          <p>Be the first to create a crew in {currentCity} and get the night going!</p>
        </div>
      ) : (
        <div className="crew-grid">
          {filteredPlans.map((plan) => {
            const badge = getBadgeStyle(plan.category);
            return (
              <div key={plan.id} className="crew-card">
                <div className="card-image-wrapper">
                  <img src={plan.image} alt={plan.title} className="card-image" />
                  
                  <div className="card-badge-container">
                    <span 
                      className="card-badge"
                      style={{ color: badge.color, backgroundColor: badge.bg }}
                    >
                      {plan.category}
                    </span>
                    
                    {plan.genderPreference && plan.genderPreference !== 'Any' && (
                      <span className="card-pref-badge gender">
                        {plan.genderPreference}
                      </span>
                    )}

                    {plan.matchingType && plan.matchingType !== 'Auto-join' && (
                      <span className="card-pref-badge matching">
                        🔒 Request
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{plan.title}</h3>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <MapPin size={14} />
                      <span>{plan.location}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{plan.time}</span>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="card-description">{plan.description}</p>
                  )}

                  {/* Vibes tags display */}
                  {plan.vibes && plan.vibes.length > 0 && (
                    <div className="card-vibes">
                      {plan.vibes.map((v) => (
                        <span key={v} className="card-vibe-tag">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Attendee Avatars List */}
                  {plan.attendeeIds && plan.attendeeIds.length > 0 && (
                    <div className="attendees-avatars-row" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0.75rem 0' }}>
                      <div className="avatars-stack" style={{ display: 'flex', position: 'relative', height: '28px', marginRight: '0.5rem' }}>
                        {plan.attendeeIds.map((uid, idx) => {
                          const profile = profiles.find(p => p.id === uid);
                          const name = profile ? profile.name : 'Student';
                          const photo = profile && profile.photos[0];
                          return (
                            <div 
                              key={uid} 
                              className="stack-avatar" 
                              title={name}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--border)',
                                border: '2px solid var(--bg-card)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                marginLeft: idx > 0 ? '-8px' : '0',
                                zIndex: 10 - idx
                              }}
                            >
                              {photo ? (
                                <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                name.charAt(0)
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {plan.attendeeIds.length} going
                      </span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="card-action-bar">
                    <span className="attendee-count">
                      👤 {plan.attendeesCount}
                      {plan.maxPeople ? ` / ${plan.maxPeople}` : ''}
                    </span>
                    
                    {/* Dynamic Action Buttons based on User States */}
                    {currentUser && plan.hostId === currentUser.uid ? (
                      <button
                        className="rsvp-btn host"
                        disabled
                        style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)', cursor: 'default' }}
                      >
                        <Shield size={14} />
                        <span>Hosting</span>
                      </button>
                    ) : currentUser && plan.attendeeIds?.includes(currentUser.uid) ? (
                      <button
                        onClick={() => toggleRSVP(plan.id)}
                        className="rsvp-btn joined"
                      >
                        <Check size={14} className="check-icon" />
                        <span>Leave Crew</span>
                      </button>
                    ) : currentUser && plan.requestIds?.includes(currentUser.uid) ? (
                      <button
                        onClick={() => toggleRSVP(plan.id)}
                        className="rsvp-btn"
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid #3b82f6' }}
                      >
                        <Loader2 size={14} className="animate-spin" />
                        <span>Request Sent</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleRSVP(plan.id)}
                        className="rsvp-btn"
                      >
                        <Check size={14} className="check-icon" />
                        <span>{plan.matchingType === 'Request to join' ? 'Request' : 'Join Crew'}</span>
                      </button>
                    )}
                  </div>

                  {/* Host Approvals Control Panel */}
                  {currentUser && plan.hostId === currentUser.uid && plan.requestIds && plan.requestIds.length > 0 && (
                    <div className="host-approvals-panel" style={{ 
                      marginTop: '1.25rem', 
                      paddingTop: '1.25rem', 
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                        Join Requests ({plan.requestIds.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {plan.requestIds.map(uid => {
                          const profile = profiles.find(p => p.id === uid);
                          if (!profile) return null;
                          return (
                            <div key={uid} className="request-item" style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              backgroundColor: 'var(--bg-dark)',
                              padding: '0.6rem 0.75rem',
                              borderRadius: '12px',
                              border: '1px solid var(--border)',
                              gap: '0.5rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                <div style={{ 
                                  width: '28px', 
                                  height: '28px', 
                                  borderRadius: '50%', 
                                  backgroundColor: 'var(--border)', 
                                  overflow: 'hidden', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  fontWeight: 700,
                                  fontSize: '0.8rem'
                                }}>
                                  {profile.photos[0] ? (
                                    <img src={profile.photos[0]} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    profile.name.charAt(0)
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{profile.name}</span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.bio}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                  onClick={() => handleRequestAction(plan.id, uid, 'approve')}
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Approve"
                                  type="button"
                                >
                                  <UserCheck size={12} />
                                </button>
                                <button
                                  onClick={() => handleRequestAction(plan.id, uid, 'decline')}
                                  style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Decline"
                                  type="button"
                                >
                                  <UserX size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .feed-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .title-area {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .feed-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
        }

        /* Confirm location button and dropdown */
        .city-picker-wrapper {
          position: relative;
        }

        .confirm-loc-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-loc-btn:hover {
          background-color: var(--primary);
          color: white;
        }

        .city-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 100;
          overflow: hidden;
          width: 140px;
          display: flex;
          flex-direction: column;
        }

        .city-option {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .city-option:hover {
          background-color: rgba(255,255,255,0.02);
          color: var(--text-primary);
        }

        .city-option.active {
          color: var(--primary);
          background-color: rgba(139, 92, 246, 0.02);
        }

        .feed-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .going-out-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .going-out-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .going-out-btn:hover {
          transform: translateY(-2px);
        }

        /* Filter Scrollbar area */
        .filter-scroll {
          overflow-x: auto;
          margin: 0 -1rem;
          padding: 0 1rem 0.5rem 1rem;
        }
        .filter-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .filter-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-container {
          display: flex;
          gap: 0.75rem;
          white-space: nowrap;
        }

        .filter-pill {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          border-color: var(--border-focus);
          color: var(--text-primary);
        }

        .filter-pill.active {
          background-color: var(--primary-glow);
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Card Grid & Feed Cards */
        .crew-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .crew-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .crew-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-focus);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .card-image-wrapper {
          position: relative;
          height: 180px;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .crew-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-badge-container {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          z-index: 2;
        }

        .card-badge {
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
        }

        .card-pref-badge {
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 800;
          background-color: rgba(9, 9, 11, 0.75);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
        }

        .card-pref-badge.matching {
          border-color: rgba(139, 92, 246, 0.3);
          color: var(--primary);
        }

        .card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.75rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .card-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0.25rem 0;
        }

        .card-vibes {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .card-vibe-tag {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          gap: 1rem;
        }

        .attendee-count {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .rsvp-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .rsvp-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
        }

        .rsvp-btn.joined {
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          box-shadow: none;
        }

        .rsvp-btn.joined:hover {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .rsvp-btn.host {
          background-color: rgba(139, 92, 246, 0.08);
          color: var(--primary);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: none;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          color: var(--text-primary);
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .section-icon {
          color: var(--primary);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          border: 1px dashed var(--border);
          border-radius: 20px;
          background-color: rgba(255,255,255,0.01);
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-icon {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
