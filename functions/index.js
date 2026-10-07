const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onCrewRequest = functions.firestore
  .document('crews/{crewId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    const beforeRequests = beforeData.requestIds || [];
    const afterRequests = afterData.requestIds || [];

    // Find if a new user requested to join
    const newRequests = afterRequests.filter(req => !beforeRequests.includes(req));
    if (newRequests.length === 0) return null;

    const hostId = afterData.hostId;
    if (!hostId) return null;

    // Get the host's FCM token
    const hostProfileDoc = await admin.firestore().collection('profiles').doc(hostId).get();
    if (!hostProfileDoc.exists) return null;

    const hostToken = hostProfileDoc.data().fcmToken;
    if (!hostToken) {
      console.log('Host has no FCM token');
      return null;
    }

    const payload = {
      notification: {
        title: 'New Join Request!',
        body: `Someone requested to join ${afterData.title}. Open the app to approve them.`
      },
      token: hostToken
    };

    return admin.messaging().send(payload);
  });

exports.onNewMessage = functions.firestore
  .document('crews/{crewId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const crewId = context.params.crewId;
    
    // Get crew details to find attendees
    const crewDoc = await admin.firestore().collection('crews').doc(crewId).get();
    if (!crewDoc.exists) return null;
    
    const crewData = crewDoc.data();
    const attendeeIds = crewData.attendeeIds || [];
    
    // Everyone in the crew except the sender
    const targetUids = attendeeIds.filter(uid => uid !== messageData.senderId);
    if (targetUids.length === 0) return null;

    // Get tokens for all targets
    const tokens = [];
    for (const uid of targetUids) {
      const pDoc = await admin.firestore().collection('profiles').doc(uid).get();
      if (pDoc.exists && pDoc.data().fcmToken) {
        tokens.push(pDoc.data().fcmToken);
      }
    }

    if (tokens.length === 0) return null;

    const messagePayload = {
      notification: {
        title: `New message in ${crewData.title}`,
        body: `${messageData.senderName}: ${messageData.text}`
      }
    };

    return admin.messaging().sendEachForMulticast({
      tokens: tokens,
      notification: messagePayload.notification
    });
  });
