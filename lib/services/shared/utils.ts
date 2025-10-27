"use server"
import { cookies } from 'next/headers'

export async function saveTokenToCookie(token: string) {
  // Server-side cookie setting (recommended for production)
  const cookieStore = await cookies()
  cookieStore.set('authToken', token, {
    httpOnly: true, // Prevents client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function getAccessToken(): Promise<string | null> {
  try {
    // Try server-side cookies first (more secure)
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value
    if (token) return token
  } catch {
    // Server-side cookies not available (client-side context)
  }

  return null
}

export async function clearAuthToken() {
  try {
    // Clear server-side cookie
    const cookieStore = await cookies()
    cookieStore.delete('authToken')
  } catch {
    // Server-side cookies not available
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken()
  return token !== null
}

// Server action for client components to check authentication status
export async function checkAuthStatus() {
  "use server"

  const token = await getAccessToken()
  return {
    isAuthenticated: token !== null
  }
}

// Server action to get current user for client components
export async function getCurrentUserForClient() {
  "use server"

  const token = await getAccessToken()
  if (!token) {
    return { user: null }
  }

  // Import here to avoid circular dependencies
  const { getCurrentUser } = await import('@/lib/services/users/get')
  const result = await getCurrentUser()

  if (result.success) {
    return { user: result.user }
  }

  return { user: null }
}