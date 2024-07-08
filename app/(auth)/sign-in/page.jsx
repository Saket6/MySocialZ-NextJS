"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { ArrowBigRight, MessageSquareQuote } from "lucide-react"
import Link from "next/link"
export default function SignIn() {

    const { user, logout, signIn, signInWithGoogle } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleSignIn = async (e) => {
        e.preventDefault();
        signInWithGoogle();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn(email, password);
    }



    return (

        <div className="min-h-96 mt-10 flex flex-col gap-3 justify-center items-center">
            <h1 className=' text-lg flex gap-2 items-center md:text-3xl font-bold font-sans'>
                <MessageSquareQuote className='' color='#ff2d52' size={40} />
                My SocialZ
            </h1>
            <Card className=" md:w-[450px]">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Sign in to MySocialZ</CardDescription>
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

                            <div className="flex flex-col space-y-1.5">
                                <Button type='submit' className='w-full' >Sign in</Button>

                            </div>
                            {/* <div className="flex flex-col space-y-1.5">
                                <Button >Sign in</Button>
                            </div> */}
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col justify-end">
                        <Button className='w-full' onClick={handleSignIn}>
                            <span>  <ArrowBigRight /> </span>
                            Sign in With Google</Button>
                        <p className="text-zinc-300 mt-4">Not Registered yet? <Link className="text-white" href='/sign-up'>Sign Up</Link></p>

                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

