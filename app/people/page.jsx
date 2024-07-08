"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '../utils/Sidebar'
import Suggestions from '../utils/Suggestions'
import { useUser } from '../utils/Auth'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../utils/firebase'
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
import { useRouter } from 'next/navigation'

function People() {

    const { following, followers } = useUser();
    const [allUsers, setUsers] = useState([]);
    const [followingIDs, setFollowingIDs] = useState([]);
    const { user } = useUser();
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

    const removeFromFollowers = async (followerId, userId) => {
        const followerRef = doc(db, 'users', user.uid, 'followers', followerId);
        await deleteDoc(followerRef);

        const followingRef = collection(db, 'users', userId, 'following');
        const q = query(followingRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        toast('Removed user from followers');
    }

    const unFollow = async (id) => {
        const followingRef = doc(db, 'users', user.uid, 'following', id);
        await deleteDoc(followingRef);
        toast.success("Unfollowed user");
    }

    return (
        <div>
            {
                user && <div className='grid lg:grid-cols-12'>
                    <Sidebar />
                    <div className='col-span-6 flex flex-col gap-5  px-4'>
                        <div>
                            <h1 className='md:text-xl font-semibold mb-2'>Followers</h1>
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                                {
                                    followers?.map((foll) => {
                                        return (<div key={foll.id} className='flex bg-zinc-900 rounded-lg p-2 md:p-3 gap-2 bg-opacity-30 border-2 flex-col justify-start items-center'>
                                            <img src={foll.data.profilePic} className='rounded-lg object-fill w-fit h-20' alt="pic" />
                                            <p className='md:text-base text-xs'>{foll.data.name}</p>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className='w-full' variant='destructive'>Remove</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action will remove the current user from your followers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => removeFromFollowers(foll.id, foll.data.userId)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div>
                            <h1 className='md:text-xl font-semibold mb-2'>Following</h1>
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                                {
                                    following?.map((foll) => {
                                        return (<div key={foll.id} className='flex bg-zinc-900 rounded-lg p-3 gap-2 bg-opacity-30 border-2 flex-col justify-center items-center'>
                                            <img src={foll.data.profilePic} className='rounded-lg object-fill w-fit h-20' alt="pic" />
                                            <p>{foll.data.name}</p>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className='w-full' variant='destructive'>Unfollow</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your
                                                            account and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => unFollow(foll.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <Suggestions allUsers={allUsers} />

                </div>
            }
        </div>
    )
}

export default People