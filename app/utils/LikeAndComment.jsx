"use client"
import { SmilePlus, MessageSquare } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useState } from 'react'
import { setDoc, doc, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './Auth';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';
import CommentBox from './CommentBox';

function LikeAndComment({ post }) {

    const [isEmojiOpen, setOpen] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const { user } = useUser();
    const [reactions, setReactions] = useState({});
    const handleReaction = async (e) => {
        console.log(e.emoji);
        const emoji = e.emoji;
        setOpen(false);
        const reactionRef = doc(db, 'posts', post.id,'reactions', user.uid);
        try {
            await setDoc(reactionRef, {
                by: user.uid,
                emoji
            });
            console.log(`Reaction ${emoji} added to post`);

        } catch (error) {
            console.error("Error adding reaction: ", error);
        }
    }

    useEffect(() => {
        const q = collection(db, 'posts', post.id,'reactions');
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newReactions = {};
            querySnapshot.forEach((doc) => {
                newReactions[doc.id] = doc.data().emoji;
            })
            setReactions(newReactions);
        })

        return () => unsubscribe();
    }, [])

    return (
        <div className=' flex w-full flex-col'>
            <div className="likes p-4 flex justify-between   items-center ">
                <div className='grid md:grid-cols-5 grid-cols-4 items-center gap-1 md:gap-3 '>
                    {
                        Object.entries(reactions).map(([userId, emoji]) => (
                            <div key={userId} className="reaction border-[1px] border-zinc-600  rounded-full py-1 px-1 md:py-2 md:px-2 text-base  md:text-xl ">
                                {emoji}
                            </div>
                        ))
                    }
                    <SmilePlus size={'30px'} className='cursor-pointer' onClick={() => setOpen(!isEmojiOpen)} color='#f8ff66' />

                    {
                        isEmojiOpen && <div className=' absolute translate-y-[-60px]  translate-x-[0px]  rounded-lg'>
                            <EmojiPicker reactionsDefaultOpen={true} theme='dark' onEmojiClick={handleReaction} />
                        </div>
                    }

                </div>

                <div className="comments " onClick={() => setCommentsOpen(!commentsOpen)}>
                    <Button variant='' className='flex md:w-auto gap-1 items-center'>
                        <MessageSquareText />
                        <span className='md:block hidden'>
                            Comments
                        </span>

                    </Button>
                </div>



            </div>
            {
                commentsOpen &&  <CommentBox post={post}/>
            }
           

        </div>
    )
}

export default LikeAndComment