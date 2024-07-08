import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,setPersistence, browserSessionPersistence ,signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

    apiKey: process.env.NEXT_PUBLIC_API_KEY,

    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,

    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,

    storageBucket: process.env.NEXT_PUBLIC_STORAGE,

    messagingSenderId: process.env.NEXT_PUBLIC_MSG_SND_ID,

    appId: process.env.NEXT_PUBLIC_APP_ID,

    measurementId: process.env.NEXT_PUBLIC_MS_ID

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence)
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider,app, db, storage, signInWithPopup, signOut };
