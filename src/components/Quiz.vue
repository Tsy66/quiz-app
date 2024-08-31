<template>
  <div class="question-page">
    <h2>{{ quizTitle }}</h2>
    <div class="question-box">
      <p>{{ currentQuestion.question }}</p>
    </div>
    <div class="options">
      <label
        v-for="(option, index) in currentQuestion.choices"
        :key="index"
        :class="['option', { selected: selectedOption === option.choice }]"
      >
        <input type="radio" :value="option.choice" v-model="selectedOption" />
        {{ option.choice }}
      </label>
    </div>
    <button v-if="selectedOption && !isAnswerChecked" @click="submitAnswer" class="next-button">提交</button>
    <div v-if="isAnswerChecked" class="result-message">
      {{ resultMessage }}
      <audio ref="resultAudio" src=""></audio> <!-- 加入音效元素 -->
    </div>
    <button v-if="isAnswerChecked" @click="nextQuestion" class="next-button">繼續</button>
  </div>
</template>
  
<script>
import { db } from "@/config/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import correctSound from '@/assets/sounds/correct_sound.mp3';
import incorrectSound from '@/assets/sounds/incorrect_sound.mp3';

export default {
  name: 'Quiz',
  data() {
    return {
      quizTitle: '',
      currentQuestion: {
        question: '',
        choices: [],
      },
      selectedOption: null,
      questions: [],
      currentIndex: 0,
      isAnswerChecked: false, // 用來標記是否已檢查答案
      resultMessage: '', // 顯示選擇結果
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
      const questionQuery = query(questionsCollectionRef, orderBy("question_id"));
      const questionSnapshot = await getDocs(questionQuery);

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

      this.questions = await Promise.all(questionsPromises);
      this.currentQuestion = this.questions[this.currentIndex];
    } else {
      console.error(`Quiz with quiz_id ${quizId} not found.`);
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs.resultAudio); // 應該顯示 audio 元素
    });
  },
  methods: {
    async submitAnswer() {
      const selectedChoice = this.currentQuestion.choices.find(
        (choice) => choice.choice === this.selectedOption
      );
      this.isAnswerChecked = true;

      if (selectedChoice.isRight) {
        this.resultMessage = "恭喜！你選對了。";
        await this.$nextTick(); // 等待 DOM 更新
        this.playAudio('correct');
      } else {
        this.resultMessage = "很抱歉，這不是正確答案。";
        await this.$nextTick(); // 等待 DOM 更新
        this.playAudio('incorrect');
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.currentQuestion = this.questions[this.currentIndex];
        this.selectedOption = null; // 重置選擇的選項
        this.isAnswerChecked = false; // 重置答案檢查狀態
        this.resultMessage = ''; // 清空結果訊息
      } else {
        alert("你已完成所有題目！");
      }
    },
    playAudio(result) {
      const audioElement = this.$refs.resultAudio;
      if (audioElement) {
        audioElement.src = result === 'correct' ? correctSound : incorrectSound;
        audioElement.load();
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.error('Audio element is undefined');
      }
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
  font-size: 1.5rem;
  margin-top: 5rem;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
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
  font-size: 1rem;
  color: #1b4584;
  background-color: #ddedfa;
  padding: 0.5rem;
  border: 1px solid #ffffff00;
  border-radius: 0.5rem;
  transition: background-color 0.3s, transform 0.2s;
}

.option.selected {
  background-color: #b3e5fc;
}

.option input {
  margin-right: 1rem;
}

.result-message {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #f44336;
}

.next-button {
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background-color: #32b16d;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: #28a15a;
}
</style>