import { addDoc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createNotification = async (toUser,fromUser, type, message) => {
    await addDoc(collection(db,'notifications'), {
        userId:toUser.uid,
        type,
        senderPic: fromUser.photoURL,
        senderName: fromUser.displayName,
        senderId: fromUser.uid,
        message,
        createdAt: serverTimestamp(),
        read: false,
    });
};

export const markNotificationAsRead = async (notificationId) => {
    const collectionRef = collection(db, 'notifications', notificationId);
    await setDoc(collectionRef, { read: true }, {merge: true});
};