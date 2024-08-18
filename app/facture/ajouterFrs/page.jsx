'use client'
import React from 'react'
import AjtFrs from '@/components/AjtFrs'
import { useSession } from 'next-auth/react'
const page = () => {
  const {data:session}=useSession()
  if (!session) {
    return <p>you are not logged in</p>;
  }
  return (
    
    <AjtFrs/>
  )
}

export default page