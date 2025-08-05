'use client'

import SamurdhiFamillyForm from '@/components/forms/SamurdhiFamillyForm'
import { useTheme } from '@/context/ThemeContext'

const DepartmentManagerDashboard = () => {
  const { theme } = useTheme()

  return (
    <div>
      <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        ප්‍රජා සවිබල ගැන්වීමේ පවුල් සංවර්ධන සැලැස්ම-
        Family Development plan for Community Empowerment   / சமூக வலுவூட்டல் திட்டத்தின் குடும்ப அபிவிருத்தித் திட்டமிடல்
      </h1>

      <div className="space-y-6 mt-10">
        <SamurdhiFamillyForm />
      </div>
    </div>
  )
}

export default DepartmentManagerDashboard
