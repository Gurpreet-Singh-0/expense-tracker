"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function Home(){
  const router = useRouter();
  const {user,loading} = useAuth();
  
  useEffect(()=>{
    if(!loading){
      if(user){
        router.push("/dashboard");
      }else{
        router.push('/auth/login');
      }
    }
  },[user,loading,router]);

  return(
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}