'use client'

import Spinner from '@/components/Spinner'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import User from '@/firebase/currentUser'
import { getRecentUsers } from '@/hooks/useUserFirebase'
import { getStatusColor } from '@/utils/statusUtils'
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
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getRecentUsers()
        setUsers(Object.values(fetchedUsers))
      } catch (err) {
        setError('Failed to load users.')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  if (error) return <p>{error}</p>

  return (
    <>
      <Heading className="w-full">Welcome, {<User />}</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total users" value={users.length} change="+0%" />
      </div>
      <Subheading className="mt-14">Recent users</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Todos</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.todos && user.todos.length >= 1 ? (
                  <ul>
                    {user.todos.slice(0, 3).map((todo) => (
                      <li key={todo.todo_id}>
                        <strong>{todo.title}</strong>: {todo.description} -{' '}
                        <Badge color={getStatusColor(todo.status)}>{todo.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>This user has not created any todos yet.</div>
                )}
              </TableCell>
              <TableCell>
                {user.todos && user.todos.length >= 1 && (
                  <Link href={`/todos/${user.user_id}`}>
                    <button className="text-blue-500 hover:text-blue-700">Show more</button>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
