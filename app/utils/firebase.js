import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,setPersistence, browserSessionPersistence ,signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

    apiKey: "AIzaSyDNx_JtrJRERtWRO8KKtkmezBAUT-5yDe4",

    authDomain: "social-media-app-5a8be.firebaseapp.com",

    projectId: "social-media-app-5a8be",

    storageBucket: "social-media-app-5a8be.appspot.com",

    messagingSenderId: "864882149162",

    appId: "1:864882149162:web:02f8aabc3b317f11794053",

    measurementId: "G-0XKQFYPQZ5"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence)
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider,app, db, storage, signInWithPopup, signOut };
