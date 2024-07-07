<template>
  <section class="home-container">
    <div class="content">
      <h2>Welcome to the Command Center</h2>
      <router-link to="/dashboard">
        <button class="dashboard-button">Go to Dashboard</button>
      </router-link>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

body {
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/fondo.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.content {
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 40px;
  border-radius: 8px;
  color: #fff;
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.dashboard-button {
  background-color: #4CAF50;
  color: white;
  padding: 15px 32px;
  text-align: center;
  font-size: 16px;
  margin: 20px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-button:hover {
  background-color: #45a049;
}
</style>
