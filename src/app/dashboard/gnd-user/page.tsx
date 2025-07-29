'use client'

import SamurdhiFamillyForm from '@/components/forms/SamurdhiFamillyForm'
import { useTheme } from '@/context/ThemeContext'

const DepartmentManagerDashboard = () => {
  const { theme } = useTheme()

  return (
    <div>
      <h1 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Grama Niladhari Division Dashboard
      </h1>

      <div className="space-y-6 mt-10">
        <SamurdhiFamillyForm />
      </div>
    </div>
  )
}

export default DepartmentManagerDashboard
