"use client"
import React, { useEffect, useState } from 'react'
import { Bell, BookmarkCheck, Heart, House, LogOut, User, User2, Users } from 'lucide-react';
import { useUser } from './Auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageSquareQuote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { addDoc, and, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';

function Navbar() {

  const { user, logout } = useUser();
  const [notifications, setNotifications] = useState([]);
  const path = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <House size={30} className='md:h-auto md:w-auto w-6 h-6' />
    },
    {
      label: 'People',
      href: '/people',
      icon: <Users size={30} className='md:h-auto md:w-auto w-6 h-6' />
    }, {
      label: 'Liked Posts',
      href: '/liked',
      icon: <Heart size={30} className='md:h-auto md:w-auto w-6 h-6' />
    },
    // {
    //   label: 'Saved Posts',
    //   href: '/saved',
    //   icon: <BookmarkCheck size={30} />
    // }
  ]

  const acceptFriendReq = async (notification) => {
    //notification update
    const notRef = doc(db, 'notifications', notification.id);
    await setDoc(notRef, { read: true }, { merge: true });

    //followers addition
    const followersRef = collection(db, 'users', user.uid, 'followers');
    await addDoc(followersRef, {
      'userId': notification.data.senderId, 'name': notification.data.senderName,
      'profilePic': notification.data.senderPic
    });

    // following updation of sender
    const followingRef = collection(db, 'users', notification.data.senderId, 'following');
    await addDoc(followingRef, { 'userId': user.uid, 'name': user.displayName, 'profilePic': user.photoURL });

    //follow requests update

    const followReqs = collection(db, 'followRequests');
    const q = query(followReqs, where('from', '==', notification.data.senderId), where('to', '==', user.uid));
    const docs = await getDocs(q);
    docs.forEach(async (doc) => {
      const docRef = doc.ref;
      const updateData = {
        status: 'accepted'
      };
      await updateDoc(docRef, updateData);
    })

    toast.success("Follow request accepted");
  }

  const rejectFriendReq = async(notification)=>
  {
    const notRef = doc(db, 'notifications', notification.id);
    await setDoc(notRef, { read: true }, { merge: true });

    const followReqs = collection(db, 'followRequests');
    const q = query(followReqs, where('from', '==', notification.data.senderId), where('to', '==', user.uid));
    const docs = await getDocs(q);
    docs.forEach(async (doc) => {
      const docRef = doc.ref;
      const updateData = {
        status: 'rejected'
      };
      await updateDoc(docRef, updateData);
    })

    toast.success("Follow request rejected");
  }

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'notifications'), where('userId', '==', user?.uid), where('read', '==', false))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const nots = [];
        querySnapshot.forEach((doc) => {
          nots.push({ 'id': doc.id, 'data': doc.data() });
        })
        console.log(nots);
        setNotifications(nots);
      })
      return () => unsubscribe();
    }
  }, [user])

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'followRequests'), where('to', '==', user?.uid), where('status', '==', 'pending'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const followReqs = [];
        querySnapshot.forEach((doc) => {
          followReqs.push({ 'id': doc.id, 'data': doc.data() });
          toast('You have a follow request');
        })
        // setNotifications(followReqs);
      })
      return () => unsubscribe();
    }
  }, [user])




  return (
    <nav className='z-50 p-4 border-b transition-all duration-200 border-zinc-800 sticky top-0 bg-zinc-950 grid grid-cols-3'>
      <Link href='/' className=' text-lg w-fit flex gap-2 items-center md:text-3xl font-bold font-sans'>
        <MessageSquareQuote className='' color='#ff2d52' size={40} />
        <span className='md:block hidden'>
        My SocialZ

        </span>
      </Link>

      <div className='flex gap-2 md:gap-6 justify-center items-center' >
        {
          navItems.map(item => (
            <Link href={item.href} className={`text-sm  md:text-base hover:bg-zinc-900 transition-all duration-200 rounded-t-lg py-2 px-1 md:px-4 ${path === (item.href) ? 'border-b-4  border-pink-700' : ''}`} key={item.label}>
              {item.icon}
            </Link>
          ))
        }
      </div>

      <div className='flex justify-end mr-4 items-center'>

        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <Bell size={24} className='mr-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[320px] md:w-[600px] mr-4 mt-3'>
            <DropdownMenuLabel>
              <h1 className='text-sm md:text-xl'> Notifications</h1>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='flex flex-col px-3 py-2 '>
              {
                notifications?.length === 0 &&
                <div className='md:text-base text-sm'>No notifications</div>
              }
              {
                notifications.map((not, i) => {
                  return (

                    <div key={i} className='flex gap-2 items-center'>
                      <span> <img src={not?.data?.senderPic} alt="" className='w-10 h-10 rounded-lg' /> </span>
                      <span className='font-semibold'>{not?.data?.senderName}</span> has sent you follow request.
                      <button onClick={() => acceptFriendReq(not)} className='p-1 border-2 border-zinc-800 rounded-lg hover:bg-white hover:text-black transition-all duration-150' >Accept</button>
                      <button onClick={() => rejectFriendReq(not)} className='p-1 border-2 border-zinc-800 rounded-lg hover:bg-red-600  transition-all duration-150' >Reject</button>
                    </div>

                  )
                })
              }
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {
          user &&
          <div className='flex gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger className=' focus:outline-none'>
                <img className='rounded-full w-10 h-10 ' src={user.photoURL} alt='User' />

              </DropdownMenuTrigger>
              <DropdownMenuContent className='p-2'>
                <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem> */}
                <DropdownMenuItem>
                  <div className='cursor-pointer flex gap-2' onClick={logout}>
                    <LogOut />
                    Log out
                  </div>

                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }

      </div>
      <Toaster />
    </nav>
  )
}

export default Navbar