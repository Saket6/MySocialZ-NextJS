import React from 'react'
import { useUser } from './Auth'
import { UserPlus } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { createNotification } from './Notification';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
    <div className='lg:col-span-3 bg-opacity-30 border-2 lg:block hidden max-h-screen h-max sticky top-24 bg-zinc-900 rounded-xl  p-5'>
      <h1 className='text-md font-semibold lg:text-lg'>Who to follow?</h1>
      <div className='p-2 mt-2'>
        {
          allUsers.map((c_user)=>
          {
            return (
              <div key={c_user.uid} className='grid grid-cols-12 my-2 gap-2 items-center '>
                <img src={c_user.photoURL} className='w-10 col-span-2 rounded-full h-10' alt="photo" />
                <p className='col-span-7'>{c_user.displayName}</p>
                <Button onClick={()=>sendFollowReq(c_user)} className='col-span-2 px-3 rounded-full py-2 w-fit  cursor-pointer'>
                  Follow
                  {/* <UserPlus color='black'/> */}
                </Button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Suggestions