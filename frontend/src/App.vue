<template>
  <div id="app">
    <nav v-if="isLoggedIn">
      <a @click="triggerOpenModal" class="add-todo-link">Tambah Tugas Baru</a>
      <button @click="logout">Logout</button>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import emitter from './eventBus';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(!!localStorage.getItem('user-token'));

function triggerOpenModal() {
  emitter.emit('open-add-modal');
}

function logout() {
  localStorage.removeItem('user-token');
  isLoggedIn.value = false;
  router.push('/');
}

watch(route, () => {
  isLoggedIn.value = !!localStorage.getItem('user-token');
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #f4f7f6;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  border-bottom: 1px solid #dee2e6;
  
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.add-todo-link {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  cursor: pointer;
  background-color: #e9ecef;
  padding: 8px 15px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}
.add-todo-link:hover {
  background-color: #d1d7de;
  transform: scale(1.05);
}
.add-todo-link:active {
  transform: scale(0.98);
}

nav button {
  padding: 8px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
}
nav button:hover {
  background-color: #c82333;
  transform: scale(1.05);
}
nav button:active {
  transform: scale(0.98);
}

.main-content {
  padding-top: 20px;
}
</style>