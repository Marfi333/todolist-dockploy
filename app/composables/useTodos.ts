import type { Todo, CreateTodoInput, UpdateTodoInput } from '~/app/types/todo';

export const useTodos = () => {
  const todos = ref<Todo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTodos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<Todo[]>('/api/todos');
      todos.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch todos';
      console.error('Error fetching todos:', err);
    } finally {
      loading.value = false;
    }
  };

  const createTodo = async (input: CreateTodoInput) => {
    loading.value = true;
    error.value = null;
    try {
      const newTodo = await $fetch<Todo>('/api/todos', {
        method: 'POST',
        body: input,
      });
      todos.value.push(newTodo);
      return newTodo;
    } catch (err: any) {
      error.value = err.message || 'Failed to create todo';
      console.error('Error creating todo:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTodo = async (id: number, input: UpdateTodoInput) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedTodo = await $fetch<Todo>(`/api/todos/${id}`, {
        method: 'PUT',
        body: input,
      });
      const index = todos.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
      return updatedTodo;
    } catch (err: any) {
      error.value = err.message || 'Failed to update todo';
      console.error('Error updating todo:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTodo = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      todos.value = todos.value.filter((t) => t.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete todo';
      console.error('Error deleting todo:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    return updateTodo(id, { completed });
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};

