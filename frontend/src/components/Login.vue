<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <h2>{{ isRegistering ? 'Buat Akun Baru' : 'Selamat Datang' }}</h2>
      <p class="subtitle">{{ isRegistering ? 'Isi data untuk mendaftar.' : 'Silakan masuk ke akun Anda.' }}</p>
      
      <div class="form-group">
        <input v-model="username" type="text" placeholder="Username" @keyup.enter="handleSubmit" />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" @keyup.enter="handleSubmit" />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      
      <button @click="handleSubmit" class="submit-button">
        {{ isRegistering ? 'Register' : 'Login' }}
      </button>

      <p class="toggle-form">
        {{ isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?' }}
        <a @click="toggleForm">{{ isRegistering ? 'Login di sini' : 'Daftar sekarang' }}</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const error = ref('');
const isRegistering = ref(false);
const router = useRouter();

function toggleForm() {
  isRegistering.value = !isRegistering.value;
  error.value = '';
}

async function handleSubmit() {
  if (isRegistering.value) {
    await handleRegister();
  } else {
    await handleLogin();
  }
}

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Username dan password tidak boleh kosong.';
    return;
  }
  try {
    error.value = '';
    const response = await axios.post('/user/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('user-token', response.data.token);
    router.push('/todo');
  } catch (err) {
    error.value = 'Username atau password salah!';
  }
}

async function handleRegister() {
  if (!username.value || !password.value) {
    error.value = 'Username dan password tidak boleh kosong.';
    return;
  }
  try {
    error.value = '';
    await axios.post('/user/register', {
      username: username.value,
      password: password.value
    });
    await handleLogin();
  } catch (err) {
    error.value = 'Username sudah digunakan atau terjadi kesalahan.';
  }
}
</script>

<style scoped>
.login-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

.subtitle {
  margin-top: 0;
  margin-bottom: 30px;
  color: #777;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.submit-button:hover {
  background-color: #369f73;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.toggle-form {
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
}

.toggle-form a {
  color: #42b983;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
.toggle-form a:hover {
  text-decoration: underline;
}
</style>