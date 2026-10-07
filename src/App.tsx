import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { Create } from './components/Create';
import { Explore } from './components/Explore';
import { MapView } from './components/Map';
import { MyNight } from './components/MyNight';
import { Profile } from './components/Profile';
import { collection, onSnapshot, addDoc, updateDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth, messaging } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import type { User as FirebaseUser } from 'firebase/auth';
import { AuthGate } from './components/AuthGate';
import type { CrewPlan, UserProfile, Venue } from './types';
import { getCurrentCoordinates } from './utils/geolocation';
import { initializeAdMob, showBannerAd } from './utils/admob';


// Hardcoded neighborhoods lookup per city
export const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  'Liverpool': ['Concert Square', 'Smithdown Road', 'Mathew Street', 'Bold Street', 'City Centre'],
  'London': ['Soho', 'Shoreditch', 'Camden Town', 'Greenwich', 'Westminster'],
  'Manchester': ['Northern Quarter', 'Spinningfields', 'Deansgate', 'Fallowfield', 'Ancoats'],
  'Leeds': ['Headingley', 'City Centre', 'Call Lane', 'Chapel Allerton', 'Woodhouse'],
  'Newcastle': ['Jesmond', 'Bigg Market', 'Quayside', 'Ouseburn', 'Grey Street']
};

function App() {
  const [activePage, setActivePage] = useState<string>('feed');
  const [isGoingOut, setIsGoingOut] = useState<boolean>(true);
  const [currentCity, setCurrentCity] = useState<string>('Liverpool');

  // Lifted States for sharing user location & search radius (default 3 miles, i.e., 4828 meters)
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(4828);

  useEffect(() => {
    getCurrentCoordinates()
      .then(async ([latitude, longitude]) => {
        setUserCoords([latitude, longitude]);
        // Bypassed reverse geocoding to lock MVP to Liverpool only.
      })
      .catch(err => {
        console.log("Auto-location detection bypassed on startup: ", err);
      });
  }, []);

  // Default template profiles for bootstrapping
  const DEFAULT_INITIAL_PROFILES: UserProfile[] = [
    {
      id: 'u1',
      name: 'Alex Mercer',
      bio: 'Computer Science student. Down for house music, pub quizzes and spontaneous weekend crawls.',
      vibes: ['Clubbing 💃', 'Pub Crawl 🍺', 'Techno / Rave 🔊'],
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'u2',
      name: 'Chloe Jones',
      bio: 'First year literature student. Love acoustic sets, cocktails and meeting new crews!',
      vibes: ['Cocktails 🍹', 'Live Music 🎸', 'Casual Drinks 🍷'],
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'u3',
      name: 'Luke Higgins',
      bio: 'Loves rock music and pub crawls. Always up for a cold pint of Guinness.',
      vibes: ['Pub Crawl 🍺', 'Live Music 🎸', 'Pub Quiz 🧠'],
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60'
      ]
    }
  ];

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize AdMob
  useEffect(() => {
    const setupAds = async () => {
      await initializeAdMob();
      // Using Google's official Test Ad Unit ID for Android banners
      await showBannerAd('ca-app-pub-3940256099942544/6300978111');
    };
    setupAds();
  }, []);

  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_INITIAL_PROFILES);
  interface ToastNotification {
    id: string;
    message: string;
    type: 'success' | 'info';
  }

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const prevPlansRef = useRef<CrewPlan[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('u1');

  const triggerNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setActiveProfileId(user.uid);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Request FCM Push Permissions & Save Token
  useEffect(() => {
    if (!currentUser || !messaging) return;
    const requestPushPermissions = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging!, { 
            vapidKey: 'BOstGTxLOzC4-FBWBm1NCbO07MbprgGV3t05KskOFHNfIf8dwKk5zmrhYc1MQ9tgpNQm9bPNt7k069jOpMx5mLs' 
          });
          if (currentToken) {
            const profileRef = doc(db, 'profiles', currentUser.uid);
            await updateDoc(profileRef, { fcmToken: currentToken }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Failed to get push token:', err);
      }
    };
    requestPushPermissions();
  }, [currentUser]);

  // Sync Profiles collection in real-time
  useEffect(() => {
    const checkAndBootstrap = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        if (querySnapshot.empty) {
          const batch = writeBatch(db);
          DEFAULT_INITIAL_PROFILES.forEach((profile) => {
            const newDocRef = doc(db, "profiles", profile.id);
            batch.set(newDocRef, profile);
          });
          await batch.commit();
        }
      } catch (err) {
        console.warn("Firestore profiles bootstrap warning:", err);
      }
    };

    checkAndBootstrap().then(() => {
      const unsubscribe = onSnapshot(collection(db, "profiles"), (snapshot) => {
        const fetchedProfiles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProfile[];
        if (fetchedProfiles.length > 0) {
          setProfiles(fetchedProfiles);
        }
      }, (error) => {
        console.warn("Firestore profiles listener warning:", error);
      });

      return () => unsubscribe();
    });
  }, []);

  const activeProfile = profiles.find(p => p.id === (currentUser?.uid || activeProfileId)) || profiles[0];

  // Default plans across different UK cities
  // Default plans template used for bootstrapping if DB is empty
  const DEFAULT_INITIAL_PLANS: Omit<CrewPlan, 'id'>[] = [
    {
      title: 'hip hop night',
      category: 'Dancing',
      host: 'raz',
      location: 'The Raz (Blue Angel), City Centre',
      time: 'Tonight - 21:00',
      attendeesCount: 3,
      joined: true,
      description: 'Heading to Raz for the classic Hip Hop night! Pre-drinks at Concert Square first.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
      maxPeople: 10,
      genderPreference: 'Any',
      matchingType: 'Auto-join',
      vibes: ['Dancing 💃', 'Cheap Drinks 💸']
    },
    {
      title: 'Heebles',
      category: 'Party',
      host: 'Chloe Jones',
      location: 'Heebie Jeebies, Concert Square',
      time: 'Tonight - 22:00',
      attendeesCount: 2,
      joined: false,
      description: 'Starting at Heebie Jeebies. Getting some drinks and heading inside around 11.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
      maxPeople: 6,
      genderPreference: 'Girls Only',
      matchingType: 'Request to join',
      vibes: ['Cocktails 🍹', 'Dancing 💃']
    },
    {
      title: 'Smithdown Pub Crawl 🍺',
      category: 'Bar Hopping',
      host: 'Ben',
      location: 'The Brookhouse, Smithdown Road',
      time: 'Tonight - 19:30',
      attendeesCount: 6,
      joined: false,
      description: 'Hitting up the Brookhouse, Handyman and other pubs along Smithdown. Join the crawl!',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60',
      maxPeople: 20,
      genderPreference: 'Any',
      matchingType: 'Auto-join',
      vibes: ['Beer 🍺', 'Chatting 💬']
    },
    {
      title: 'Soho Cocktail & Jazz Night 🎺',
      category: 'Dinner & Drinks',
      host: 'Sarah',
      location: 'Ronnie Scott\'s, Soho',
      time: 'Tonight - 20:30',
      attendeesCount: 4,
      joined: false,
      description: 'Looking for a group of fellow music lovers to grab cocktails and watch some live jazz in Soho tonight.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
      maxPeople: 6,
      genderPreference: 'Any',
      matchingType: 'Request to join',
      vibes: ['Cocktails 🍹', 'Live Music 🎸']
    },
    {
      title: 'Shoreditch Pub Crawl 🍻',
      category: 'Bar Hopping',
      host: 'Marcus',
      location: 'The Old Blue Last, Shoreditch',
      time: 'Tonight - 19:00',
      attendeesCount: 7,
      joined: false,
      description: 'Doing a crawl around Shoreditch’s best student bars. Hitting 4-5 venues, ending with cheap drinks!',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60',
      maxPeople: 15,
      genderPreference: 'Any',
      matchingType: 'Auto-join',
      vibes: ['Beer 🍺', 'Cheap Drinks 💸']
    },
    {
      title: 'Northern Quarter Craft Beer Tour',
      category: 'Bar Hopping',
      host: 'Liam',
      location: 'The Abel Heywood, Northern Quarter',
      time: 'Tonight - 20:00',
      attendeesCount: 3,
      joined: false,
      description: 'Checking out the craft beer spots in NQ tonight. Casual pints, good chats, and music.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60',
      maxPeople: 8,
      genderPreference: 'Any',
      matchingType: 'Auto-join',
      vibes: ['Beer 🍺', 'Chatting 💬']
    }
  ];

  const [plans, setPlans] = useState<CrewPlan[]>([]);

  // Listen to Cloud Firestore collection for Crews/Plans in real-time
  useEffect(() => {
    const checkAndBootstrap = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "crews"));
        if (querySnapshot.empty) {
          const batch = writeBatch(db);
          DEFAULT_INITIAL_PLANS.forEach((plan) => {
            const newDocRef = doc(collection(db, "crews"));
            batch.set(newDocRef, plan);
          });
          await batch.commit();
        }
      } catch (err) {
        console.warn("Firestore bootstrap warning:", err);
      }
    };

    checkAndBootstrap().then(() => {
      const unsubscribe = onSnapshot(collection(db, "crews"), (snapshot) => {
        const fetchedPlans = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<CrewPlan, 'id'>;
          const attendeeIds = data.attendeeIds || [];
          const requestIds = data.requestIds || [];
          
          return {
            id: doc.id,
            ...data,
            attendeeIds,
            requestIds,
            // Calculate joined status based on whether current user's UID is in attendeeIds
            joined: currentUser ? attendeeIds.includes(currentUser.uid) : false,
            attendeesCount: attendeeIds.length > 0 ? attendeeIds.length : (data.attendeesCount || 1)
          };
        }) as CrewPlan[];

        // Intercept changes to trigger real-time notifications
        if (currentUser && prevPlansRef.current.length > 0) {
          fetchedPlans.forEach(newPlan => {
            const oldPlan = prevPlansRef.current.find(p => p.id === newPlan.id);
            if (oldPlan) {
              const wasPending = oldPlan.requestIds?.includes(currentUser.uid);
              const isPending = newPlan.requestIds?.includes(currentUser.uid);
              const isAttendee = newPlan.attendeeIds?.includes(currentUser.uid);

              if (wasPending && !isPending) {
                if (isAttendee) {
                  triggerNotification(`Your request to join "${newPlan.title}" has been approved! 🎉`, 'success');
                } else {
                  triggerNotification(`Your request to join "${newPlan.title}" was declined.`, 'info');
                }
              }
            }
          });
        }

        prevPlansRef.current = fetchedPlans;
        setPlans(fetchedPlans);
      }, (error) => {
        console.warn("Firestore listener warning:", error);
      });

      return () => unsubscribe();
    });
  }, [currentUser]);

  // Default initial venues
  const [venues] = useState<Venue[]>([
    {
      id: 'v1',
      name: 'Heebie Jeebies',
      area: 'Concert Square',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60',
      type: 'Bar / Club',
      rating: 4.5,
      closingTime: '03:00 AM',
      isOpen: true,
      coordinates: { top: '55%', left: '42%' },
      vibes: ['Party', 'Dancing', 'Cocktails']
    },
    {
      id: 'v2',
      name: 'The Raz (Blue Angel)',
      area: 'City Centre',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=60',
      type: 'Student Club',
      rating: 4.7,
      closingTime: '04:00 AM',
      isOpen: true,
      coordinates: { top: '45%', left: '50%' },
      vibes: ['Party', 'Cheap Drinks', 'Dancing']
    }
  ]);

  const toggleRSVP = async (id: string) => {
    if (!currentUser) return;
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    try {
      const docRef = doc(db, "crews", id);
      const attendeeIds = plan.attendeeIds || [];
      const requestIds = plan.requestIds || [];

      if (plan.matchingType === 'Request to join') {
        if (requestIds.includes(currentUser.uid)) {
          // Remove request
          await updateDoc(docRef, {
            requestIds: requestIds.filter(uid => uid !== currentUser.uid)
          });
        } else if (!attendeeIds.includes(currentUser.uid)) {
          // Add request
          await updateDoc(docRef, {
            requestIds: [...requestIds, currentUser.uid]
          });
        }
      } else {
        // Auto-join
        if (attendeeIds.includes(currentUser.uid)) {
          // Leave crew (but don't leave if they are the host)
          if (plan.hostId !== currentUser.uid) {
            await updateDoc(docRef, {
              attendeeIds: attendeeIds.filter(uid => uid !== currentUser.uid)
            });
          }
        } else {
          // Join crew
          await updateDoc(docRef, {
            attendeeIds: [...attendeeIds, currentUser.uid]
          });
        }
      }
    } catch (err) {
      console.error("Failed to update RSVP in Firestore:", err);
    }
  };

  const handleRequestAction = async (planId: string, requesterUid: string, action: 'approve' | 'decline') => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    try {
      const docRef = doc(db, "crews", planId);
      const attendeeIds = plan.attendeeIds || [];
      const requestIds = plan.requestIds || [];

      if (action === 'approve') {
        await updateDoc(docRef, {
          requestIds: requestIds.filter(uid => uid !== requesterUid),
          attendeeIds: [...attendeeIds, requesterUid]
        });
      } else {
        await updateDoc(docRef, {
          requestIds: requestIds.filter(uid => uid !== requesterUid)
        });
      }
    } catch (err) {
      console.error("Failed to handle request action in Firestore:", err);
    }
  };

  const addPlan = async (newPlanData: Omit<CrewPlan, 'id' | 'attendeesCount' | 'joined' | 'host'>) => {
    if (!currentUser) return;
    const newPlan = {
      ...newPlanData,
      host: activeProfile.name,
      hostId: currentUser.uid,
      city: currentCity,
      attendeeIds: [currentUser.uid],
      requestIds: [],
      attendeesCount: 1,
      joined: true,
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60'
    };
    try {
      await addDoc(collection(db, "crews"), newPlan);
    } catch (err) {
      console.error("Failed to add plan to Firestore:", err);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'feed':
        return (
          <Feed 
            plans={plans} 
            toggleRSVP={toggleRSVP} 
            isGoingOut={isGoingOut} 
            setIsGoingOut={setIsGoingOut}
            currentCity={currentCity}
            setCurrentCity={setCurrentCity}
            setUserCoords={setUserCoords}
            currentUser={currentUser}
            handleRequestAction={handleRequestAction}
            profiles={profiles}
          />
        );
      case 'create':
        return <Create addPlan={addPlan} setActivePage={setActivePage} />;
      case 'explore':
        return (
          <Explore 
            currentCity={currentCity} 
            userCoords={userCoords} 
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
          />
        );
      case 'map':
        return (
          <MapView 
            plans={plans} 
            toggleRSVP={toggleRSVP} 
            venues={venues} 
            userCoords={userCoords}
            setUserCoords={setUserCoords}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
          />
        );
      case 'mynight':
        return <MyNight plans={plans} toggleRSVP={toggleRSVP} profiles={profiles} activeProfile={activeProfile} />;
      case 'profile':
        return (
          <Profile 
            profiles={profiles} 
            activeProfileId={currentUser?.uid || activeProfileId} 
          />
        );
      default:
        return (
          <Feed 
            plans={plans} 
            toggleRSVP={toggleRSVP} 
            isGoingOut={isGoingOut} 
            setIsGoingOut={setIsGoingOut} 
            currentCity={currentCity}
            setCurrentCity={setCurrentCity}
            setUserCoords={setUserCoords}
            currentUser={currentUser}
            handleRequestAction={handleRequestAction}
            profiles={profiles}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        width: '100vw', 
        backgroundColor: 'var(--bg-dark)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthGate onAuthSuccess={(uid) => setActiveProfileId(uid)} />;
  }

  const pendingRequestsCount = plans
    .filter(p => p.hostId === currentUser.uid)
    .reduce((acc, curr) => acc + (curr.requestIds?.length || 0), 0);
  
  // To do: wire up unread messages count globally (currently handled inside MyNight)
  const unreadMessagesCount = 0;

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <div className="toast-notifications-container" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '360px',
        width: 'calc(100% - 40px)'
      }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            background: 'rgba(18, 18, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${n.type === 'success' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
            padding: '12px 18px',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>{n.type === 'success' ? '✨' : 'ℹ️'}</span>
            <span>{n.message}</span>
          </div>
        ))}
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>

      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        pendingRequestsCount={pendingRequestsCount} 
        unreadMessagesCount={unreadMessagesCount} 
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
