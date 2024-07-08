"use client"
import Image from "next/image";
import Sidebar from './utils/Sidebar';
import CreatePost from "@/app/utils/CreatePost";
import Suggestions from './utils/Suggestions';
import { useUser } from "./utils/Auth";
import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "./utils/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
export default function Home() {

  const Router = useRouter();
  const { user } = useUser();
  const { following } = useUser();
  const [allUsers, setUsers] = useState([]);
  const [followingIDs, setFollowingIDs] = useState([]);




  const getUsers = async () => {
    if (following && followingIDs) {
      try {
        console.log(followingIDs);
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('uid', '!=', user.uid))
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          if (!followingIDs.includes(doc.data().uid))
            users.push(doc.data());
        });
        // console.log(users);
        setUsers(users);

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

  };

  useEffect(() => {
      const followingIDs = following?.map((obj) => obj.data.userId);
      setFollowingIDs(followingIDs);
  }, [following])

  useEffect(() => {
    if (user === null)
      Router.push('/sign-in');
  }, [user])

  useEffect(() => {
    user && getUsers();
  }, [user,following, followingIDs])

  return (
    user && <div className="grid lg:grid-cols-12">
      <Sidebar />
      <CreatePost />
      <Suggestions allUsers={allUsers} />
    </div>
  );
}
