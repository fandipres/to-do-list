<template>
  <div class="todo-container">
    <div class="todo-card">
      <h2 class="list-title">Daftar Tugas Anda</h2>
      <ul class="todo-list">
        <li v-for="item in todos" :key="item.id">
          <span class="todo-title">{{ item.todo }}</span>
          <button @click="showDeleteModal(item.id)" class="delete-btn">×</button>
        </li>
      </ul>
      <p v-if="todos.length === 0" class="empty-message">
        Belum ada tugas. Klik tombol di header untuk memulai!
      </p>
    </div>
  </div>

  <div v-if="isAddModalVisible" class="modal-overlay" @click.self="closeAddModal">
    <div class="modal-card">
      <h3>Tambah Tugas Baru</h3>
      <div class="input-group">
        <input 
          v-model="newTodoText" 
          @keyup.enter="addTodo" 
          placeholder="Tulis tugas baru..."
          ref="addTodoInput"
        />
        <button @click="addTodo">Tambah</button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalVisible" class="modal-overlay">
    <div class="modal-card">
      <h3>Konfirmasi Hapus</h3>
      <p>Apakah Anda yakin ingin menghapus tugas ini?</p>
      <div class="modal-buttons">
        <button @click="cancelDelete" class="btn-cancel">Batal</button>
        <button @click="confirmDelete" class="btn-confirm">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';
import emitter from '../eventBus';

const todos = ref([]);
const newTodoText = ref('');
let wsClient = null;

const isAddModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const todoToDelete = ref(null);
const addTodoInput = ref(null);

const openAddModal = async () => {
  isAddModalVisible.value = true;
  await nextTick();
  if (addTodoInput.value) {
    addTodoInput.value.focus();
  }
};

const closeAddModal = () => {
  isAddModalVisible.value = false;
  newTodoText.value = '';
};

async function addTodo() {
  if (!newTodoText.value.trim()) return;
  try {
    const response = await axios.post('/todo', { todo: newTodoText.value });
    todos.value = response.data;
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("Gagal menambah todo:", error);
  } finally {
    closeAddModal();
  }
}

const showDeleteModal = (id) => {
  todoToDelete.value = id;
  isDeleteModalVisible.value = true;
};

const cancelDelete = () => {
  isDeleteModalVisible.value = false;
  todoToDelete.value = null;
};

async function confirmDelete() {
  if (todoToDelete.value === null) return;
  try {
    const response = await axios.delete(`/todo/${todoToDelete.value}`);
    todos.value = response.data;
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("Gagal menghapus todo:", error);
  } finally {
    cancelDelete();
  }
}

onMounted(() => {
  emitter.on('open-add-modal', openAddModal);
  axios.get('/todo').then(res => todos.value = res.data);
  const token = localStorage.getItem('user-token');
  wsClient = new WebSocket(`ws://localhost:3000/todo?token=${token}`);
  wsClient.onmessage = (event) => {
    todos.value = JSON.parse(event.data);
  };
});

onUnmounted(() => {
  emitter.off('open-add-modal', openAddModal);
  if (wsClient) {
    wsClient.close();
  }
});
</script>

<style scoped>
.todo-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.todo-card {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.list-title {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}
.todo-list { list-style-type: none; padding: 0; margin: 0; }
.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.todo-title { color: #333; }

.delete-btn {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}
.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}
.delete-btn:active {
  transform: scale(0.95);
}

.empty-message { text-align: center; color: #777; margin-top: 20px; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  z-index: 1000;
}
.modal-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.modal-card h3 { margin-top: 0; }
.modal-buttons { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
.modal-buttons button{
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-cancel { background-color: #f0f0f0; }
.btn-confirm { background-color: #dc3545; color: white; }

.input-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.input-group input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.input-group button {
  padding: 12px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>