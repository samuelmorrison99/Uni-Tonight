import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { LogIn, Mail, Lock, UserPlus, AlertCircle, Compass, ArrowLeft } from 'lucide-react';

interface AuthGateProps {
  onAuthSuccess: (uid: string) => void;
  onBackToWebsite?: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthSuccess, onBackToWebsite }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter a display name.');
        }

        const emailLower = email.toLowerCase().trim();
        const isStudentEmail = emailLower.endsWith('.ac.uk') || emailLower.endsWith('.edu');
        if (!isStudentEmail) {
          throw new Error('Please register using a valid student email address ending in .ac.uk or .edu');
        }
        
        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Create profile document in Firestore
        const initialProfile = {
          id: user.uid,
          name: displayName,
          bio: 'First-year student. Down for spontaneous night outs and meeting new crews!',
          vibes: [],
          photos: []
        };
        await setDoc(doc(db, "profiles", user.uid), initialProfile);
        onAuthSuccess(user.uid);
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user.uid);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let errMsg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use by another account.';
      } else if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const emailLower = (user.email || '').toLowerCase().trim();
      const isStudentEmail = emailLower.endsWith('.ac.uk') || emailLower.endsWith('.edu');
      if (!isStudentEmail) {
        await auth.signOut();
        throw new Error('Please use a Google account linked to a student email ending in .ac.uk or .edu');
      }

      // Check if profile already exists in Firestore
      const docRef = doc(db, "profiles", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create new profile document for first-time Google sign up
        const initialProfile = {
          id: user.uid,
          name: user.displayName || 'New Student',
          bio: 'Signed in with Google. Down to meet new crews!',
          vibes: [],
          photos: user.photoURL ? [user.photoURL] : []
        };
        await setDoc(docRef, initialProfile);
      }
      onAuthSuccess(user.uid);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gate-page">
      <div className="auth-background-effects">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <div className="auth-card-container">
        {onBackToWebsite && (
          <button
            type="button"
            onClick={onBackToWebsite}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem',
              padding: 0
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to unitonight.com</span>
          </button>
        )}
        <header className="auth-header">
          <div className="logo-badge">
            <Compass size={28} className="logo-icon" />
          </div>
          <h1>UniTonight</h1>
          <p className="auth-subtitle">Discover active student crews on your campus in real time</p>
        </header>

        <div className="auth-tabs">
          <button 
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div className="auth-input-group">
              <label htmlFor="authName">Display Name</label>
              <div className="input-wrapper">
                <input 
                  id="authName"
                  type="text" 
                  placeholder="e.g. Rob Marriott"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required 
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="authEmail">Student Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                id="authEmail"
                type="email" 
                placeholder="you@university.ac.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="auth-input with-icon"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="authPassword">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                id="authPassword"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
                className="auth-input with-icon"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <div className="divider-line"></div>
          <span>or continue with</span>
          <div className="divider-line"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading} 
          className="auth-google-btn"
          type="button"
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.84 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.56l3.85 2.99c.92-2.76 3.51-4.51 6.67-4.51z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.61z"/>
            <path fill="#FBBC05" d="M5.33 14.45c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.48 6.86C.54 8.76 0 10.83 0 13s.54 4.24 1.48 6.14l3.85-2.99-.03-.7z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-3.16 0-5.75-1.75-6.67-4.51L1.48 19.8C3.4 21.66 7.37 23 12 23z"/>
          </svg>
          <span>Google</span>
        </button>

        {/* Quick Test Accounts Panel */}
        <div className="demo-accounts-panel" style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%'
        }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'center', margin: 0 }}>
            ⚡ Quick Test Logins
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { name: 'Rob', email: 'test.rob@university.ac.uk' },
              { name: 'Sam', email: 'test.sam@university.ac.uk' },
              { name: 'Chloe', email: 'test.chloe@university.ac.uk' },
              { name: 'Luke', email: 'test.luke@university.ac.uk' }
            ].map(testUser => (
              <button
                key={testUser.name}
                type="button"
                onClick={async () => {
                  setEmail(testUser.email);
                  setPassword('Password123');
                  setError(null);
                  setLoading(true);
                  try {
                    const userCredential = await signInWithEmailAndPassword(auth, testUser.email, 'Password123');
                    onAuthSuccess(userCredential.user.uid);
                  } catch (err: any) {
                    setError(err.message || 'Quick login failed.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="demo-login-btn"
              >
                Sign in as {testUser.name}
              </button>
            ))}
          </div>
        </div>

        <footer className="auth-footer">
          <p>By signing in, you agree to connect with students on campus safely.</p>
        </footer>
      </div>

      <style>{`
        .auth-gate-page {
          min-height: 100vh;
          width: 100vw;
          background-color: var(--bg-dark);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          overflow-y: auto;
          padding: 2rem 1rem;
        }

        .auth-background-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .glow-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(120px);
          opacity: 0.12;
        }

        .orb-1 {
          top: 10%;
          right: 15%;
          width: 400px;
          height: 400px;
          background-color: var(--primary);
        }

        .orb-2 {
          bottom: 10%;
          left: 15%;
          width: 450px;
          height: 450px;
          background: #3b82f6;
        }

        .auth-card-container {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 28px;
          width: 100%;
          max-width: 420px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          z-index: 2;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-badge {
          background-color: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.75rem;
          border-radius: 18px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .auth-header h1 {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .auth-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
          max-width: 320px;
        }

        .auth-tabs {
          display: flex;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          padding: 0.25rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
        }

        .auth-tab-btn {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.65rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-tab-btn.active {
          background-color: var(--bg-card);
          color: var(--text-primary);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .auth-error-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          background-color: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .auth-error-banner span {
          flex: 1;
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .auth-input-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
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

        .auth-input.with-icon {
          padding-left: 2.75rem;
        }

        .auth-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .auth-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.9rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .auth-submit-btn:hover {
          background-color: var(--primary-hover);
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background-color: var(--border);
        }

        .auth-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 0.85rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-google-btn:hover {
          border-color: var(--border-focus);
          background-color: rgba(255, 255, 255, 0.02);
        }

        .google-icon {
          width: 18px;
          height: 18px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
