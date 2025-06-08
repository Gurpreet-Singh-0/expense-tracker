"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
 onAuthStateChanged,
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signOut,
 updateProfile
} from 'firebase/auth';

import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                })
            } else {
                setUser(null);
            }
            setLoading(false);
        })
        return () => unsubscribe();
    }, []);

    const signup = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            // Update local state immediately after profile update
            setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: name,
            });
            return userCredential.user;
        } catch(error) {
            console.error("Signup error:", error);
            throw error;
        }
    }

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch(error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        } catch(error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    const updateUserProfile = async (updates) => {
  try {
    await updateProfile(auth.currentUser, updates);
    setUser({
      ...user,
      ...updates
    });
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const deleteUserAccount = async () => {
  try {
    await deleteUser(auth.currentUser);
    setUser(null);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

    const value = {
        user,
        loading,
        signup,
        login,
        updateUserProfile,
        deleteUserAccount,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}