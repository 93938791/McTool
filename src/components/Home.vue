<template>
  <div class="container">
    <main class="main">
      <div class="card">
        <h2>通行证配置</h2>
        <p>BattlePass</p>
        <router-link class="button" to="/BattlePass">前往通行证配置</router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: white;
}

.header,
.footer {
  padding: 1rem;
  background-color: #007bff;
  text-align: center;
  transition: all 0.3s ease;
}

.main {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: #007bff;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 240px;
  max-width: 500px;
  text-align: center;
}

.button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: #007bff;
  background-color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #f5f5f5;
}
</style>
