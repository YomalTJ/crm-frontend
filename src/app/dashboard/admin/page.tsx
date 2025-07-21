import { getCurrentUser } from '@/lib/auth';
import React from 'react'
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  const user = await getCurrentUser();
  
    if (!user || user.role !== 'user') {
        redirect('/signin')
      }

  return (
    <div>
      <h1 className='text-3xl text-white font-semibold'>Admin Dashboard</h1>
    </div>
  )
}

export default AdminDashboard
