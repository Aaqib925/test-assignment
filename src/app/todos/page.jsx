'use client'

import Spinner from '@/components/Spinner'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { CreateTodo } from '@/components/createTodo'
import { Divider } from '@/components/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { deleteTodo, getUserById, updateTodo } from '@/hooks/useUserFirebase'
import { getStatusColor } from '@/utils/statusUtils'
import { useUser } from '@clerk/nextjs'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Todos() {
  const { isLoaded, user } = useUser()
  const [userData, setUserData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      const fetchUser = async () => {
        const fetchedUserData = await getUserById(user.id)
        setUserData(fetchedUserData)
        setIsLoading(false)
      }
      fetchUser()
    }
  }, [isLoaded, user, isModalOpen])

  const handleCreateTodoClick = () => {
    setEditTodo(null)
    setIsModalOpen(true)
  }

  const handleEditTodoClick = (todo) => {
    setEditTodo(todo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleStatusChange = async (todoId, newStatus) => {
    try {
      await updateTodo(user.id, todoId, { status: newStatus })
      setUserData((prevData) => ({
        ...prevData,
        todos: prevData.todos.map((todo) => (todo.todo_id === todoId ? { ...todo, status: newStatus } : todo)),
      }))
      toast.success('Todo status updated successfully!')
    } catch (error) {
      toast.error('Failed to update todo status.')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(user.id, todoId)
      setUserData((prevData) => ({
        ...prevData,
        todos: prevData.todos.filter((todo) => todo.todo_id !== todoId),
      }))
      toast.success('Todo deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete todo.')
    }
  }

  const filteredTodos =
    userData?.todos?.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus ? todo.status === filterStatus : true
      return matchesSearch && matchesStatus
    }) || []

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Todos</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                  name="search"
                  placeholder="Search todos&hellip;"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </div>
            <div>
              <Select name="filter_status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Filter by status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
          </div>
        </div>
        <Button onClick={handleCreateTodoClick}>Create Todo</Button>
      </div>
      <br />
      <br />
      <Divider />

      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : userData && userData.todos?.length > 0 ? (
        <ul className="mt-5">
          {filteredTodos.map((todo, index) => (
            <li key={todo.todo_id}>
              <div className="flex items-center justify-between">
                <div key={todo.todo_id} className="flex flex-col gap-4 py-6">
                  <div className="text-base/6 font-semibold">
                    <Link href={`/todos/${todo.todo_id}`}>{todo.title}</Link>
                  </div>
                  <div className="text-xs/6 text-zinc-500">Description: {todo.description}</div>
                  <div className="text-xs/6 text-zinc-600">
                    Status:
                    <Select
                      name="status"
                      defaultValue={todo.status}
                      className="ml-2"
                      onChange={(e) => handleStatusChange(todo.todo_id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="max-sm:hidden" color={getStatusColor(todo.status)}>
                    {todo.status}
                  </Badge>
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisVerticalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleEditTodoClick(todo)}>Edit</DropdownItem>
                      <DropdownItem onClick={() => handleDeleteTodo(todo.todo_id)}>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <Divider soft={index > 0} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 text-center">
          <p>No todos to show. Create one!</p>
        </div>
      )}

      <CreateTodo isOpen={isModalOpen} onClose={handleCloseModal} editTodo={editTodo} />
    </>
  )
}
