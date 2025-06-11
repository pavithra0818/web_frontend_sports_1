'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import NewsDashboard from '@/components/NewsDashboard'
import PayoutCalculator from '@/components/PayoutCalculator'
import NewsAnalyticsChart from '@/components/NewsAnalyticsChart'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-black dark:text-white">News Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-200 mr-4">
                Welcome, {user?.email ? user.email.split('@')[0] : user?.name}
              </span>
              <button
                onClick={() => {
                  // TODO: Implement logout
                  router.push('/auth/login')
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg min-h-[400px] flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="w-full">
              <NewsAnalyticsChart />
              <NewsDashboard />
              <PayoutCalculator />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 