'use client';

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await signup(email, password, name);
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to create an account. ' + (err?.message || 'Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6"
        >
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200/50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 1 }}
                            className="inline-block"
                        >
                            <svg 
                                className="h-12 w-12 text-white" 
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
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                                />
                            </svg>
                        </motion.div>
                        <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">
                            Join ExpenseTracker
                        </h2>
                        <p className="mt-2 text-blue-100/90">
                            Track your expenses with ease
                        </p>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 sm:p-8">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r"
                                role="alert"
                            >
                                <div className="flex items-start">
                                    <svg 
                                        className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" 
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
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {[
                                { id: "name", label: "Full Name", type: "text", value: name, onChange: setName, autoComplete: "name" },
                                { id: "email", label: "Email address", type: "email", value: email, onChange: setEmail, autoComplete: "email" },
                                { id: "password", label: "Password", type: "password", value: password, onChange: setPassword, autoComplete: "new-password" },
                                { id: "confirm-password", label: "Confirm Password", type: "password", value: confirmPassword, onChange: setConfirmPassword, autoComplete: "new-password" }
                            ].map(({ id, label, type, value, onChange, autoComplete }, i) => (
                                <div key={id}>
                                    <label 
                                        htmlFor={id} 
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        {label}
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            id={id}
                                            name={id}
                                            type={type}
                                            required
                                            autoComplete={autoComplete}
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            aria-describedby={error ? `${id}-error` : undefined}
                                        />
                                    </div>
                                </div>
                            ))}

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
                                                className="animate-spin h-5 w-5 text-white mr-2" 
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
                                                    d="M4 12a8 8 0 018-8v8z" 
                                                />
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <svg 
                                                className="h-5 w-5 text-blue-200 mr-2" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                                />
                                            </svg>
                                            Sign Up
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-500">
                                Already have an account?
                            </p>
                            <motion.div 
                                whileHover={{ scale: 1.01 }} 
                                whileTap={{ scale: 0.99 }}
                                className="mt-3"
                            >
                                <Link 
                                    href="/auth/login"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-label="Sign in to your account"
                                >
                                    Sign in instead
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}