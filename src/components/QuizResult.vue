<template>
    <div class="page-container">
      <div class="result-page">
        <h3>試験終了</h3>
        <div class="result-summary">
          <p>{{ correctCount }}/{{ totalQuestions }}</p>
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
        correctCount: 0,
        totalQuestions: 0
      };
    },
    created() {
      const result = JSON.parse(localStorage.getItem('quizResult'));
      if (result) {
        this.correctCount = result.correctCount;
        this.totalQuestions = result.totalQuestions;
      }
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
    background-color: rgb(129, 177, 250);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-image: url('https://images.unsplash.com/photo-1599173704879-2e407aa34cde?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .result-page {
    max-width: 40rem;
    margin: 1rem auto;
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9dc;
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