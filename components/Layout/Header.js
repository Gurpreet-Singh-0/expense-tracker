'use client';

import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    }

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 flex items-center">
                            <Link 
                                href="/" 
                                className="text-2xl font-bold text-white hover:text-indigo-200 transition-colors duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 rounded-md"
                                aria-label="ExpenseTracker Home"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-8 w-8 mr-2" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                                ExpenseTracker
                            </Link>
                        </div>
                        {user && (
                            <nav className="hidden md:flex space-x-4">
                                <Link 
                                    href="/dashboard" 
                                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                    aria-current="page"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    href="/expenses" 
                                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                >
                                    Expenses
                                </Link>
                                <Link 
                                    href="/reports" 
                                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                >
                                    Reports
                                </Link>
                            </nav>
                        )}
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                                <span className="text-white font-medium truncate max-w-xs">
                                    {user.displayName || user.email}
                                </span>
                            </div>
                            <Menu as="div" className="relative">
                                <div>
                                    <Menu.Button 
                                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-200 hover:scale-105"
                                        aria-label="User menu"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-9 w-9 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                                            {user.displayName ? 
                                                user.displayName[0].toUpperCase() : 
                                                user.email[0].toUpperCase()}
                                        </div>
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 divide-y divide-gray-100">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/profile"
                                                        className={`block px-4 py-2 text-sm ${
                                                            active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                                        } transition-colors duration-150`}
                                                        aria-label="Your profile"
                                                    >
                                                        Your Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/settings"
                                                        className={`block px-4 py-2 text-sm ${
                                                            active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                                        } transition-colors duration-150`}
                                                        aria-label="Settings"
                                                    >
                                                        Settings
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                                            active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                                        } transition-colors duration-150`}
                                                        aria-label="Sign out"
                                                    >
                                                        Sign Out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}