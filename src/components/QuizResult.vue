<template>
    <div class="page-container">
      <div class="result-page">
        <h3>試験終了</h3>
        <div class="result-summary">
          <p>總分: {{ score }}/{{ totalQuestions }}</p>
        </div>
        <div class="actions">
          <button @click="goHome" class="action-button">返回主頁</button>
        </div>
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
      this.score = this.$route.query.score || 0;
      this.totalQuestions = this.$route.query.totalQuestions || 0;
    },
    methods: {
      goHome() {
        this.$router.push({ name: 'Levels' });
      }
    },
  };
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  .result-page {
    max-width: 40rem;
    margin: 1rem auto;
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    text-align: center;
  }
  
  h3 {
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
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: bold;
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