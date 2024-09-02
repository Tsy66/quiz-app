<template>
  <div class="question-page">
    <h4>{{ quizTitle }}</h4>
    <div class="question-box">
      <p>{{ currentQuestion.question }}</p>
    </div>
    <div class="options">
      <label
        v-for="(option, index) in currentQuestion.choices"
        :key="index"
        :class="[
          'option', 
          { 
            selected: selectedOption === option.choice,
            correct: isAnswerChecked && option.isRight,
            incorrect: isAnswerChecked && selectedOption === option.choice && !option.isRight
          }
        ]"
      >
        <input 
          type="radio" 
          :value="option.choice" 
          v-model="selectedOption" 
          :disabled="isAnswerChecked" 
        />
        {{ option.choice }}
      </label>
    </div>
    <button v-if="selectedOption && !isAnswerChecked" @click="submitAnswer" class="next-button">提交</button>
    <div v-if="isAnswerChecked" class="result-message">
      {{ resultMessage }}
      <audio ref="resultAudio" src=""></audio>
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
      isAnswerChecked: false,
      resultMessage: '',
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
  methods: {
    async submitAnswer() {
      const selectedChoice = this.currentQuestion.choices.find(
        (choice) => choice.choice === this.selectedOption
      );
      this.isAnswerChecked = true;

      if (selectedChoice.isRight) {
        this.resultMessage = "恭喜！你選對了。";
        await this.$nextTick();
        this.playAudio('correct');
      } else {
        this.resultMessage = "很抱歉，這不是正確答案。";
        await this.$nextTick();
        this.playAudio('incorrect');
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.currentQuestion = this.questions[this.currentIndex];
        this.selectedOption = null;
        this.isAnswerChecked = false;
        this.resultMessage = '';
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

h4 {
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

.option.correct {
  background-color: #a5d6a7; /* 綠色表示正確答案 */
}

.option.incorrect {
  background-color: #ef9a9a; /* 紅色表示錯誤答案 */
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