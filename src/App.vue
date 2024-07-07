<template>
  <main>
    <header class="app-header">
      <div class="header-content">
        <h1>Command Center</h1>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
          <button @click="logout">Logout</button>
        </nav>
      </div>
    </header>
    <router-view></router-view>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'Home' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

body {
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-header {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

nav {
  display: flex;
  gap: 20px;
}

nav a, nav button {
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  transition: background-color 0.3s ease;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

nav a:hover, nav button:hover {
  background-color: #555;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
