<template>
  <div class="page-container">
    <div class="level-overview">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhShXin0WCfbKIH6ByqHX3m2knmP4dzwdIkiRK-EwMsMEEns3zOkwhZ78Rk6G7MdWID_0Ih8FdEGGn1wkhWNo4xHpr4rsSBM5JD4NfuZfSJim9-QYH9KokeK_vCHHeFeRViH7cBtWXYtBg/s400/juken_goukaku_ema.png" alt="合格絵馬" />
      <h2>レベル</h2>
      <div class="levels-container">
        <div v-for="level in levels" :key="level.id" 
             class="level-circle"
             @click="selectLevel(level.id)">
          {{ level.id }}
        </div>
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
meta[name="viewport"] {
  content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
}

.page-container {
  background-color: rgb(129, 177, 250);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 0;
}

h2{
  color: #f46b21;
  margin-top: -0.5rem;
}

img{
  max-width: 8rem;
  height: 8rem;
  margin-left: 16rem;
  margin-top: -15rem;
  margin-bottom: -2rem;
  transform: rotate(15deg);
}

.level-overview {
  text-align: center;
  padding: 1rem;
  max-width: 100%;
  margin: 1rem auto;
  border-radius: 2.5rem;
  box-shadow: 0 -4px 8px rgb(223, 222, 222), 0 4px 8px rgb(255, 247, 15);
  background-color: #ffffff;
  font-size: 1.3rem;
  margin-top: 5rem;
}

.levels-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); 
  gap: 1rem;
  justify-items: center;
  margin-top: 2rem;
  width: 100%;
  max-height: 30rem;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #ece55e #f1f1f1;
}

.level-circle {
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  background-color: #ebef29;
  color: rgb(96, 116, 195);
  transition: transform 0.2s;
}

.level-circle:hover {
  transform: scale(1.1);
}
</style>
