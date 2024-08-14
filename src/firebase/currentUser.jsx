'use client'
import { useUser } from '@clerk/nextjs'

export default function User() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return <span>Loading...</span>
  }

  return <span>{user.fullName}</span>
}
