"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from "firebase/auth"
import {

    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useUser } from "@/app/utils/Auth"
import { ArrowBigRight, Loader2, MessageSquareQuote, } from "lucide-react"
import Link from "next/link"
import { getAuth, updateProfile } from "firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "@/app/utils/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
export default function SignIn() {

    const { user, logout, signUp, signIn, signInWithGoogle } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [name, setName] = useState('');
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const Router = useRouter();
    const [open, setOpen] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        signInWithGoogle();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signUp(email, password);
        setOpen(true)
    }


    const complete = async (e) => {

        e.preventDefault();
        setLoading(true);
        const auth = getAuth();
        const storageRef = ref(storage, `profiles/${pic.name}`);
        const snapshot = await uploadBytes(storageRef, pic);
        const fileUrl = await getDownloadURL(snapshot.ref);
        const curr_user = auth.currentUser;
        if (curr_user) {
            await updateProfile(curr_user, {
                displayName: name,
                photoURL: fileUrl
            })

            const userRef = doc(db, "users", curr_user.uid);
            await setDoc(userRef, {
                displayName: name,
                photoURL: fileUrl,
            },{merge:true});


            console.log("Profile Updated");
        }

        

        setLoading(false);
        setOpen(false);
        toast.success('Profile Complete');
        Router.push('/');

    }

    return (
        <div className="min-h-96 mt-10  flex flex-col gap-4 justify-center items-center">
            <h1 className=' text-lg flex gap-2 items-center md:text-3xl font-bold font-sans'>
                <MessageSquareQuote className='' color='#ff2d52' size={40} />
                My SocialZ
            </h1>
            <Card className="md:w-[450px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Sign Up to MySocialZ</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>

                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input type='email' id="email" required placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="pwd">Password</Label>
                                <Input id="pwd" type='password' placeholder="Enter your password " required onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <Button type='submit' className='w-full' >Sign Up</Button>


                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end">

                        <div className="flex w-full justify-center items-center flex-col">
                            <Button className='w-full' onClick={handleSignIn}>
                                <span>  <ArrowBigRight /> </span>
                                Sign up With Google
                            </Button>

                            <p className="text-zinc-300 mt-4">Already Registered? <Link className="text-white" href='/sign-in'>Sign In</Link></p>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <Dialog open={open} setOpen={setOpen}>

                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Complete your profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col  gap-2">
                            <Label htmlFor="name" className="">
                                User Name
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                value={name}
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col  gap-2">
                            <h1>Profile Picture</h1>
                            <Label htmlFor="pic" className="rounded-lg flex justify-center items-center cursor-pointer border-dashed border-2 gap-3 p-16">
                                {
                                    pic && <img src={URL.createObjectURL(pic)} className="w-20 h-20 rounded-full" alt="" />
                                }
                                Profile Picture
                            </Label>
                            <input
                                type='file'
                                id="pic"
                                hidden={true}
                                onChange={(e) => setPic(e.target.files[0])}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!pic || !name || loading} className="flex gap-2" onClick={complete} >
                            {
                                loading &&  <Loader2  className="animate-spin"/>
                            }
                            <span>
                                Save changes
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )


}