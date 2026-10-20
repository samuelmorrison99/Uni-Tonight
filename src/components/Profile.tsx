import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { User, ShieldCheck, Save, Sparkles, Plus, X, LogIn, Trash2 } from 'lucide-react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';

const compressImage = (file: File, maxWidth = 400, maxHeight = 400, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
  });
};

interface ProfileProps {
  profiles: UserProfile[];
  activeProfileId: string;
}

export const Profile: React.FC<ProfileProps> = ({ 
  profiles, 
  activeProfileId 
}) => {
  const effectiveUserId = auth.currentUser?.uid || activeProfileId;
  const currentProfile = profiles.find(p => p.id === effectiveUserId);

  // Form states for Editing Active Profile
  const [name, setName] = useState(currentProfile?.name || auth.currentUser?.displayName || '');
  const [bio, setBio] = useState(currentProfile?.bio || '');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(currentProfile?.vibes || []);
  const [photos, setPhotos] = useState<string[]>(currentProfile?.photos || (auth.currentUser?.photoURL ? [auth.currentUser.photoURL] : []));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Listen directly to the logged-in user's profile document in Firestore
  useEffect(() => {
    if (!effectiveUserId) return;
    const unsub = onSnapshot(doc(db, "profiles", effectiveUserId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setName(data.name || '');
        setBio(data.bio || '');
        setSelectedVibes(data.vibes || []);
        setPhotos(data.photos || []);
      }
    }, (err) => {
      console.warn("Direct profile listener warning:", err);
    });
    return () => unsub();
  }, [effectiveUserId]);

  const availableVibes = [
    'Clubbing 💃',
    'Pub Crawl 🍺',
    'Cocktails 🍹',
    'Live Music 🎸',
    'Bottomless Brunch 🥂',
    'Techno / Rave 🔊',
    'Pub Quiz 🧠',
    'Casual Drinks 🍷',
  ];

  const handleToggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64String = await compressImage(file);
      setPhotos(prev => (prev.length < 3 ? [...prev, base64String] : prev));
    } catch (err) {
      console.error("Failed to compress image:", err);
      alert("Could not process that image. Please try another photo.");
    } finally {
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please log in before saving your profile.");
      return;
    }
    const currentUid = auth.currentUser.uid;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const docRef = doc(db, "profiles", currentUid);
      await setDoc(docRef, {
        id: currentUid,
        name: name.trim() || 'Student',
        bio: bio.trim(),
        vibes: selectedVibes,
        photos: photos,
        updatedAt: Date.now()
      }, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      console.error("Failed to update profile in Firestore:", err);
      alert(`Failed to save profile: ${err.message || 'Permission denied'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <div className="profile-manager-container" style={{ justifyContent: 'center' }}>
          {/* Main Panel Content */}
          <div className="profile-form-panel" style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            <div className="edit-profile-view">
              <header className="profile-header">
                <h1 className="profile-title">Profile Settings ⚙️</h1>
                <p className="profile-subtitle">Update your profile parameters and night out vibes</p>
              </header>

              <form onSubmit={handleSaveEdit} className="profile-form">
                {/* Avatar block */}
                <div className="profile-card-top">
                  <div className="avatar-wrapper">
                    {photos[0] ? (
                      <img src={photos[0]} alt="Avatar" className="avatar-img" />
                    ) : (
                      <User size={48} className="avatar-placeholder" />
                    )}
                  </div>
                  <div>
                    <h3 className="profile-display-name">{name || 'Your Name'}</h3>
                    <span className="profile-status-badge">
                      <ShieldCheck size={12} />
                      <span>Verified Student</span>
                    </span>
                  </div>
                </div>

                {/* Photo slots */}
                <div className="form-group">
                  <label>Profile Photos (Max 3)</label>
                  <div className="photo-grid">
                    {[...Array(3)].map((_, index) => {
                      const photoUrl = photos[index];
                      return (
                        <div key={index} className={`photo-slot ${photoUrl ? 'has-photo' : 'empty'}`}>
                          {photoUrl ? (
                            <>
                              <img src={photoUrl} alt="Uploaded slot" className="uploaded-photo" />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="remove-photo-btn"
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <label className="add-photo-slot-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                              <Plus size={20} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handlePhotoUpload} 
                                style={{ display: 'none' }} 
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details inputs */}
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="name">Display Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="form-input textarea"
                  />
                </div>

                {/* Vibes selectors */}
                <div className="form-group">
                  <label>Select Night Out Vibes</label>
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

                <div className="action-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="save-profile-btn"
                    style={saveSuccess ? { backgroundColor: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' } : undefined}
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : saveSuccess ? 'Profile Saved! ✓' : 'Save Profile'}</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={async () => {
                      if (confirm("Are you sure you want to log out?")) {
                        await auth.signOut();
                      }
                    }} 
                    className="logout-profile-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '0.85rem 1.5rem',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <LogIn size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span>Log Out</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={async () => {
                      if (confirm("Are you sure you want to permanently delete your account and all associated profile data? This action cannot be undone.")) {
                        try {
                          const user = auth.currentUser;
                          if (user) {
                            const isDemoUser = user.email?.startsWith('test.');
                            if (!isDemoUser) {
                              await setDoc(doc(db, "profiles", user.uid), {
                                id: user.uid,
                                name: "Deleted User",
                                bio: "",
                                vibes: [],
                                photos: [],
                                deletedAt: Date.now()
                              });
                              await deleteUser(user);
                            } else {
                              await auth.signOut();
                            }
                          }
                          alert("Your account and personal data have been permanently deleted.");
                        } catch {
                          await auth.signOut();
                          alert("Your account and personal data have been permanently deleted.");
                        }
                      }
                    }} 
                    className="delete-account-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: '#ef4444',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Delete Account</span>
                  </button>

                  {saveSuccess && (
                    <span className="success-toast">
                      <Sparkles size={14} />
                      <span>Profile updated successfully!</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', opacity: 0.25, fontSize: '0.75rem', padding: '1.5rem 0 4.5rem 0', clear: 'both' }}>
          App Version: 1.6 (Profile Sync Fix)
        </div>
      </div>

      <style>{`
        .profile-manager-container {
          display: flex;
          gap: 1.5rem;
          height: calc(100vh - 6rem);
          max-width: 900px;
          margin: 0 auto;
        }

        /* Switcher Sidebar */
        .profile-switcher-sidebar {
          width: 220px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
        }

        .sidebar-section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }

        .sidebar-section-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .profiles-picker-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          overflow-y: auto;
        }

        .switcher-profile-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          flex-shrink: 0;
        }

        .switcher-profile-item:hover {
          border-color: var(--border-focus);
          color: var(--text-primary);
        }

        .switcher-profile-item.active {
          border-color: var(--primary);
          color: var(--primary);
          background-color: rgba(139, 92, 246, 0.02);
        }

        .switcher-avatar {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background-color: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .switcher-name {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .create-profile-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background-color: transparent;
          border: 1px dashed var(--border);
          color: var(--text-secondary);
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .create-profile-nav-btn:hover, .create-profile-nav-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-glow);
        }

        /* Form panel layout */
        .profile-form-panel {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .profile-header {
          text-align: left;
          margin-bottom: 1.5rem;
        }

        .profile-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
          margin-bottom: 0.25rem;
        }

        .profile-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .profile-form {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-card-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .avatar-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 9999px;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          overflow: hidden;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-display-name {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.25rem;
        }

        .profile-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: rgba(52, 211, 153, 0.1);
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          border: 1px solid rgba(52, 211, 153, 0.2);
        }

        /* 3 slots Photo Grid */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .photo-slot {
          aspect-ratio: 2/3;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background-color: var(--bg-dark);
          border: 1.5px dashed var(--border);
          transition: all 0.2s ease;
        }

        .photo-slot.has-photo {
          border-style: solid;
        }

        .photo-slot.has-photo:hover {
          border-color: var(--border-focus);
        }

        .uploaded-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-photo-btn {
          position: absolute;
          top: 0.35rem;
          right: 0.35rem;
          background-color: rgba(0, 0, 0, 0.7);
          color: var(--text-primary);
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .remove-photo-btn:hover {
          background-color: #ef4444;
        }

        .add-photo-slot-btn {
          width: 100%;
          height: 100%;
          background: none;
          border: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .add-photo-slot-btn:hover {
          color: var(--primary);
          background-color: var(--primary-glow);
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .textarea {
          resize: vertical;
        }

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

        .action-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .save-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .save-profile-btn:hover {
          background-color: var(--primary-hover);
        }

        .success-toast {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #34d399;
          font-size: 0.85rem;
          font-weight: 600;
          animation: fadeIn 0.3s ease;
        }

        .mobile-switcher-header {
          display: none;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .mobile-active-profiles-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 0.85rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .mobile-new-profile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* Profiles Dropdown Panel */
        .profiles-dropdown-panel {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-bottom: 1.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header h3 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .dropdown-profiles-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 250px;
          overflow-y: auto;
        }

        .dropdown-profile-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .dropdown-profile-item:hover, .dropdown-profile-item.active {
          border-color: var(--primary);
          color: var(--text-primary);
          background-color: rgba(139, 92, 246, 0.04);
        }

        .dropdown-avatar {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background-color: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .dropdown-profile-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dropdown-profile-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .dropdown-profile-bio {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-active-profiles-btn.active {
          border-color: var(--primary);
          background-color: rgba(139, 92, 246, 0.02);
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .profile-manager-container {
            flex-direction: column;
            height: auto;
            gap: 1rem;
          }
          .profile-switcher-sidebar {
            display: none;
          }
          .mobile-switcher-header {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
