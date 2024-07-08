import React, { useState } from 'react'
import { useUser } from './Auth'
import Link from 'next/link';
import { Image, Loader, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import moment from 'moment';
import Posts from './Posts';
import EmojiPicker from 'emoji-picker-react';

function CreatePost() {

  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (title === '' || !file) {
      toast.warning('Please fill all details', {
        position: 'top-right'
      });

      return;
    }

    setLoading(true);

    console.log(title, file);
    let fileUrl = '';
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);
    }

    console.log(fileUrl, " File uploaded successfully");

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        fileUrl,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        username: user?.displayName,
        prof:user.photoURL
      })

      setTitle('');
      setFile(null);
      toast.success('Post created successfully', {
        position: 'top-right'
      });

      setLoading(false);

    }
    catch (e) { console.log(e); }


  }

  return (
    <div className='col-span-6 flex lg:mx-10 flex-col gap-4'>
      {/* <div className='flex flex-col   justify-center bg-zinc-900 rounded-xl items-center'> */}
      <div className='flex flex-col   justify-center bg-opacity-30 border-2 bg-zinc-900 rounded-xl items-center'>
        <div className='grid grid-cols-10 p-3 md:p-5 w-full border-b-zinc-800 border-b-2 gap-2 justify-items-center items-center'>
          <Link href={'/profile'} className=' col-span-2 md:col-span-1'>
            <img className='rounded-full w-10 h-10 md:w-14 md:h-14' src={user?.photoURL} alt="user" />
          </Link>

          <input
            type='text'
            placeholder='What are your thoughts?'
            className='border-b md:text-base text-sm bg-transparent col-span-7 md:col-span-8 outline-none p-2 md:p-4 w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className='col-span-1' >
            <span onClick={()=>setOpen(!isOpen)}  className=' md:p-2 md:border-[1px] rounded-full cursor-pointer text-center text-2xl'>😊</span>
            {
              isOpen && <div className='absolute z-40 md:left-auto md:translate-y-0 translate-y-6 left-3'>
                <EmojiPicker onEmojiClick={(e)=>
                  {
                    setTitle(title + e.emoji);
                  }
                }  theme='dark' className='z-30' />
              </div>
            }

          </div>

        </div>

        <div className='md:py-3 py-2 px-3 md:px-5 w-full justify-between flex'>
          <div className='flex gap-4'>
            <label htmlFor="img" className='rounded-full flex justify-center items-center  cursor-pointer'>
              <Image color='#ff48b1' size='30px' className='md:w-auto md:h-auto h-6 w-6' />
              <span className='ml-1 md:text-base text-sm'>
                Photo
              </span>
            </label>
            <input type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} id='img' hidden />

            <label htmlFor="video" className='rounded-full  flex justify-center items-center  cursor-pointer'>
              <Video color='#2ce0dc' size='30px'  className='md:w-auto md:h-auto h-6 w-6'/>
              <span className='ml-1 md:text-base text-sm'>
                Video
              </span>
            </label>
            <input type="file" accept='video/*' onChange={(e) => setFile(e.target.files[0])} id='video' hidden />

          </div>

          <div>
            <Button onClick={handleSubmit}>
              {
                loading ? (<> <Loader2 size={24} className='mr-2 animate-spin' /> <span>Sharing</span> </>) : 'Share'
              }
            </Button>
          </div>

        </div>

      </div>

      <Posts />

    </div>
  )
}

export default CreatePost