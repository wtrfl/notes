'use client';

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {

    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>
    if (!user) return <p>You must be logged in to view this page!</p>

    return <p>Welcome, {user.email}</p>

}