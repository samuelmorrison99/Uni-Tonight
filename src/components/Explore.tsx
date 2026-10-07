import React, { useEffect, useState } from 'react';
import { Search, Star, TrendingUp, Sparkles, Navigation } from 'lucide-react';
import type { Venue } from '../types';
import { LIVERPOOL_VENUES } from '../data/liverpoolVenues';

interface ExploreProps {
  currentCity: string;
  userCoords: [number, number] | null;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
}

export const Explore: React.FC<ExploreProps> = ({ 
  currentCity, 
  searchRadius, 
  setSearchRadius 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeVenues, setActiveVenues] = useState<Venue[]>([]);

  // On mount, load static Liverpool venues instantly
  useEffect(() => {
    setActiveVenues(LIVERPOOL_VENUES);
  }, []);

  const handleGoogleMapsRedirect = (name: string, area: string) => {
    const query = encodeURIComponent(`${name} ${area}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredVenues = activeVenues.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTag === 'Chill') {
      return (
        v.type.toLowerCase().includes('brunch') || 
        v.type.toLowerCase().includes('pub') || 
        v.type.toLowerCase().includes('jazz') ||
        v.name.toLowerCase().includes('coffee')
      );
    }
    if (selectedTag === 'Party') {
      return v.type.toLowerCase().includes('club') || v.type.toLowerCase().includes('rave') || v.name.toLowerCase().includes('raz');
    }
    if (selectedTag === 'Bar Hop') {
      return (
        v.type.toLowerCase().includes('bar') || 
        v.type.toLowerCase().includes('pub') ||
        v.type.toLowerCase().includes('bier')
      );
    }
    return true;
  });

  return (
    <div className="explore-container">
      <header className="explore-header">
        <div className="explore-header-row">
          <div>
            <h1 className="explore-title">Explore {currentCity} 🧭</h1>
            <p className="explore-subtitle">Find local student hotspots and popular venues near you</p>
          </div>
        </div>
      </header>

      {/* Search & Radius Toggles Row */}
      <div className="search-radius-row">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search venues, neighborhoods, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Radius Filter Toggle (3 vs 5 Miles) */}
        <div className="radius-toggle-container">
          <span className="radius-label">Search Radius:</span>
          <div className="radius-toggle-group">
            <button
              onClick={() => setSearchRadius(4828)} // 3 miles in meters
              className={`radius-toggle-btn ${searchRadius === 4828 ? 'active' : ''}`}
            >
              3 Miles
            </button>
            <button
              onClick={() => setSearchRadius(8046)} // 5 miles in meters
              className={`radius-toggle-btn ${searchRadius === 8046 ? 'active' : ''}`}
            >
              5 Miles
            </button>
          </div>
        </div>
      </div>

      {/* Category Tag Pills */}
      <div className="explore-tags-container">
        {['All', 'Chill', 'Party', 'Bar Hop'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`explore-tag-btn ${selectedTag === tag ? 'active' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      <section className="explore-section">
        <div className="section-title-row">
          <TrendingUp size={18} className="icon-purple" />
          <h2>Popular Venues Right Now ({filteredVenues.length})</h2>
        </div>

        <div className="venue-grid">
          {filteredVenues.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={36} className="empty-icon" />
              <h3>No local venues found</h3>
              <p>Try switching your location or adjusting the search radius.</p>
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <div key={venue.id} className="venue-card">
                <div className="venue-img-wrapper">
                  <img src={venue.image} alt={venue.name} className="venue-img" />
                  <span className="venue-rating">
                    <Star size={12} fill="var(--color-bar)" color="var(--color-bar)" />
                    {venue.rating.toFixed(1)}
                  </span>
                </div>
                <div className="venue-info">
                  <div className="info-header-row">
                    <span className="venue-type">{venue.type}</span>
                  </div>
                  <h3 className="venue-name">{venue.name}</h3>
                  
                  <div className="venue-card-middle">
                    <span className="venue-area">📍 {venue.area}</span>
                    <span className="close-time">Closes {venue.closingTime}</span>
                  </div>

                  {/* Google Maps deep link redirection button */}
                  <button
                    onClick={() => handleGoogleMapsRedirect(venue.name, venue.area)}
                    className="explore-maps-redirect-btn"
                  >
                    <Navigation size={14} />
                    <span>Open in Google Maps</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <style>{`
        .explore-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .explore-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .explore-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
          margin-bottom: 0.25rem;
        }

        .explore-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .confirm-loc-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-loc-btn:hover {
          background-color: var(--primary);
          color: white;
        }

        /* Search and Radius Toggle Alignment */
        .search-radius-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 1rem 1rem 1rem 3.5rem;
          border-radius: 16px;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 12px var(--primary-glow);
        }

        /* Radius Selector Group */
        .radius-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          padding: 0.4rem 0.65rem;
          border-radius: 14px;
        }

        .radius-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .radius-toggle-group {
          display: flex;
          background-color: var(--bg-dark);
          border-radius: 8px;
          padding: 2px;
          border: 1px solid var(--border);
        }

        .radius-toggle-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .radius-toggle-btn:hover {
          color: var(--text-primary);
        }

        .radius-toggle-btn.active {
          background-color: var(--primary);
          color: white;
          box-shadow: 0 2px 6px var(--primary-glow);
        }

        .explore-tags-container {
          display: flex;
          gap: 0.75rem;
          margin-top: -1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .explore-tag-btn {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .explore-tag-btn.active {
          background-color: var(--primary-glow);
          border-color: var(--primary);
          color: var(--primary);
        }

        .explore-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title-row h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* Grid */
        .venue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .venue-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .venue-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-focus);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }

        .venue-img-wrapper {
          position: relative;
          height: 160px;
        }

        .venue-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .venue-rating {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
        }

        .venue-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          flex: 1;
        }

        .info-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .venue-type {
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .status-pill.open {
          background-color: rgba(52, 211, 153, 0.15);
          color: #34d399;
        }

        .status-pill.closed {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .venue-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .venue-card-middle {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Google Maps Button */
        .explore-maps-redirect-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: #8ab4f8;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
        }

        .explore-maps-redirect-btn:hover {
          border-color: #8ab4f8;
          background-color: rgba(138, 180, 248, 0.05);
        }

        .explore-loading-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .loader-icon {
          color: var(--primary);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};
