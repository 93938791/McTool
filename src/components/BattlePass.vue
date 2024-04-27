<template>
  <div class="main">
    <h1 :style="bgStyle" class="title">战斗通行证设置</h1>
    <div class="grid-container">
      <div class="card daily-task-card" @click="activeComponent = 'DailyTaskSettings'">
        <div class="card-icon">
          <i class="fas fa-sun"></i>
        </div>
        <div class="nav-link">
          <div class="card-body">
            <h5 class="card-title">每日任务设置</h5>
          </div>
        </div>
      </div>
      <div class="card weekly-task-card" @click="activeComponent = 'WeeklyTaskSettings'">
        <div class="card-icon">
          <i class="fas fa-calendar-week"></i>
        </div>
        <div class="nav-link">
          <div class="card-body">
            <h5 class="card-title">每周任务设置</h5>
          </div>
        </div>
      </div>
      <div class="card reward-card" @click="activeComponent = 'RewardSettings'">
        <div class="card-icon">
          <i class="fas fa-gift"></i>
        </div>
        <div class="nav-link">
          <div class="card-body">
            <h5 class="card-title">通行证奖励设置</h5>
          </div>
        </div>
      </div>
      <div class="card pass-task-card" @click="activeComponent = 'PassTaskSettings'">
        <div class="card-icon">
          <i class="fas fa-passport"></i>
          <!-- 替换为你的图标 -->
        </div>
        <div class="nav-link">
          <div class="card-body">
            <h5 class="card-title">通行证任务设置</h5>
            <!-- 替换为你的标题 -->
          </div>
        </div>
      </div>
    </div>
    <component style="margin-top: 20px" :is="activeComponent"></component>
  </div>
</template>

<script>
import RewardSettings from "./RewardSettings.vue";
import DailyTaskSettings from "./DailyTaskSettings.vue";
import WeeklyTaskSettings from "./WeeklyTaskSettings.vue";
import PassTaskSettings from "./PassTaskSettings.vue"; // 导入你的通行证任务设置的组件

export default {
  data() {
    return {
      activeComponent: null,
      bgColor: "#f8f9fa", // 初始背景颜色
    };
  },
  components: {
    RewardSettings,
    DailyTaskSettings,
    WeeklyTaskSettings,
    PassTaskSettings, // 添加你的通行证任务设置的组件
  },
  computed: {
    bgStyle() {
      let color;
      switch (this.activeComponent) {
        case "RewardSettings":
          color = "#6c757d";
          break;
        case "DailyTaskSettings":
          color = "#28a745";
          break;
        case "WeeklyTaskSettings":
          color = "#17a2b8";
          break;
        case "PassTaskSettings":
          color = "#dc3545";
          break;
        default:
          color = "#f8f9fa";
      }
      return `background-image: radial-gradient(circle, ${color} 0%, transparent 100%); background-position: bottom;`;
    },
  },
  created() {
    this.activeComponent = "DailyTaskSettings";
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  font-family: Arial, sans-serif;
  height: 100vh;
  background-color: #fffff0;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: #495057;
}

.grid-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Add this line */
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  width: 200px;
  height: 85px; /* Change this line */
  cursor: pointer;
}

.card:hover {
  transform: scale(1.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.reward-card {
  background-color: #6c757d;
}

.daily-task-card {
  background-color: #28a745;
}

.weekly-task-card {
  background-color: #17a2b8;
}

.pass-task-card {
  background-color: #dc3545;
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.card-title,
.nav-link {
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
  padding-bottom: 9px;
}

.nav-link {
  text-decoration: none;
}
</style>
