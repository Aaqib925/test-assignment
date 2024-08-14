import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getUserById } from '@/hooks/useUserFirebase'
import { getStatusColor } from '@/utils/statusUtils'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  let user = await getUserById(params.id)

  return {
    title: `${user?.full_name}'s TODOs`,
  }
}

export default async function TodoList({ params }) {
  let user = await getUserById(params.id)

  if (!user) {
    notFound()
  }

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Home
        </Link>
      </div>
      <br />

      <Heading className="w-full">{user.full_name}s TODOs</Heading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.todos.map((todo) => (
            <TableRow key={todo.todo_id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>
                <Badge color={getStatusColor(todo.status)}>{todo.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
