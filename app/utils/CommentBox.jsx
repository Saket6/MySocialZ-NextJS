import { Button } from '@/components/ui/button'
import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useUser } from './Auth';
import { toast } from 'sonner';
import { db } from './firebase';
import { SendHorizonal } from 'lucide-react';

function CommentBox({ post }) {

    const { user } = useUser();
    const [comment, setComment] = useState('');

    const [allComments, setComments] = useState([]);

    const handleSubmit = async (e) => {
        if (comment === '') {
            toast.warning('Please Enter a Comment');
            return;
        }
        const commentsRef = collection(db, 'posts', post.id,'comments');
        try {
            await addDoc(commentsRef, {
                by: user.uid,
                userPic: user.photoURL,
                comment,
                createdAt: serverTimestamp()
            });
            console.log("comment posted");
            setComment('');
        } catch (error) {
            console.error("Error adding reaction: ", error);
        }
    }

    useEffect(() => {
        const q = query(collection(db, 'posts', post.id,'comments'),orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const comments = [];
            querySnapshot.forEach((doc) => {
                comments.push({id:doc.id, ...doc.data()});
            })
            setComments(comments);
        })

        return () => unsubscribe();
    }, [])


    return (
        <div className='py-3 border-t-2  px-5 gap-2 flex flex-col justify-center'>
            <div className='flex gap-2 items-center'>
                <input onChange={(e) => setComment(e.target.value)} type="text" value={comment} className='w-full md:text-base text-xs px-2 py-1 md:py-2 rounded-lg md:px-3 outline-none' placeholder='Place your comment here...' />
                <SendHorizonal className='cursor-pointer' color='#bf9a44'  onClick={handleSubmit}/>
                {/* <Button>Comment</Button> */}
            </div>

            <div className='prevComments max-h-72 md:max-h-96 overflow-scroll'>
                {
                    allComments?.map((comment) => (
                        <div key={comment.id} className="p-2 flex gap-3 items-center rounded-full py-2 px-2  text-xs md:text-md ">
                            <span>
                                 <img src={comment.userPic} className='rounded-full w-7 h-7' alt="" /> 
                            </span>
                            <span className='bg-zinc-800 p-2 md:p-3 rounded-tl-none rounded-xl'>
                                {comment.comment}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CommentBox