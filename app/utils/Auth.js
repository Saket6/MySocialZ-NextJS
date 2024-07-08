"use client"
import { auth, db, googleProvider, signInWithPopup, signOut } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [userPosts, setUserPosts] = useState();
    const Router = useRouter();


    const saveUserDetailsInFirestore = async (user) => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            }, { merge: true }); // Using merge to avoid overwriting existing data
            console.log('User details saved/updated in Firestore');
        } catch (error) {
            console.error('Error saving user details: ', error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result)
                toast.success("Signed in successfully.", {
                    position: "top-right"
                });
            const user = result.user;
            setUser(user);
            await saveUserDetailsInFirestore(user);
            Router.push('/');
            console.log(user);
            useRouter
            return user;
        } catch (error) {
            toast.error("Error Signing in", {
                position: "top-right"
            })
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const signIn = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (result)
                toast.success("Signed in successfully.", {
                    position: "top-right"
                });

            const user = result.user;

            setUser(user);
            Router.push('/');
        }
        catch (e) {
            console.error(e);
            toast.error("Error Signing in", {
                position: "top-right",
            })
        }
    }
    const signUp = async (email, password) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserDetailsInFirestore(userCredentials.user);
            toast.success('Sign up successfully. Please set up your profile', {
                position: 'top-right'
            })
            // Router.push('/');
        }
        catch(e){
            toast.error('Error signing up')
            console.log(e);}
        
        
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [user])

    useEffect(()=>
    {
        if (!user) return;
        const q = query(collection(db,'users', user.uid, 'followers'))
        const unsubscribe = onSnapshot(q, (querySnapshot)=>
        {
            const followersArr = [];
            querySnapshot.forEach((doc)=>
            {
                followersArr.push({'id' : doc.id , 'data': doc.data()});
            })
            console.log(followersArr);
            setFollowers(followersArr);
        })

        return () => unsubscribe();
    },[user])


    useEffect(()=>
        {
            if(!user) return;
            const q = query(collection(db,'users', user?.uid, 'following'))
            const unsubscribe = onSnapshot(q, (querySnapshot)=>
            {
                const followingsArr = [];
                querySnapshot.forEach((doc)=>
                {
                    followingsArr.push({'id' : doc.id , 'data': doc.data()});
                })
                console.log(followingsArr);
                setFollowing(followingsArr);
            })

            return () => unsubscribe();
        },[user])


    useEffect(()=>
    {
        if(!user) return;
        const q = query(collection(db, 'posts'), where('createdBy', '==' ,user.uid ));
        const unsubscribe = onSnapshot(q, (querySnapshot)=>
        {
            const posts = [];
            querySnapshot.forEach((doc)=>
            {
                posts.push({'id' : doc.id ,...doc.data()});
            });

            setUserPosts(posts);
        })
    },[user])

    return (
        <UserContext.Provider value={{ user,followers, userPosts, following, signInWithGoogle, signIn, signUp, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);