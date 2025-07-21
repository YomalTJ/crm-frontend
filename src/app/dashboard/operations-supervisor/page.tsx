import { getCurrentUser } from '@/lib/auth';
import React from 'react'
import { redirect } from "next/navigation";

const OperationSupervisorDashboard = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== 'user') {
      redirect('/signin')
    }

  return (
    <div>
      <h1 className='text-3xl text-white font-semibold'>Operation Supervisor Dashboard</h1>
    </div>
  )
}

export default OperationSupervisorDashboard
