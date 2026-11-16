import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CrewPlan, UserProfile, DirectMessage, CrewChatMessage } from '../types';
import { Send, MessageCircleCode, Users, MessageSquareCode } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, arrayUnion, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface MyNightProps {
  plans: CrewPlan[];
  toggleRSVP: (id: string) => void;
  profiles: UserProfile[];
  activeProfile: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  createdAt: number;
}

export const MyNight: React.FC<MyNightProps> = ({ plans, toggleRSVP, profiles, activeProfile }) => {
  const [activeTab, setActiveTab] = useState<'crews' | 'dms'>('crews');
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const currentUserId = auth.currentUser?.uid || activeProfile.id;
  
  // Expiration check: hide joined crews if their scheduled time is older than 6 hours
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  const joinedPlans = plans.filter(p => 
    p.joined && (!p.eventTimestamp || (Date.now() - p.eventTimestamp < SIX_HOURS_MS))
  );
  const otherUsers = profiles.filter(
    u => u.id !== currentUserId && !blockedUserIds.includes(u.id) && !u.deletedAt && u.name !== 'Deleted User'
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    joinedPlans.length > 0 ? joinedPlans[0].id : null
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    otherUsers.length > 0 ? otherUsers[0].id : null
  );

  // Ensure a plan/user is auto-selected once Firestore finishes loading
  useEffect(() => {
    if ((!selectedPlanId || !joinedPlans.some(p => p.id === selectedPlanId)) && joinedPlans.length > 0) {
      setSelectedPlanId(joinedPlans[0].id);
    }
  }, [joinedPlans, selectedPlanId]);

  useEffect(() => {
    if ((!selectedUserId || !otherUsers.some(u => u.id === selectedUserId)) && otherUsers.length > 0) {
      setSelectedUserId(otherUsers[0].id);
    }
  }, [otherUsers, selectedUserId]);

  const [messageText, setMessageText] = useState('');
  
  // Real-time group chats from subcollection (when permitted by rules)
  const [realtimeGroupChats, setRealtimeGroupChats] = useState<Record<string, ChatMessage[]>>({});
  // Real-time direct chats from subcollection (when permitted by rules)
  const [realtimeDmChats, setRealtimeDmChats] = useState<Record<string, ChatMessage[]>>({});
  // Local/optimistic state backed by localStorage for instant persistence across app restarts
  const [optimisticDMs, setOptimisticDMs] = useState<DirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unitonight_cached_dms_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [optimisticCrewMsgs, setOptimisticCrewMsgs] = useState<CrewChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unitonight_cached_crew_msgs_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist local cache whenever optimistic messages update
  useEffect(() => {
    try {
      localStorage.setItem('unitonight_cached_dms_v1', JSON.stringify(optimisticDMs));
    } catch {
      // Ignore storage quota errors
    }
  }, [optimisticDMs]);

  useEffect(() => {
    try {
      localStorage.setItem('unitonight_cached_crew_msgs_v1', JSON.stringify(optimisticCrewMsgs));
    } catch {
      // Ignore storage quota errors
    }
  }, [optimisticCrewMsgs]);

  // Re-sync any cached local DMs that haven't landed in Firestore yet (e.g. if app was closed mid-send)
  useEffect(() => {
    if (!currentUserId || profiles.length === 0) return;
    const myProfile = profiles.find(p => p.id === currentUserId);
    const remoteIds = new Set((myProfile?.directMessages || []).map(m => m.id));
    const unsynced = optimisticDMs.filter(m => m.senderId === currentUserId && !remoteIds.has(m.id));
    if (unsynced.length > 0) {
      setDoc(
        doc(db, 'profiles', currentUserId),
        {
          id: currentUserId,
          directMessages: arrayUnion(...unsynced),
        },
        { merge: true }
      ).catch(() => {});
    }
  }, [currentUserId, profiles, optimisticDMs]);

  const messagesBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === 'crews' && selectedPlanId) {
      const messagesRef = collection(db, 'crews', selectedPlanId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const msgs: ChatMessage[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const createdAtMs =
              typeof data.createdAtMs === 'number'
                ? data.createdAtMs
                : data.createdAt?.toMillis?.() || Date.now();
            const timestamp = new Date(createdAtMs);
            return {
              id: docSnap.id,
              sender: data.senderName || 'Student',
              text: data.text || '',
              time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: data.senderId === currentUserId,
              createdAt: createdAtMs,
            };
          });

          setRealtimeGroupChats(prev => ({
            ...prev,
            [selectedPlanId]: msgs,
          }));
        },
        () => {
          // Subcollection listener fallback handled via profile-synced crewMessages
        }
      );
      return () => unsubscribe();
    }
  }, [activeTab, selectedPlanId, currentUserId]);

  useEffect(() => {
    if (activeTab === 'dms' && selectedUserId && currentUserId) {
      const chatId = [currentUserId, selectedUserId].sort().join('_');
      const messagesRef = collection(db, 'dms', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const msgs: ChatMessage[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const createdAtMs =
              typeof data.createdAt === 'number'
                ? data.createdAt
                : data.createdAt?.toMillis?.() || Date.now();
            const timestamp = new Date(createdAtMs);
            return {
              id: docSnap.id,
              sender: data.senderName || 'Student',
              text: data.text || '',
              time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: data.senderId === currentUserId,
              createdAt: createdAtMs,
            };
          });

          setRealtimeDmChats(prev => ({
            ...prev,
            [chatId]: msgs,
          }));
        },
        () => {
          // Subcollection listener fallback handled via profile-synced directMessages
        }
      );
      return () => unsubscribe();
    }
  }, [activeTab, selectedUserId, currentUserId]);

  // Merge Crew messages from profiles + subcollection + optimistic state
  const activeCrewChat = useMemo<ChatMessage[]>(() => {
    if (!selectedPlanId) return [];
    const byId = new Map<string, ChatMessage>();

    for (const msg of realtimeGroupChats[selectedPlanId] || []) {
      byId.set(msg.id, msg);
    }

    for (const profile of profiles) {
      for (const m of profile.crewMessages || []) {
        if (m.crewId === selectedPlanId) {
          const createdAtMs = typeof m.createdAt === 'number' ? m.createdAt : Date.now();
          byId.set(m.id, {
            id: m.id,
            sender: m.senderName || profile.name || 'Student',
            text: m.text,
            time: new Date(createdAtMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: m.senderId === currentUserId,
            createdAt: createdAtMs,
          });
        }
      }
    }

    for (const m of optimisticCrewMsgs) {
      if (m.crewId === selectedPlanId && !byId.has(m.id)) {
        byId.set(m.id, {
          id: m.id,
          sender: m.senderName,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: m.senderId === currentUserId,
          createdAt: m.createdAt,
        });
      }
    }

    return Array.from(byId.values()).sort((a, b) => a.createdAt - b.createdAt);
  }, [selectedPlanId, realtimeGroupChats, profiles, optimisticCrewMsgs, currentUserId]);

  // Merge Direct messages between currentUserId and selectedUserId from profiles + subcollection + optimistic state
  const activeDmChat = useMemo<ChatMessage[]>(() => {
    if (!selectedUserId || !currentUserId) return [];
    const chatId = [currentUserId, selectedUserId].sort().join('_');
    const byId = new Map<string, ChatMessage>();

    for (const msg of realtimeDmChats[chatId] || []) {
      byId.set(msg.id, msg);
    }

    for (const profile of profiles) {
      for (const m of profile.directMessages || []) {
        const isBetweenPair =
          (m.senderId === currentUserId && m.recipientId === selectedUserId) ||
          (m.senderId === selectedUserId && m.recipientId === currentUserId);
        if (isBetweenPair) {
          const createdAtMs = typeof m.createdAt === 'number' ? m.createdAt : Date.now();
          byId.set(m.id, {
            id: m.id,
            sender: m.senderName || profile.name || 'Student',
            text: m.text,
            time: new Date(createdAtMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: m.senderId === currentUserId,
            createdAt: createdAtMs,
          });
        }
      }
    }

    for (const m of optimisticDMs) {
      const isBetweenPair =
        (m.senderId === currentUserId && m.recipientId === selectedUserId) ||
        (m.senderId === selectedUserId && m.recipientId === currentUserId);
      if (isBetweenPair && !byId.has(m.id)) {
        byId.set(m.id, {
          id: m.id,
          sender: m.senderName,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: m.senderId === currentUserId,
          createdAt: m.createdAt,
        });
      }
    }

    return Array.from(byId.values()).sort((a, b) => a.createdAt - b.createdAt);
  }, [selectedUserId, currentUserId, realtimeDmChats, profiles, optimisticDMs]);

  const activeChat = activeTab === 'crews' ? activeCrewChat : activeDmChat;

  // Auto-scroll to bottom when active conversation messages update
  useEffect(() => {
    if (messagesBodyRef.current) {
      messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
    }
  }, [activeChat.length, activeTab, selectedPlanId, selectedUserId]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const selectedUser = profiles.find(u => u.id === selectedUserId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = messageText.trim();
    if (!trimmedText || !currentUserId) return;

    const senderName = activeProfile.name || auth.currentUser?.displayName || 'Student';
    setMessageText('');

    if (activeTab === 'crews' && selectedPlanId) {
      const msgId = `crew_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const createdAtMs = Date.now();
      const newCrewMsg: CrewChatMessage = {
        id: msgId,
        crewId: selectedPlanId,
        senderId: currentUserId,
        senderName,
        text: trimmedText,
        createdAt: createdAtMs,
      };

      setOptimisticCrewMsgs(prev => {
        const next = [...prev, newCrewMsg];
        try {
          localStorage.setItem('unitonight_cached_crew_msgs_v1', JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });

      try {
        await setDoc(
          doc(db, 'profiles', currentUserId),
          {
            id: currentUserId,
            crewMessages: arrayUnion(newCrewMsg),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to persist crew message to profile:', err);
      }

      setDoc(doc(db, 'crews', selectedPlanId, 'messages', msgId), {
        senderId: currentUserId,
        senderName,
        text: trimmedText,
        createdAtMs,
        createdAt: serverTimestamp(),
      }).catch(() => {});
    } else if (activeTab === 'dms' && selectedUserId) {
      const msgId = `dm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const createdAtMs = Date.now();
      const newDm: DirectMessage = {
        id: msgId,
        senderId: currentUserId,
        senderName,
        recipientId: selectedUserId,
        text: trimmedText,
        createdAt: createdAtMs,
      };

      setOptimisticDMs(prev => {
        const next = [...prev, newDm];
        try {
          localStorage.setItem('unitonight_cached_dms_v1', JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });

      try {
        await setDoc(
          doc(db, 'profiles', currentUserId),
          {
            id: currentUserId,
            directMessages: arrayUnion(newDm),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to persist direct message to Firestore:', err);
      }

      const chatId = [currentUserId, selectedUserId].sort().join('_');
      setDoc(doc(db, 'dms', chatId, 'messages', msgId), {
        ...newDm,
        timestamp: serverTimestamp(),
      }).catch(() => {});
    }
  };

  return (
    <div className="mynight-container">
      <header className="mynight-header">
        <h1 className="mynight-title">Chat Hub 💬</h1>
        <p className="mynight-subtitle">Coordinate with crews and chat with other students</p>
      </header>

      <div className="mynight-layout">
        {/* Navigation Sidebar Pane */}
        <div className="chat-hub-sidebar">
          {/* Sub Navigation Tabs */}
          <div className="sidebar-tabs">
            <button
              onClick={() => setActiveTab('crews')}
              className={`tab-btn ${activeTab === 'crews' ? 'active' : ''}`}
            >
              <Users size={16} />
              <span>Crews ({joinedPlans.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('dms')}
              className={`tab-btn ${activeTab === 'dms' ? 'active' : ''}`}
            >
              <MessageSquareCode size={16} />
              <span>Direct ({otherUsers.length})</span>
            </button>
          </div>

          <div className="chat-list-scroll">
            {/* Crews Tab List */}
            {activeTab === 'crews' && (
              <div className="chat-entries-list">
                {joinedPlans.length === 0 ? (
                  <p className="no-entries">No joined crews</p>
                ) : (
                  joinedPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`chat-entry-item ${selectedPlanId === plan.id ? 'active' : ''}`}
                    >
                      <div className="entry-header">
                        <h4>{plan.title}</h4>
                        <span className="entry-badge">{plan.category}</span>
                      </div>
                      <div className="entry-footer">
                        <span>📍 {plan.location}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Direct Messages Tab List */}
            {activeTab === 'dms' && (
              <div className="chat-entries-list">
                {otherUsers.length === 0 ? (
                  <p className="no-entries">No other active users</p>
                ) : (
                  otherUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`chat-entry-item user-item ${selectedUserId === user.id ? 'active' : ''}`}
                    >
                      <div className="user-avatar">
                        {user.photos?.[0] ? (
                          <img src={user.photos[0]} alt={user.name} className="avatar-img" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div className="user-details">
                        <h4>{user.name}</h4>
                        <span className="user-bio-preview">{user.bio}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Chat Window */}
        <div className="chat-window">
          {activeTab === 'crews' && selectedPlan ? (
            <>
              {/* Crew Chat Header */}
              <div className="chat-window-header">
                <div>
                  <h4>{selectedPlan.title} Group Chat</h4>
                  <span className="header-subtitle">Meeting at {selectedPlan.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => alert(`Reported crew "${selectedPlan.title}" to moderators for review.`)}
                    className="leave-btn"
                    style={{ borderColor: '#f59e0b', color: '#d97706' }}
                  >
                    Report Crew
                  </button>
                  <button 
                    onClick={() => {
                      toggleRSVP(selectedPlan.id);
                      setSelectedPlanId(null);
                    }}
                    className="leave-btn"
                  >
                    Leave Crew
                  </button>
                </div>
              </div>

              {/* Messages Grid */}
              <div className="chat-messages-body" ref={messagesBodyRef}>
                {activeChat.length === 0 ? (
                  <div className="empty-chat-state">
                    <MessageCircleCode size={36} />
                    <p>Send a message to start coordinating with your crew!</p>
                  </div>
                ) : (
                  activeChat.map((msg) => (
                    <div key={msg.id} className={`msg-bubble-row ${msg.isMe ? 'me' : 'other'}`}>
                      {!msg.isMe && <span className="msg-sender">{msg.sender}</span>}
                      <div className="msg-bubble">
                        <p>{msg.text}</p>
                        <span className="msg-time">{msg.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Text Input Form */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Message crew..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="chat-input-field"
                />
                <button type="submit" className="chat-send-btn">
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : activeTab === 'dms' && selectedUser ? (
            <>
              {/* DM Chat Header */}
              <div className="chat-window-header">
                <div className="user-header-info">
                  <div className="header-avatar">
                    {selectedUser.photos?.[0] ? (
                      <img src={selectedUser.photos[0]} alt={selectedUser.name} className="avatar-img" />
                    ) : (
                      selectedUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4>{selectedUser.name}</h4>
                    <span className="header-subtitle">Active Now</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => alert(`Gave ${selectedUser.name} a thumbs up for being reliable! 👍`)}
                    className="leave-btn"
                    style={{ borderColor: '#10b981', color: '#059669' }}
                  >
                    👍 Reliable
                  </button>
                  <button 
                    onClick={() => alert(`Reported ${selectedUser.name} to moderators. We will review this user shortly.`)}
                    className="leave-btn"
                    style={{ borderColor: '#f59e0b', color: '#d97706' }}
                  >
                    Report
                  </button>
                  <button 
                    onClick={() => {
                      setBlockedUserIds(prev => [...prev, selectedUser.id]);
                      setSelectedUserId(null);
                      alert(`Blocked ${selectedUser.name}. You will no longer receive messages from this user.`);
                    }}
                    className="leave-btn"
                  >
                    Block
                  </button>
                </div>
              </div>

              {/* DM Messages Grid */}
              <div className="chat-messages-body" ref={messagesBodyRef}>
                {activeChat.length === 0 ? (
                  <div className="empty-chat-state">
                    <MessageCircleCode size={36} />
                    <p>Start a conversation with {selectedUser.name}!</p>
                  </div>
                ) : (
                  activeChat.map((msg) => (
                    <div key={msg.id} className={`msg-bubble-row ${msg.isMe ? 'me' : 'other'}`}>
                      <div className="msg-bubble">
                        <p>{msg.text}</p>
                        <span className="msg-time">{msg.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DM Text Input Form */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder={`Message ${selectedUser.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="chat-input-field"
                />
                <button type="submit" className="chat-send-btn">
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder-state">
              <MessageCircleCode size={44} className="placeholder-icon" />
              <h3>Select a Conversation</h3>
              <p>Click on one of the conversations in the sidebar to open the chat window.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mynight-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: calc(100vh - 6rem);
        }

        .mynight-header {
          text-align: left;
        }

        .mynight-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.75px;
          margin-bottom: 0.25rem;
        }

        .mynight-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .mynight-layout {
          display: flex;
          gap: 1.5rem;
          flex: 1;
          height: 100%;
          min-height: 480px;
        }

        /* Sidebar Tabs layout */
        .chat-hub-sidebar {
          flex: 1;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          background-color: rgba(255,255,255,0.01);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background-color: rgba(255,255,255,0.01);
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
          background-color: rgba(139, 92, 246, 0.02);
        }

        .chat-list-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .chat-entries-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .no-entries {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 2rem;
        }

        .chat-entry-item {
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-radius: 12px;
          padding: 0.85rem;
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: all 0.2s ease;
        }

        .chat-entry-item:hover {
          border-color: var(--border-focus);
        }

        .chat-entry-item.active {
          border-color: var(--primary);
          background-color: rgba(139, 92, 246, 0.02);
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .entry-header h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .entry-badge {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          background-color: var(--primary-glow);
          color: var(--primary);
        }

        .entry-footer {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* User item inside list */
        .chat-entry-item.user-item {
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background-color: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          overflow: hidden;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .user-details h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .user-bio-preview {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        /* Chat window */
        .chat-window {
          flex: 2;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-window-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-window-header h4 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .header-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .user-header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          overflow: hidden;
          background-color: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .leave-btn {
          background: none;
          border: 1px solid #ef4444;
          color: #f87171;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .leave-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }

        .chat-messages-body {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }

        .empty-chat-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          color: var(--text-muted);
          gap: 0.5rem;
        }

        .msg-bubble-row {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .msg-bubble-row.me {
          align-self: flex-end;
          align-items: flex-end;
        }

        .msg-bubble-row.other {
          align-self: flex-start;
          align-items: flex-start;
        }

        .msg-sender {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          margin-left: 0.5rem;
        }

        .msg-bubble {
          padding: 0.7rem 0.95rem;
          border-radius: 14px;
          position: relative;
        }

        .me .msg-bubble {
          background-color: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .other .msg-bubble {
          background-color: var(--bg-dark);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--border);
        }

        .msg-bubble p {
          font-size: 0.9rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .msg-time {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.5);
          float: right;
          margin-top: 0.25rem;
          margin-left: 0.75rem;
        }

        .other .msg-time {
          color: var(--text-muted);
        }

        /* Input Form */
        .chat-input-bar {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.75rem;
        }

        .chat-input-field {
          flex: 1;
          background-color: var(--bg-dark);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .chat-input-field:focus {
          border-color: var(--primary);
        }

        .chat-send-btn {
          background-color: var(--primary);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .chat-send-btn:hover {
          background-color: var(--primary-hover);
        }

        /* Placeholder */
        .chat-placeholder-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex: 1;
          color: var(--text-muted);
          gap: 1rem;
        }

        .placeholder-icon {
          color: var(--text-muted);
        }

        .chat-placeholder-state h3 {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .chat-placeholder-state p {
          font-size: 0.9rem;
          max-width: 260px;
        }

        @media (max-width: 820px) {
          .mynight-layout {
            flex-direction: column;
          }
          .chat-hub-sidebar {
            max-height: 200px;
          }
          .chat-window {
            height: 380px;
          }
        }
      `}</style>
    </div>
  );
};
