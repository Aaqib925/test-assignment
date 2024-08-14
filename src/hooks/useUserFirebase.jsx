import { database } from '@/firebase/firebase'
import { get, ref, set, update } from 'firebase/database'

export async function getRecentUsers() {
  const usersRef = ref(database, 'todos')
  try {
    const snapshot = await get(usersRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {}
  }
}

export async function getUserById(userId) {
  const todosRef = ref(database, 'todos')
  try {
    const snapshot = await get(todosRef)
    if (snapshot.exists()) {
      const todosObject = snapshot.val()
      const todosArray = Object.values(todosObject)
      const userData = todosArray.find((user) => user.user_id === userId)
      if (userData) {
        return userData
      } else {
        console.log('User not found')
        return null
      }
    } else {
      console.log('No data available')
      return null
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function createTodo(clerkUser, title, description, status) {
  try {
    const userId = clerkUser.id
    const userRef = ref(database, `todos/${userId}`)
    const snapshot = await get(userRef)
    const userData = snapshot.exists() ? snapshot.val() : null

    if (userData) {
      // Ensure todos is an array
      const todos = Array.isArray(userData.todos) ? userData.todos : []

      const todoId = generateTodoId()
      const newTodo = {
        todo_id: todoId,
        title,
        description,
        status,
      }

      // Update the todos array with the new todo
      await update(userRef, {
        todos: [...todos, newTodo],
      })
    } else {
      // Create a new user with the initial todo
      const newUser = {
        user_id: userId,
        full_name: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress.emailAddress,
        todos: [
          {
            todo_id: generateTodoId(),
            title,
            description,
            status,
          },
        ],
      }
      await set(userRef, newUser)
    }
  } catch (error) {
    console.error('Error creating todo:', error)
  }
}

function generateTodoId() {
  return 't' + Date.now()
}

export async function updateTodo(userId, todoId, updatedTodo) {
  try {
    const userRef = ref(database, `todos/${userId}`)
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      const userData = snapshot.val()
      const todoIndex = userData.todos.findIndex((todo) => todo.todo_id === todoId)
      if (todoIndex !== -1) {
        userData.todos[todoIndex] = { ...userData.todos[todoIndex], ...updatedTodo }
        await update(userRef, {
          todos: userData.todos,
        })
        console.log('Todo updated successfully')
      } else {
        console.log('Todo not found')
      }
    } else {
      console.log('User not found')
    }
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

export async function deleteTodo(userId, todoId) {
  try {
    const userRef = ref(database, `todos/${userId}`)
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      const userData = snapshot.val()

      const updatedTodos = userData.todos.filter((todo) => todo.todo_id !== todoId)
      await update(userRef, {
        todos: updatedTodos,
      })
      console.log('Todo deleted successfully')
    } else {
      console.log('User not found')
    }
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}
