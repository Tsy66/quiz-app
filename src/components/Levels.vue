<template>
  <div class="level-overview">
    <h2>關卡總覽</h2>
    <div class="levels-container">
      <div v-for="level in levels" :key="level.id" 
           class="level-circle"
           @click="selectLevel(level.id)">
        {{ level.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Levels',
  data() {
    return {
      levels: Array.from({ length: 25 }, (_, i) => ({
        id: `ch${i + 1}`,
      })),
    };
  },
  methods: {
    selectLevel(levelId) {
      // 使用 this.$router 來進行路由導航
      this.$router.push({ name: 'Quiz', params: { quizId: levelId } });
    },
  },
};
</script>

<style scoped>
.level-overview {
  text-align: center;
  padding: 2rem;
}

.levels-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  justify-items: center;
  margin-top: 2rem;
}

.level-circle {
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  background-color: #32b16d; /* 預設背景色 */
  color: white;
  transition: transform 0.2s;
}

.level-circle:hover {
  transform: scale(1.1);
}
</style>
