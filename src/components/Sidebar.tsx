import React from 'react';
import { Flame, Compass, PlusCircle, Map, Moon, User, LogOut, Globe } from 'lucide-react';
import { auth } from '../firebase';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  pendingRequestsCount?: number;
  unreadMessagesCount?: number;
  onBackToWebsite?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  pendingRequestsCount = 0,
  unreadMessagesCount = 0,
  onBackToWebsite
}) => {
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Flame, badge: pendingRequestsCount },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'mynight', label: 'My Night', icon: Moon, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-logo" onClick={() => setActivePage('feed')}>
          <Flame className="logo-icon" size={28} />
          <span className="logo-text">Tonight</span>
        </div>
        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="nav-badge">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {onBackToWebsite && (
          <button
            type="button"
            onClick={onBackToWebsite}
            className="nav-item"
            style={{
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <Globe size={18} className="nav-icon" />
            <span>Website Home</span>
          </button>
        )}

        {/* Sign Out Button at the bottom of desktop sidebar */}
        <button
          type="button"
          onClick={async () => {
            if (confirm("Are you sure you want to log out?")) {
              await auth.signOut();
            }
          }}
          className="nav-item"
          style={{ 
            marginTop: onBackToWebsite ? '0' : 'auto', 
            color: '#f87171', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backgroundColor: 'rgba(239, 68, 68, 0.02)'
          }}
        >
          <LogOut size={20} className="nav-icon" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-navbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={22} />
                {item.badge && item.badge > 0 ? (
                  <span className="mobile-nav-badge"></span>
                ) : null}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Extra styles for layout logic */}
      <style>{`
        .desktop-sidebar {
          width: 240px;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          min-height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          cursor: pointer;
          color: var(--text-primary);
        }

        .logo-icon {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          width: 100%;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--primary-glow);
          color: var(--primary);
          font-weight: 600;
        }

        .nav-icon {
          transition: transform 0.2s ease;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.05);
        }

        /* Mobile navbar styles */
        .mobile-navbar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(18, 18, 21, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--border);
          justify-content: space-around;
          padding: 0.75rem 0.5rem;
          z-index: 1000;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .mobile-nav-item.active {
          color: var(--primary);
        }

        .mobile-nav-label {
          font-size: 0.7rem;
          font-weight: 500;
        }

        .nav-badge {
          background-color: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: auto;
        }

        .mobile-nav-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 10px;
          height: 10px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 2px solid var(--bg-dark);
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none;
          }
          .mobile-navbar {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
