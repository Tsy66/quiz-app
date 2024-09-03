<template>
    <div class="result-page">
      <h2>答題結果</h2>
      <div class="result-summary">
        <p>總分: {{ score }}/{{ totalQuestions }}</p>
        <p>正確題數: {{ correctCount }}</p>
        <p>錯誤題數: {{ incorrectCount }}</p>
      </div>
      <div class="actions">
        <button @click="goHome" class="action-button">返回主頁</button>
        <button @click="retryQuiz" class="action-button">重新開始</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuizResult',
    data() {
      return {
        score: 0,
        totalQuestions: 0,
        correctCount: 0,
        incorrectCount: 0,
      };
    },
    async created() {
      // 假設你在 route query 中傳遞了結果數據
      this.score = this.$route.query.score || 0;
      this.totalQuestions = this.$route.query.totalQuestions || 0;
      this.correctCount = this.$route.query.correctCount || 0;
      this.incorrectCount = this.$route.query.incorrectCount || 0;
    },
    methods: {
      goHome() {
        this.$router.push({ name: 'home' });  // 假設有一個名為 'home' 的路由
      },
      retryQuiz() {
        this.$router.push({ name: 'quiz', params: { quizId: this.$route.query.quizId } });
      },
    },
  };
  </script>
  
  <style scoped>
  .result-page {
    max-width: 35rem;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    text-align: center;
  }
  
  h2 {
    color: #32b16d;
    margin-bottom: 1rem;
  }
  
  .result-summary {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-button {
    padding: 0.8rem 1.5rem;
    background-color: #32b16d;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .action-button:hover {
    background-color: #28a15a;
  }
  </style>  