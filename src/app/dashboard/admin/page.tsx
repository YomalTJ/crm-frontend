import SamurdhiFamillyForm from '@/components/forms/SamurdhiFamillyForm'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div>
      <h1 className='text-3xl text-white font-semibold'>Admin Dashboard</h1>

      <div className="space-y-6 mt-10">
        <SamurdhiFamillyForm />
      </div>
    </div>
  )
}

export default AdminDashboard
