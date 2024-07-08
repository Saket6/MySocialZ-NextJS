import React from 'react'
import { useUser } from './Auth'
import { UserPlus } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { createNotification } from './Notification';
import { toast } from 'sonner';

function Suggestions({ allUsers }) {
  
  const {user} = useUser();

  const sendFollowReq = async(toUser)=>
  {
    await addDoc(collection(db,'followRequests'),{
      from: user.uid,
      senderName: user.displayName,
      to: toUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    await createNotification(toUser, user, 'Follow Request', 'You have a new follow request.');
    toast.success("Follow request sent");
  }

  return (
    <div className='lg:col-span-3 bg-opacity-30 border-2 lg:block hidden max-h-screen h-max sticky top-6 bg-zinc-900 rounded-xl  p-5'>
      <h1 className='text-lg lg:text-xl'>Suggestions for you</h1>
      <div className='p-2 mt-2'>
        {
          allUsers.map((c_user)=>
          {
            return (
              <div key={c_user.uid} className='grid grid-cols-12 my-2 gap-2 items-center '>
                <img src={c_user.photoURL} className='w-10 col-span-2 rounded-full h-10' alt="photo" />
                <p className='col-span-8'>{c_user.displayName}</p>
                <span onClick={()=>sendFollowReq(c_user)} className='col-span-2 p-3 w-fit rounded-full hover:bg-zinc-800 cursor-pointer'>
                  <UserPlus color='#14ff99'/>
                </span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Suggestions