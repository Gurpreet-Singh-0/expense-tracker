"use client";

import Header from './Header';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname.includes('/auth/');
    
    if (isAuthPage) {
        return (
            <AnimatePresence mode='wait'>
                <motion.div
                    key="auth-page"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-screen"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <div className="flex flex-1">
                <Sidebar />
                
                <div className="md:pl-64 flex flex-col flex-1 w-0  transition-all duration-300 ease-in-out">
                    <Header />
                    
                    <main className="flex-1 pb-20"> 
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="py-6"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {/* Page title - optional */}
                                {pathname !== '/' && (
                                    <div className="mb-6">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                                            {pathname.split('/').pop()?.charAt(0).toUpperCase() + 
                                             pathname.split('/').pop()?.slice(1).replace(/-/g, ' ') || 'Dashboard'}
                                        </h1>
                                        <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2" />
                                    </div>
                                )}
                                
                                {/* Content container with subtle shadow and rounded corners */}
                                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100/50">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
            
          
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-10 md:pl-64 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex items-center justify-center text-sm">
                        <span className="text-gray-500">
                            © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}