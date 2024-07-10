"use client"
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from './firebase';
import LikeAndComment from './LikeAndComment';
import { useUser } from './Auth';
function Posts() {

    const [posts, setPosts] = useState([]);
    const { user } = useUser();
    const { following } = useUser();
    const [followingIDs, setFollowingIDs] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsArr = [];
            console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                postsArr.push({ id: doc.id, ...doc.data() });
            })
            console.log(postsArr);
            setPosts(postsArr);
        })

        return () => unsubscribe();

    }, [])

    useEffect(() => {
        if (following) {
            const followingIDs = following.map((obj) => obj.data.userId);
            setFollowingIDs(followingIDs);
        }

    }, [following])

    useEffect(() => {
        console.log(followingIDs, "THis is ids");
    }, [followingIDs])

    return (
        <div className='flex flex-col gap-4'>
            {posts.filter((post) => {
                return (followingIDs.includes(post.createdBy) || post.createdBy === user?.uid)
            })
                .map((post) => (
                    <div key={post.id} className=' border-2 flex flex-col justify-center items-start bg-opacity-30 bg-zinc-900 rounded-xl'>
                        <div className='flex gap-3 p-2 md:p-4 items-center'>
                            <img src={post.prof} className='md:w-14 md:h-14 w-10 h-10 rounded-full' alt="" />
                            <span className='font-semibold md:text-base text-sm'>{post.username}</span>
                        </div>
                        <h2 className=' px-4 md:text-base text-sm'>{post.title}</h2>
                        {post.fileUrl && (
                            <div className='px-2 pt-3 w-full'>
                                {post.fileUrl.includes('.mp4') ? (
                                    <video className='rounded-lg' controls>
                                        <source src={post.fileUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img className='rounded-lg w-full' src={post.fileUrl} alt="" />
                                )}
                            </div>
                        )}

                        <LikeAndComment post={post} />

                    </div>
                ))}
        </div>
    )
}

export default Posts