import React from 'react'
import { useUser } from './Auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
function Sidebar() {

  const { user, followers,following,userPosts } = useUser();
 
  return (
    <div className='lg:flex min-h-screen  lg:sticky lg:top-24 hidden border-r-2 max-h-screen p-7 items-center gap-5  lg:col-span-3 flex-col'>
      {
        user && <div className='flex flex-col gap-2  items-center'>
          <Avatar className='w-16 h-16'>
            <AvatarImage  src={user.photoURL} alt="user" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className='font-semibold'>{user.displayName}</h1>
        </div>
      }
      {
        user && 
        <div className='flex gap-10 border-b-4 border-zinc-500 pb-7'>
          <span className='flex flex-col items-center'>
            <h1 className='font-semibold'> {userPosts?.length}</h1>
            <h1>Posts</h1>
          </span>
          <span className='flex flex-col items-center'>
            <h1 className='font-semibold'>{followers?.length}</h1>
            <h1>Followers</h1>
          </span>
          <span className='flex flex-col items-center'>
            <h1 className='font-semibold'> {following?.length}</h1>
            <h1>Following</h1>
          </span>
         
      </div>
      }
      
    </div>
  )
}

export default Sidebar