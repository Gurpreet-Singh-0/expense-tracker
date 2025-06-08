'use client';

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (error) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen text-balck bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        >
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl ring-1 ring-gray-900/5">
                    <div className="text-center">
                        <svg 
                            className="mx-auto h-12 w-auto text-blue-600" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
                            />
                        </svg>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900 tracking-tight">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-black">
                            Or{' '}
                            <Link 
                                href="/auth/register" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                                aria-label="Create a new account"
                            >
                                start your 14-day free trial
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-500"
                            role="alert"
                        >
                            <div className="flex items-start">
                                <svg 
                                    className="h-5 w-5 text-red-500 flex-shrink-0" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label 
                                    htmlFor="email" 
                                    className="block text-sm font-medium text-black mb-1.5"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-black"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-describedby={error ? "email-error" : undefined}
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label 
                                        htmlFor="password" 
                                        className="block text-sm font-medium text-black"
                                    >
                                        Password
                                    </label>
                                    <Link 
                                        href="/auth/forgot-password" 
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
                                        aria-label="Reset your password"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-black"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-describedby={error ? "password-error" : undefined}
                                />
                            </div>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.01 }} 
                            whileTap={{ scale: 0.99 }}
                            className="pt-1"
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                }`}
                                aria-busy={loading ? "true" : "false"}
                            >
                                {loading ? (
                                    <>
                                        <svg 
                                            className="animate-spin h-5 w-5 text-white mr-3" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4" 
                                            />
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
                                            />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <svg 
                                            className="h-5 w-5 text-blue-200 mr-2" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                                            />
                                        </svg>
                                        Sign in
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-black">
                            New to our platform?
                        </p>
                        <motion.div 
                            whileHover={{ scale: 1.01 }} 
                            whileTap={{ scale: 0.99 }}
                            className="mt-3"
                        >
                            <Link 
                                href="/auth/register" 
                                className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                                aria-label="Create a new account"
                            >
                                Create your account
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}