<!-- src/views/DashboardView.vue -->
<template>
  <div class="dashboard">
    <UserInfo />
    <button @click="logout">Logout</button>
    <nav>
      <router-link to="/tokens">Tokens</router-link>
      <router-link to="/nfts">NFTs</router-link>
      <router-link to="/user">User</router-link>
      <router-link to="/statistics">Statistics</router-link>
      <router-link to="/tournament-section">Tournaments</router-link>
   
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import UserInfo from '@/components/UserInfo.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

nav {
  margin-top: 20px;
}

nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}
</style>
