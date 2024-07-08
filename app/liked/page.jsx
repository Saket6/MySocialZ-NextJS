"use client"
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Sidebar from '../utils/Sidebar'
import Suggestions from '../utils/Suggestions'
import { useUser } from '../utils/Auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LikeAndComment from '../utils/LikeAndComment';
import { useRouter } from 'next/navigation';
const UserReactions = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState();

    useEffect(() => {
        const fetchReactions = async () => {
            if (!user) return;

            const postsRef = collection(db, 'posts');
            const postsSnapshot = await getDocs(postsRef);
            const userReactedPosts = [];

            for (const postDoc of postsSnapshot.docs) {
                const reactionsRef = collection(db, 'posts', postDoc.id, 'reactions');
                const q = query(reactionsRef, where('by', '==', user.uid));
                const reactionsSnapshot = await getDocs(q);

                if (!reactionsSnapshot.empty) {
                    const postDocRef = doc(db, 'posts', postDoc.id);
                    const postSnapshot = await getDoc(postDocRef);
                    if (postSnapshot.exists()) {
                        userReactedPosts.push({ id: postSnapshot.id, ...postSnapshot.data() });
                    }
                }
            }
            setPosts(userReactedPosts);
        };

        fetchReactions();
    }, [user]);
    const { following, followers } = useUser();
    const [allUsers, setUsers] = useState([]);
    const [followingIDs, setFollowingIDs] = useState([]);
    const Router = useRouter();
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
    }, [user, following, followingIDs, followers])




    return (
        user && <div className="grid lg:grid-cols-12">
            <Sidebar />
            <div className='col-span-6 flex flex-col gap-4 p-2 md:p-4'>
                <h1 className='text-md md:text-xl mb-4 font-semibold'>Reacted Posts</h1>
                {
                    posts === undefined && (
                          <div className=''>
                            <h1 className='mx-2 md:m-0 md:w-full mb-3 p-6 rounded-xl animate-pulse bg-zinc-900'></h1>
                            <div className='mx-2 py-40 md:m-0 px-10 md:p-60  rounded-xl bg-zinc-900 animate-pulse'>

                            </div>
                        </div>
                    )
                }
                {posts?.map((post) => (
                    <div key={post.id} className=' border-2 flex flex-col justify-center items-start bg-opacity-30 bg-zinc-900 rounded-xl'>
                        <div className='flex gap-3 p-4 items-center'>
                            <img src={post.prof} className='w-14 h-14 rounded-full' alt="" />
                            <span className='font-semibold'>{post.username}</span>
                        </div>
                        <h2 className=' px-4'>{post.title}</h2>
                        {post.fileUrl && (
                            <div className='px-2 pt-3'>
                                {post.fileUrl.includes('.mp4') ? (
                                    <video className='rounded-lg' controls>
                                        <source src={post.fileUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img className='rounded-lg' src={post.fileUrl} alt="" />
                                )}
                            </div>
                        )}

                        <LikeAndComment post={post} />

                    </div>

                ))}
            </div>
            <Suggestions allUsers={allUsers} />
        </div>
    );
};

export default UserReactions;