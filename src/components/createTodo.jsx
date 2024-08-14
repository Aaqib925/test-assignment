import { Button } from '@/components/button'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { createTodo, updateTodo } from '@/hooks/useUserFirebase' // Import the updateTodo function
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export function CreateTodo({ isOpen, onClose, editTodo }) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title)
      setDescription(editTodo.description)
      setStatus(editTodo.status)
    }
  }, [editTodo])

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description cannot be empty.')
      return
    }

    try {
      if (editTodo) {
        // Update the todo
        await updateTodo(user.id, editTodo.todo_id, { title, description, status })
        toast.success('Todo updated successfully!')
      } else {
        // Create a new todo
        await createTodo(user, title, description, status)
        toast.success('Todo created successfully!')
      }

      setError('') // Clear the error message
      setTitle('')
      setDescription('')
      onClose() // Close the modal after saving
    } catch (e) {
      setError(editTodo ? 'Failed to update todo.' : 'Failed to create todo.')
      toast.error(editTodo ? 'Failed to update todo.' : 'Failed to create todo.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-lg rounded-lg bg-[#18181B] p-8 shadow-lg">
        <Heading level={2} className="mb-6 text-lg text-white">
          {editTodo ? 'Edit Todo' : 'Create Todo'}
        </Heading>
        {error && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-800 p-4 text-white">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        <InputGroup className="mb-6">
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-300">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
            className="bg-[#18181B] text-white placeholder-gray-500"
          />
        </InputGroup>
        <br />
        <InputGroup className="mb-6">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter todo description"
            className="bg-[#18181B] text-white placeholder-gray-500"
            rows={4}
          />
        </InputGroup>
        <br />
        <div className="mb-6">
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-300">
            Status
          </label>
          <Dropdown>
            <DropdownButton className="bg-[#18181B] text-white">{status}</DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatus('Pending')}>Pending</DropdownItem>
              <DropdownItem onClick={() => setStatus('In Progress')}>In Progress</DropdownItem>
              <DropdownItem onClick={() => setStatus('Completed')}>Completed</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={handleSave} color='pink'>{editTodo ? 'Save Changes' : 'Create'}</Button>
          <Button onClick={onClose} >Cancel</Button>
        </div>
      </div>
    </div>
  )
}
