<template>
  <div class="container">
    <header class="header">
      <h1>欢迎来到首页</h1>
    </header>
    <main class="main">
      <p>点击下方按钮前往通行证配置页面</p>
      <router-link class="button" to="/BattlePass">前往通行证配置</router-link>
    </main>
    <footer class="footer">
      <p>© 2022 我的公司</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加一些脚本，如果需要的话
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header, .footer {
  padding: 1rem;
  background-color: #42b983;
  color: white;
  text-align: center;
}

.header {
  margin-bottom: auto;
}

.footer {
  margin-top: auto;
}

.main {
  padding: 1rem;
  text-align: center;
}

.button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  background-color: #42b983;
  text-decoration: none;
  border-radius: 5px;
}
</style>