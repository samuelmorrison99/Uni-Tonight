import React, { useEffect, useRef, useState } from 'react';
import type { CrewPlan, Venue } from '../types';
import { Layers, Target, Plus, Minus, Star, Navigation, Share2, Heart, X, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  plans: CrewPlan[];
  toggleRSVP: (id: string) => void;
  venues: Venue[];
  userCoords: [number, number] | null;
  setUserCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
}

import { LIVERPOOL_VENUES } from '../data/liverpoolVenues';

export const MapView: React.FC<MapProps> = ({ 
  plans, 
  toggleRSVP, 
  userCoords,
  setUserCoords,
  searchRadius,
  setSearchRadius
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [activeVenues] = useState<Venue[]>(LIVERPOOL_VENUES);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'standard' | 'dark' | 'satellite'>('dark');

  const tileLayerRefs = useRef<Record<string, L.TileLayer>>({});

  const getCrewsAtLocation = (locName: string) => {
    return plans.filter(p => p.location.toLowerCase().includes(locName.toLowerCase()) || 
                             (locName.toLowerCase().includes('heebie') && p.location.toLowerCase().includes('heebie')) ||
                             (locName.toLowerCase().includes('raz') && p.location.toLowerCase().includes('raz')));
  };

  const handleGoogleMapsRedirect = (name: string, area: string) => {
    const query = encodeURIComponent(`${name} ${area}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Define strict boundaries for Liverpool (City Centre, Baltic, Student Areas)
    const liverpoolBounds = L.latLngBounds(
      [53.3700, -3.0100], // Southwest (Dingle / Sefton Park)
      [53.4200, -2.9000]  // Northeast (Everton / Kensington)
    );

    // Start centered on Concert Square, Liverpool (as fallback)
    const map = L.map(mapContainerRef.current, {
      center: [53.4026, -2.9790],
      zoom: 15,
      minZoom: 13,
      maxZoom: 20, // Allow extreme zoom in
      maxBounds: liverpoolBounds,
      maxBoundsViscosity: 1.0, // Prevents dragging outside bounds entirely
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;

    // Tile Layers Setup (Using Esri to avoid API Key watermarks and match sleek branding)
    tileLayerRefs.current.standard = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      maxNativeZoom: 16 // Vital for stretching tiles past max provider zoom
    });

    tileLayerRefs.current.dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      maxNativeZoom: 16 // Vital for stretching tiles past max provider zoom
    }).addTo(map);

    tileLayerRefs.current.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      maxNativeZoom: 18
    });

    // Dismiss bottom sheet on empty canvas click
    map.on('click', (e) => {
      if ((e.originalEvent.target as HTMLElement).classList.contains('leaflet-container')) {
        setSelectedVenue(null);
      }
    });

    // Proactively locate user on initial load
    if (userCoords) {
      map.setView(userCoords, 15);
      if (userLocationMarkerRef.current) userLocationMarkerRef.current.remove();
      const userIcon = L.divIcon({
        html: `<div class="user-pulse-dot"></div>`,
        className: 'custom-user-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      userLocationMarkerRef.current = L.marker(userCoords, { icon: userIcon }).addTo(map);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);

          // Add user location blue dot
          if (userLocationMarkerRef.current) userLocationMarkerRef.current.remove();
          const userIcon = L.divIcon({
            html: `<div class="user-pulse-dot"></div>`,
            className: 'custom-user-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          userLocationMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        },
        (error) => {
          console.warn("Auto-location failed, staying on default center:", error);
        }
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync tile layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(tileLayerRefs.current).forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    tileLayerRefs.current[activeTileLayer].addTo(map);
  }, [activeTileLayer]);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    activeVenues.forEach(venue => {
      const crews = getCrewsAtLocation(venue.name);
      
      const customVenue = venue as any;
      let latlng: [number, number] = [53.4026, -2.9790];
      if (customVenue.latlng) {
        latlng = customVenue.latlng;
      }

      const customIcon = L.divIcon({
        html: `
          <div class="custom-leaflet-marker ${selectedVenue?.id === venue.id ? 'selected' : ''}">
            <div class="pin-wrapper">
              <svg viewBox="0 0 24 24" fill="#8b5cf6" stroke="#ffffff" stroke-width="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              ${crews.length > 0 ? `<span class="marker-count">${crews.length}</span>` : ''}
            </div>
            <span class="label-tag">${venue.name}</span>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });

      const marker = L.marker(latlng, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedVenue(venue);
        map.setView(latlng, 16);
      });

      markersRef.current.push(marker);
    });
  }, [activeVenues, selectedVenue, plans]);

  // Geolocation trigger on target button click
  const handleLocateUser = () => {
    const map = mapRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        map.setView([latitude, longitude], 15);

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }

        const userIcon = L.divIcon({
          html: `<div class="user-pulse-dot"></div>`,
          className: 'custom-user-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        userLocationMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve location. Use the search bar instead.");
      }
    );
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  return (
    <div className="google-maps-container">
      {/* Real Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="maps-canvas-leaflet"></div>

      {/* Side Floating Controls */}
      <div className="maps-controls">
        <div className="radius-picker-vertical">
          <button 
            type="button" 
            className={`radius-val-btn ${searchRadius === 4828 ? 'active' : ''}`}
            onClick={() => setSearchRadius(4828)}
            title="3 Mile Search"
          >
            3M
          </button>
          <button 
            type="button" 
            className={`radius-val-btn ${searchRadius === 8046 ? 'active' : ''}`}
            onClick={() => setSearchRadius(8046)}
            title="5 Mile Search"
          >
            5M
          </button>
        </div>
        <button 
          type="button"
          className="control-btn layer-picker" 
          title="Map Style"
          onClick={() => setActiveTileLayer(prev => prev === 'standard' ? 'dark' : prev === 'dark' ? 'satellite' : 'standard')}
        >
          <Layers size={18} />
        </button>
        <button type="button" onClick={handleLocateUser} className="control-btn" title="My Location"><Target size={18} /></button>
        <div className="zoom-group">
          <button type="button" onClick={handleZoomIn} className="control-btn zoom-in"><Plus size={18} /></button>
          <button type="button" onClick={handleZoomOut} className="control-btn zoom-out"><Minus size={18} /></button>
        </div>
      </div>

      {/* Bottom Place Details Sheet */}
      {selectedVenue && (
        <div className="maps-bottom-sheet">
          <button onClick={() => setSelectedVenue(null)} className="close-sheet-btn">
            <X size={18} />
          </button>
          <div className="sheet-handle"></div>
          <div className="sheet-layout">
            <div className="sheet-photo-wrapper">
              <img src={selectedVenue.image} alt={selectedVenue.name} className="sheet-photo" />
            </div>

            <div className="sheet-content">
              <div className="sheet-header">
                <div>
                  <h2 className="sheet-title">{selectedVenue.name}</h2>
                  <div className="sheet-rating-row">
                    <span className="rating-val">{selectedVenue.rating.toFixed(1)}</span>
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={13} 
                          fill={i < Math.floor(selectedVenue.rating) ? '#f59e0b' : 'none'} 
                          color={i < Math.floor(selectedVenue.rating) ? '#f59e0b' : '#71717a'} 
                        />
                      ))}
                    </div>
                    <span className="venue-category">{selectedVenue.type}</span>
                  </div>
                </div>
                <div className="sheet-status-col">
                  <span className="status-time">Closes {selectedVenue.closingTime}</span>
                </div>
              </div>

              <div className="sheet-actions">
                <button 
                  onClick={() => handleGoogleMapsRedirect(selectedVenue.name, selectedVenue.area)}
                  className="maps-action-btn primary"
                >
                  <Navigation size={15} />
                  <span>Directions</span>
                </button>
                <button className="maps-action-btn">
                  <Heart size={15} />
                  <span>Save</span>
                </button>
                <button className="maps-action-btn">
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>

              <div className="sheet-divider"></div>

              <div className="sheet-crews-section">
                <h3>Active Crews Here ({getCrewsAtLocation(selectedVenue.name).length})</h3>
                <div className="sheet-crews-list">
                  {getCrewsAtLocation(selectedVenue.name).length === 0 ? (
                    <p className="no-crews-msg">No active groups gathered here. Click 'Create' to start one!</p>
                  ) : (
                    getCrewsAtLocation(selectedVenue.name).map((plan) => (
                      <div key={plan.id} className="sheet-crew-item">
                        <div className="crew-item-left">
                          <h4>{plan.title}</h4>
                          <span className="crew-item-time">🕒 {plan.time}</span>
                        </div>
                        <div className="crew-item-right">
                          <span className="crew-members-count">👤 {plan.attendeesCount}</span>
                          <button
                            onClick={() => toggleRSVP(plan.id)}
                            className={`sheet-rsvp-btn ${plan.joined ? 'joined' : ''}`}
                          >
                            <Check size={12} />
                            <span>{plan.joined ? 'Joined' : 'Join'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .google-maps-container {
          position: relative;
          width: 100%;
          height: calc(100vh - 5rem);
          overflow: hidden;
          background-color: #e5e7eb;
        }

        .radius-picker-vertical {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .radius-val-btn {
          background: none;
          border: none;
          color: #5f6368;
          padding: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border-bottom: 1px solid #f1f3f4;
          transition: all 0.2s ease;
        }
        .radius-val-btn:last-child {
          border-bottom: none;
        }
        .radius-val-btn:hover {
          background-color: #f1f3f4;
          color: #202124;
        }
        .radius-val-btn.active {
          background-color: #1a73e8;
          color: #ffffff;
        }

        /* Search Bar Overlay */
        .maps-search-bar {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 1000;
          background-color: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 24px;
          height: 48px;
          width: calc(100% - 2rem);
          max-width: 400px;
          display: flex;
          align-items: center;
          padding: 0 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .search-bar-input {
          flex: 1;
          height: 100%;
          background: none;
          border: none;
          outline: none;
          color: #202124;
          font-size: 1rem;
          padding: 0 0.5rem;
        }

        .search-bar-btn {
          background: none;
          border: none;
          color: #5f6368;
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .search-bar-btn:hover {
          background-color: rgba(0,0,0,0.05);
        }

        .search-bar-btn.search-submit {
          color: #1a73e8;
        }

        /* Map Canvas */
        .maps-canvas-leaflet {
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        /* Floating Controls */
        .maps-controls {
          position: absolute;
          right: 1rem;
          top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 1000;
        }

        .control-btn {
          background-color: #ffffff;
          border: 1px solid #dadce0;
          color: #5f6368;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background-color: #f1f3f4;
          color: #202124;
        }

        .zoom-group {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .zoom-group .control-btn {
          border-radius: 0;
          border: none;
          box-shadow: none;
        }

        .zoom-group .control-btn:first-child {
          border-bottom: 1px solid #dadce0;
        }

        /* Custom Div Marker Styling */
        .custom-leaflet-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .pin-wrapper {
          position: relative;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
          transition: transform 0.2s ease;
        }

        .custom-leaflet-marker:hover .pin-wrapper,
        .custom-leaflet-marker.selected .pin-wrapper {
          transform: scale(1.15);
        }

        .custom-leaflet-marker.selected svg {
          filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.6));
        }

        .marker-count {
          position: absolute;
          top: -6px;
          right: -6px;
          background-color: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 9999px;
          padding: 1px 5px;
          border: 1.5px solid #ffffff;
        }

        .label-tag {
          background-color: #ffffff;
          border: 1px solid #dadce0;
          color: #202124;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          margin-top: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          pointer-events: none;
        }

        /* Blue dot user pulse */
        .user-pulse-dot {
          width: 14px;
          height: 14px;
          background-color: #1a73e8;
          border: 2px solid #ffffff;
          border-radius: 9999px;
          box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.4);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(26, 115, 232, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(26, 115, 232, 0); }
          100% { box-shadow: 0 0 0 0px rgba(26, 115, 232, 0); }
        }

        /* Bottom Place Sheet */
        .maps-bottom-sheet {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #ffffff;
          border-top: 1px solid #dadce0;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          z-index: 1000;
          padding: 1.25rem;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.15);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 48vh;
          overflow-y: auto;
        }

        .close-sheet-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: #f1f3f4;
          border: none;
          color: #5f6368;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .close-sheet-btn:hover {
          background-color: #e8eaed;
          color: #202124;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .sheet-handle {
          width: 36px;
          height: 4px;
          background-color: #dadce0;
          border-radius: 2px;
          margin: -0.5rem auto 0.75rem auto;
        }

        .sheet-layout {
          display: flex;
          gap: 1.5rem;
        }

        .sheet-photo-wrapper {
          width: 140px;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
          background-color: #f1f3f4;
          flex-shrink: 0;
        }

        .sheet-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sheet-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .sheet-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #202124;
          letter-spacing: -0.5px;
        }

        .sheet-rating-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #5f6368;
          margin-top: 0.25rem;
        }

        .rating-val {
          color: #202124;
          font-weight: 700;
        }

        .stars-row {
          display: flex;
          gap: 1px;
        }

        .venue-category {
          margin-left: 0.25rem;
        }

        .sheet-status-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .status-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .status-pill.open {
          background-color: rgba(52, 211, 153, 0.15);
          color: #059669;
        }

        .status-pill.closed {
          background-color: rgba(239, 68, 68, 0.15);
          color: #dc2626;
        }

        .status-time {
          font-size: 0.75rem;
          color: #5f6368;
        }

        .sheet-actions {
          display: flex;
          gap: 0.75rem;
        }

        .maps-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #ffffff;
          border: 1px solid #dadce0;
          color: #1a73e8;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .maps-action-btn:hover {
          background-color: #f8f9fa;
        }

        .maps-action-btn.primary {
          background-color: #1a73e8;
          color: #ffffff;
          border-color: #1a73e8;
        }

        .maps-action-btn.primary:hover {
          background-color: #1557b0;
        }

        .sheet-divider {
          height: 1px;
          background-color: #dadce0;
        }

        .sheet-crews-section h3 {
          font-size: 0.95rem;
          color: #202124;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .sheet-crews-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .no-crews-msg {
          font-size: 0.85rem;
          color: #5f6368;
        }

        .sheet-crew-item {
          background-color: #f8f9fa;
          border: 1px solid #dadce0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .crew-item-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .crew-item-left h4 {
          font-size: 0.95rem;
          color: #202124;
          font-weight: 700;
        }

        .crew-item-time {
          font-size: 0.75rem;
          color: #5f6368;
        }

        .crew-item-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .crew-members-count {
          font-size: 0.8rem;
          color: #5f6368;
          font-weight: 600;
        }

        .sheet-rsvp-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #ffffff;
          border: 1px solid #dadce0;
          color: #5f6368;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sheet-rsvp-btn:hover {
          border-color: #9ca3af;
          color: #202124;
        }

        .sheet-rsvp-btn.joined {
          background-color: rgba(52, 211, 153, 0.15);
          border-color: #059669;
          color: #059669;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .sheet-layout {
            flex-direction: column;
            gap: 1rem;
          }
          .sheet-photo-wrapper {
            width: 100%;
            height: 100px;
          }
          .maps-bottom-sheet {
            max-height: 60vh;
          }
        }
      `}</style>
    </div>
  );
};
