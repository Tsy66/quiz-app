<template>
  <div class="question-page">
    <h2>{{ quizTitle }}</h2>
    <div class="question-box">
      <p>{{ currentQuestion.question }}</p>
    </div>
    <div class="options">
      <label v-for="(option, index) in currentQuestion.choices" :key="index" class="option">
        <input type="radio" :value="option.choice" v-model="selectedOption" @change="submitAnswer(option)" />
        {{ option.choice }}
      </label>
    </div>
  </div>
</template>
  
<script>
import { db } from "@/config/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default {
  name: 'Quiz',
  data() {
    return {
      quizTitle: '',
      quiznum: '',
      currentQuestion: {
        question: '',
        choices: [],
      },
      selectedOption: null,
    };
  },
  async created() {
  const quizId = this.$route.params.quizId;
  const quizzesRef = collection(db, "quizzes");
  const q = query(quizzesRef, where("quiz_id", "==", quizId));
  const quizSnapshot = await getDocs(q);
  
  if (!quizSnapshot.empty) {
    const quizDoc = quizSnapshot.docs[0];
    this.quizTitle = quizDoc.data().title;

    const questionsCollectionRef = collection(quizDoc.ref, "questions");
    const questionSnapshot = await getDocs(questionsCollectionRef);

    const questionsPromises = questionSnapshot.docs.map(async questionDoc => {
      const choicesCollectionRef = collection(questionDoc.ref, "choices");
      const choicesSnapshot = await getDocs(choicesCollectionRef);

      const choices = choicesSnapshot.docs.map(choiceDoc => ({
        choice: choiceDoc.data().choice,
        isRight: choiceDoc.data().is_right_choice,
      }));

      return {
        question: questionDoc.data().question,
        choices: choices,
      };
    });

    const questionsData = await Promise.all(questionsPromises);
    this.currentQuestion = questionsData[0]; // 預設顯示第一個問題
  } else {
    console.error(`Quiz with quiz_id ${quizId} not found.`);
  }
},
  methods: {
    submitAnswer(option) {
      this.selectedOption = option.choice;
      alert(`你選擇了: ${option.choice}`);
    },
  },
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
  