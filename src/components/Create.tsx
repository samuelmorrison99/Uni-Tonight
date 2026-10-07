import React, { useState } from 'react';
import type { CrewPlan } from '../types';
import { MessageSquarePlus } from 'lucide-react';
import { LIVERPOOL_VENUES } from '../data/liverpoolVenues';

interface CreateProps {
  addPlan: (newPlan: Omit<CrewPlan, 'id' | 'attendeesCount' | 'joined' | 'host'>) => void;
  setActivePage: (page: string) => void;
}

export const Create: React.FC<CreateProps> = ({ addPlan, setActivePage }) => {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentTimeString = () => {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, '0');
    const mm = String(today.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CrewPlan['category']>('Party');
  // Default to the first venue in the list
  const [location, setLocation] = useState(LIVERPOOL_VENUES[0].name);
  const [date, setDate] = useState(getTodayDateString());
  const [timeInput, setTimeInput] = useState(getCurrentTimeString());
  const [description, setDescription] = useState('');
  const [maxPeople, setMaxPeople] = useState('8');
  const [genderPreference, setGenderPreference] = useState<CrewPlan['genderPreference']>('Any');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [matchingType, setMatchingType] = useState<CrewPlan['matchingType']>('Request to join');

  const categories: CrewPlan['category'][] = ['Dancing', 'Party', 'Dinner & Drinks', 'Bar Hopping', 'Club'];
  
  const availableVibes = [
    'Techno 🔊',
    'Cocktails 🍹',
    'Beer 🍺',
    'Chatting 💬',
    'Dancing 💃',
    'Cheap Drinks 💸',
    'Foodies 🍔',
  ];

  const handleToggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !date || !timeInput) return;

    // Calculate eventTimestamp and display time string
    const eventDate = new Date(`${date}T${timeInput}`);
    const eventTimestamp = eventDate.getTime();

    const formattedDate = eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formattedTime = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const displayTime = date === getTodayDateString() ? `Tonight - ${formattedTime}` : `${formattedDate} - ${formattedTime}`;

    addPlan({
      title,
      category,
      location,
      time: displayTime,
      eventTimestamp,
      description,
      maxPeople: maxPeople ? parseInt(maxPeople, 10) : undefined,
      genderPreference,
      vibes: selectedVibes,
      matchingType,
    });

    // Reset form
    setTitle('');
    setLocation(LIVERPOOL_VENUES[0].name);
    setDate(getTodayDateString());
    setTimeInput(getCurrentTimeString());
    setDescription('');
    setMaxPeople('8');
    setGenderPreference('Any');
    setSelectedVibes([]);
    setMatchingType('Auto-join');

    // Go back to feed
    setActivePage('feed');
  };

  return (
    <div className="create-container">
      <header className="create-header">
        <h1 className="create-title">Create a Crew 👥</h1>
        <p className="create-subtitle">Put plans out there and see who jumps in tonight</p>
      </header>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="title">What are you up to?</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Pub crawl down Concert Square, Pres at mine"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <div className="category-select-grid">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`category-btn ${category === cat ? 'active' : ''} ${cat.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row flex-row">
          <div className="form-group half">
            <label htmlFor="location">Where are you meeting?</label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="form-input select"
            >
              {LIVERPOOL_VENUES.map((venue) => (
                <option key={venue.id} value={venue.name}>
                  {venue.name} ({venue.area})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group half" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="date">Event Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="time">Start Time</label>
              <input
                id="time"
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                required
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Preferences section */}
        <div className="preferences-section">
          <h3 className="section-title">Crew Preferences & Matching</h3>
          <div className="form-row flex-row">
            <div className="form-group third">
              <label htmlFor="maxPeople">Max People</label>
              <input
                id="maxPeople"
                type="number"
                min="2"
                max="50"
                value={maxPeople}
                onChange={(e) => setMaxPeople(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group third">
              <label htmlFor="gender">Gender Preference</label>
              <select
                id="gender"
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value as CrewPlan['genderPreference'])}
                className="form-input select"
              >
                <option value="Any">Any Gender</option>
                <option value="Girls Only">Girls Only</option>
                <option value="Guys Only">Guys Only</option>
                <option value="Mixed">Mixed Groups</option>
              </select>
            </div>

            <div className="form-group third">
              <label htmlFor="matching">Matching Type</label>
              <select
                id="matching"
                value={matchingType}
                onChange={(e) => setMatchingType(e.target.value as CrewPlan['matchingType'])}
                className="form-input select"
              >
                <option value="Auto-join">Auto-join (Instant)</option>
                <option value="Request to join">Request to join</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests & Vibes section */}
        <div className="form-group">
          <label>Select Crew Vibes</label>
          <div className="vibe-tags-grid">
            {availableVibes.map((vibe) => {
              const isSelected = selectedVibes.includes(vibe);
              return (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => handleToggleVibe(vibe)}
                  className={`vibe-tag-btn ${isSelected ? 'active' : ''}`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Tell people details (optional)</label>
          <textarea
            id="description"
            rows={3}
            placeholder="e.g. We are 3 second-years looking for a couple more people to join us. The more the merrier! 🍻"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input textarea"
          />
        </div>

        <button type="submit" className="submit-btn">
          <MessageSquarePlus size={18} />
          <span>Launch Crew</span>
        </button>
      </form>

      <style>{`
        .create-container {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .create-header {
          text-align: left;
        }

        .create-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
          margin-bottom: 0.25rem;
        }

        .create-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .create-form {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .preferences-section {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input {
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .textarea {
          resize: vertical;
        }

        .form-row.flex-row {
          display: flex;
          gap: 1rem;
        }

        .form-group.half {
          flex: 1;
        }

        .form-group.third {
          flex: 1;
        }

        .category-select-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .category-btn {
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.6rem 0.5rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          border-color: var(--border-focus);
          color: var(--text-primary);
        }

        /* Specific active categories color settings matching our system */
        .category-btn.active.dancing {
          background-color: var(--bg-dancing);
          border-color: var(--color-dancing);
          color: var(--color-dancing);
        }
        .category-btn.active.party {
          background-color: var(--bg-party);
          border-color: var(--color-party);
          color: var(--color-party);
        }
        .category-btn.active.dinner-&-drinks {
          background-color: var(--bg-drinks);
          border-color: var(--color-drinks);
          color: var(--color-drinks);
        }
        .category-btn.active.bar-hopping {
          background-color: var(--bg-bar);
          border-color: var(--color-bar);
          color: var(--color-bar);
        }
        .category-btn.active.club {
          background-color: var(--bg-club);
          border-color: var(--color-club);
          color: var(--color-club);
        }

        /* Vibes Selector Tags */
        .vibe-tags-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .vibe-tag-btn {
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .vibe-tag-btn:hover {
          border-color: var(--border-focus);
          color: var(--text-primary);
        }

        .vibe-tag-btn.active {
          background-color: var(--primary-glow);
          border-color: var(--primary);
          color: var(--primary);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.95rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .submit-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }

        @media (max-width: 580px) {
          .form-row.flex-row {
            flex-direction: column;
          }
          .create-form {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};
