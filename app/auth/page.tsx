'use client';

import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function Auth() {
    const { loading, user } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSignup = async () => {
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            handleError(error);
        }
    }

    const handleLogin = async () => {
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            handleError(error);
        }
    }

    const handleError = (error: any) => {
        switch (error.code) {
            case "auth/invalid-credential":
                setError("Incorrect email or password!");
                break;
            case "auth/user-not-found":
                setError("A user with that email was not found!");
                break;
            case "auth/email-already-in-use":
                setError("There is already an account with that email!");
                break;
            default:
                setError("Something went wrong");
                console.log(error);
                break;
        }
    }

    const handleLogout = async () => {
        await signOut(auth);
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="loader"></div>
        </div>
    )

    if (user) return (
        <div className="flex justify-center items-center min-h-screen">
            Welcome, {user.email}
            <br />
            <button onClick={handleLogout}>Sign out</button>
        </div>
    )

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-center">Your Account</h1>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            {error !== "" && <span className="text-red-400">{error}</span>}
            <button onClick={handleLogin}>Sign in</button>
            <button onClick={handleSignup}>Sign up</button>
        </div>
    )
}