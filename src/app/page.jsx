'use client'

import Spinner from '@/components/Spinner'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getUserById } from '@/hooks/useUserFirebase'
import { getStatusColor } from '@/utils/statusUtils'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function Stat({ title, value, change }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <br />
      <Divider />
    </div>
  )
}

export default function Home() {
  const { isLoaded, user } = useUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoaded && user) {
      const fetchUser = async () => {
        try {
          const fetchedUserData = await getUserById(user.id)
          setUserData(fetchedUserData)
        } catch (err) {
          setError('Failed to load user data.')
          console.error('Error fetching user data:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }
  }, [isLoaded, user])

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  if (error) return <p>{error}</p>

  const todosCount = userData?.todos.length || 0

  return (
    <>
      <Heading className="w-full">Welcome, {user?.fullName || 'User'}</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total todos" value={todosCount} change="+0%" />
      </div>
      <Subheading className="mt-14">Recent todos</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData?.todos.length > 0 ? (
            <>
              {userData.todos.slice(0, 3).map((todo) => (
                <TableRow key={todo.todo_id}>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.description}</TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(todo.status)}>{todo.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <Link href={`/todos/${user.id}`}>
                    <button className="text-blue-500 hover:text-blue-700">Show more</button>
                  </Link>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={3}>You have not created any todos yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
