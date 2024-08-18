'use client'
import React from 'react'
import Facture from '@/components/Facture'
import { useSession } from "next-auth/react"; 


const page = () => {
  const { data: session } = useSession();
  if (!session) {
    return <p>you are not logged in</p>;
  }
 
  return (
    <div>
    <Facture />
    </div>
     )
}

export default page