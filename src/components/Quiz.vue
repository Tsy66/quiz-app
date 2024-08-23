<template>
    <div class="question-page">
      <h2>ch1-1</h2>
      <div class="question-box">
        <p>{{ currentQuestion.question }}</p>
      </div>
      <div class="options">
        <label v-for="(option, index) in currentQuestion.options" :key="index" class="option">
          <input type="radio" :value="option" v-model="selectedOption" @change="submitAnswer(option)" />
          {{ option }}
        </label>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionPage',
    data() {
      return {
        currentQuestion: {
          question: "睡到七點",
          options: ["7時まで寝ました。", " 7時から寝ました。", " 7時のが寝ました。", " 7時まで寝ますか。"]
        },
        selectedOption: null
      };
    },
    // methods: {
    //   submitAnswer(option) {
    //     this.selectedOption = option;
    //     alert(`你選擇了: ${option}`);
    //     // 此處可加入額外的邏輯，例如驗證答案或進行下一步操作
    //   }
    // }
  };
  </script>
  
  <style scoped>
  .question-page {
    max-width: 35rem;
    margin: 1.5rem auto;
    padding: 1.3rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    font-size: 2rem;
    margin-top: 5rem;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #32b16d;
  }
  
  .question-box {
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: bold;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #32b16d;
    border-radius: 0.5rem;
    background-color: #fff;
  }
  
  .options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .option {
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: #1b4584;
    background-color: #ddedfa;
    padding: 0.5rem;
    border: 1px solid #ffffff00;
    border-radius: 0.5rem;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .option:hover {
    background-color: #e0f7e9;
    transform: scale(1.02);
  }
  
  .option input {
    margin-right: 1rem;
  }
  </style>
  