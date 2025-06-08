"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";

export default function AuthCheck({children}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // If user is not authenticated and not on auth pages, redirect to login
            if (!user && !pathname.includes('/auth/')) {
                router.push('/auth/login');
                return;
            }

            // If user is authenticated and on auth pages, redirect to dashboard
            if (user && pathname.includes('/auth/')) {
                router.push('/dashboard');
                return;
            }
        }
    }, [user, loading, router, pathname]);

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Show loading during redirects to prevent flash of content
    if ((!user && !pathname.includes('/auth/')) || (user && pathname.includes('/auth/'))) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}