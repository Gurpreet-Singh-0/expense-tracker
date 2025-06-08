'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20"
      >
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700/50">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3 ring-2 ring-indigo-400/50">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
                <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 tracking-tight">
                  ExpenseTracker
                </h1>
              </div>
            </div>

            <nav className="mt-2 flex-1 px-2 space-y-1.5">
              {navigation.map((item) => (
                <motion.div 
                  key={item.name} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-1"
                >
                  <Link
                    href={item.href}
                    className={`
                      ${pathname === item.href
                        ? 'bg-gray-900/80 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    `}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <item.icon
                      className={`
                        ${pathname === item.href
                          ? 'text-indigo-400'
                          : 'text-gray-400 group-hover:text-indigo-300'
                        }
                        mr-3 h-5 w-5 flex-shrink-0
                      `}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                    {pathname === item.href && (
                      <span className="absolute right-4 w-2 h-2 bg-indigo-400 rounded-full" aria-hidden="true" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-700/50 p-4">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Sign out"
            >
              <ArrowLeftOnRectangleIcon 
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" 
                aria-hidden="true"
              />
              <span className="truncate">Sign out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 z-30 w-full flex justify-around items-center bg-white border-t border-gray-200/75 shadow-lg md:hidden"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div 
              key={item.name}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium ${
                  isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                } transition-colors duration-200`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={`relative p-1.5 rounded-lg ${isActive ? 'bg-indigo-50' : ''}`}>
                  <item.icon 
                    className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} 
                    aria-hidden="true"
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full" aria-hidden="true" />
                  )}
                </div>
                <span className="mt-1">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </>
  );
}