'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/authSlice'

const queryClient = new QueryClient()

function AuthBootstrapper() {
  const dispatch = useDispatch()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (user) {
        dispatch(setUser(JSON.parse(user)))
      }
    }
  }, [dispatch])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrapper />
          {children}
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  )
} 