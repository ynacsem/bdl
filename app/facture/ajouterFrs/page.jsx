'use client'
import React from 'react'
import AjtFrs from '@/components/AjtFrs'
import { useSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'
const page = () => {
  const {data:session,status}=useSession()
  useEffect(()=>{
    if (status === 'loading') {
      // Wait for the session status to resolve
      return;
  }

  if (!session) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
  }
  },[])
  return (
    
    <AjtFrs/>
  )
}

export default page