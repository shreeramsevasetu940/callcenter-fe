import MemberForm from '@/components/MemberForm';
import { useSession } from 'next-auth/react';
import React from 'react'

const Settings = () => {
    const { data: session } = useSession();
  
  return (
  <MemberForm staffId={session?.user?.user_id}/>
  )
}

export default Settings
