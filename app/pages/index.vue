<template>
  <div class="min-h-screen bg-neutral-800 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-100 mb-2">Todo List</h1>
        <p class="text-gray-400">Manage your tasks efficiently</p>
      </div>

      <!-- Add Todo Form -->
      <Card class="mb-6">
        <template #content>
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <InputText
                id="title"
                v-model="newTodo.title"
                placeholder="Enter todo title"
                class="w-full"
                @keyup.enter="handleCreateTodo"
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                v-model="newTodo.description"
                placeholder="Enter todo description (optional)"
                class="w-full"
                rows="3"
                @keyup.ctrl.enter="handleCreateTodo"
              />
            </div>
            <Button
              label="Add Todo"
              icon="pi pi-plus"
              @click="handleCreateTodo"
              :loading="loading"
              :disabled="!newTodo.title.trim()"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Error Message -->
      <Message v-if="error" severity="error" :closable="false" class="mb-6">
        {{ error }}
      </Message>

      <!-- Loading State -->
      <div v-if="loading && todos.length === 0" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        <p class="mt-4 text-gray-400">Loading todos...</p>
      </div>

      <!-- Empty State -->
      <Card v-else-if="!loading && todos.length === 0">
        <template #content>
          <div class="text-center py-12">
            <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
            <p class="text-gray-400 text-lg">No todos yet. Create your first todo!</p>
          </div>
        </template>
      </Card>

      <!-- Todos List -->
      <div v-else class="space-y-4">
        <Card v-for="todo in todos" :key="todo.id" class="hover:shadow-lg transition-shadow">
          <template #content>
            <div class="flex items-start gap-4">
              <Checkbox
                :model-value="todo.completed"
                :binary="true"
                @update:model-value="(value) => handleToggleTodo(todo.id, value as boolean)"
                class="mt-1"
              />
              <div class="flex-1 min-w-0">
                <h3
                  :class="[
                    'text-lg font-semibold mb-1',
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-100'
                  ]"
                >
                  {{ todo.title }}
                </h3>
                <p
                  v-if="todo.description"
                  :class="[
                    'text-gray-400 mb-2',
                    todo.completed && 'line-through text-gray-400'
                  ]"
                >
                  {{ todo.description }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <i class="pi pi-calendar mr-1"></i>
                    Created: {{ formatDate(todo.createdAt) }}
                  </span>
                  <span v-if="todo.updatedAt !== todo.createdAt">
                    <i class="pi pi-clock mr-1"></i>
                    Updated: {{ formatDate(todo.updatedAt) }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  @click="openEditDialog(todo)"
                  :disabled="loading"
                  v-tooltip.top="'Edit'"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="handleDeleteTodo(todo.id)"
                  :loading="loading"
                  v-tooltip.top="'Delete'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Edit Dialog -->
    <Dialog
      v-model:visible="editDialogVisible"
      modal
      header="Edit Todo"
      :style="{ width: '500px' }"
      :closable="true"
    >
      <div class="space-y-4">
        <div>
          <label for="edit-title" class="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <InputText
            id="edit-title"
            v-model="editingTodo.title"
            placeholder="Enter todo title"
            class="w-full"
          />
        </div>
        <div>
          <label for="edit-description" class="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            id="edit-description"
            v-model="editingTodo.description"
            placeholder="Enter todo description (optional)"
            class="w-full"
            rows="3"
          />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="editingTodo.completed"
            :binary="true"
            inputId="edit-completed"
          />
          <label for="edit-completed" class="text-sm font-medium text-gray-300">
            Completed
          </label>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="editDialogVisible = false"
        />
        <Button
          label="Save"
          @click="handleUpdateTodo"
          :loading="loading"
          :disabled="!editingTodo.title?.trim()"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { useTodos } from '../composables/useTodos';

const { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();

const newTodo = ref<CreateTodoInput>({
  title: '',
  description: '',
});

const editDialogVisible = ref(false);
const editingTodo = ref<UpdateTodoInput & { id?: number }>({
  title: '',
  description: '',
  completed: false,
});

const handleCreateTodo = async () => {
  if (!newTodo.value.title.trim()) return;

  try {
    await createTodo({
      title: newTodo.value.title.trim(),
      description: newTodo.value.description?.trim() || undefined,
    });
    newTodo.value = { title: '', description: '' };
  } catch (err) {
    // Error is handled by the composable
  }
};

const handleToggleTodo = async (id: number, completed: boolean) => {
  try {
    await toggleTodo(id, completed);
  } catch (err) {
    // Error is handled by the composable
  }
};

const handleUpdateTodo = async () => {
  const title = editingTodo.value.title?.trim();
  if (!title || !editingTodo.value.id) return;

  try {
    await updateTodo(editingTodo.value.id, {
      title: title,
      description: editingTodo.value.description?.trim() || undefined,
      completed: editingTodo.value.completed,
    });
    editDialogVisible.value = false;
    editingTodo.value = { title: '', description: '', completed: false };
  } catch (err) {
    // Error is handled by the composable
  }
};

const handleDeleteTodo = async (id: number) => {
  if (!confirm('Are you sure you want to delete this todo?')) return;

  try {
    await deleteTodo(id);
  } catch (err) {
    // Error is handled by the composable
  }
};

const openEditDialog = (todo: Todo) => {
  editingTodo.value = {
    id: todo.id,
    title: todo.title,
    description: todo.description || '',
    completed: todo.completed,
  };
  editDialogVisible.value = true;
};

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  fetchTodos();
});
</script>
