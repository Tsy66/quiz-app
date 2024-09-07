<template>
  <div class="page-container">
    <div class="question-page">
      <h4>{{ quizTitle }}</h4>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth + '%' }"></div>
      </div>
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
      <div v-if="isAnswerChecked" :class="['result-message', messageClass]">
        {{ resultMessage }}
        <audio ref="resultAudio" src=""></audio>
      </div>
      <button v-if="isAnswerChecked" @click="nextQuestion" class="next-button">繼續</button>
    </div>
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
      successMessages: ["正解!いいね!!", "太厲害了!かんぺき!!", "你做到了!すごい!!"],
      failureMessages: ["可惜!再接再厲!!", "差一點!加油!!", "沒關係!下次會更好!!"],
      messageClass: "",
      progressWidth: 0,
      correctCount: 0,
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

        let choices = choicesSnapshot.docs.map(choiceDoc => ({
          choice: choiceDoc.data().choice,
          isRight: choiceDoc.data().is_right_choice,
        }));
        // 在初次設置問題時打亂選項
        choices = this.shuffleArray(choices);

        return {
          question: questionDoc.data().question,
          choices: choices,
        };
      });

      this.questions = await Promise.all(questionsPromises);
      this.currentQuestion = this.questions[this.currentIndex];
      this.updateProgress();
    } else {
      console.error(`Quiz with quiz_id ${quizId} not found.`);
    }
  },
  methods: {
    shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    },
    updateProgress() {
      const totalQuestions = this.questions.length;
      const currentProgress = (this.currentIndex / totalQuestions) * 100;
      this.progressWidth = currentProgress;
    },
    async submitAnswer() {
      const selectedChoice = this.currentQuestion.choices.find(
        (choice) => choice.choice === this.selectedOption
      );
      this.isAnswerChecked = true;

      if (selectedChoice.isRight) {
        this.correctCount++;  // 答對時累加
        this.resultMessage = this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
        this.messageClass = "success";
        await this.$nextTick();
        this.playAudio('correct');
      } else {
        this.resultMessage = this.failureMessages[Math.floor(Math.random() * this.failureMessages.length)];
        this.messageClass = "failure";
        await this.$nextTick();
        this.playAudio('incorrect');
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.currentQuestion = this.questions[this.currentIndex];
        this.currentQuestion.choices = this.shuffleArray(this.currentQuestion.choices);
        this.selectedOption = null;
        this.isAnswerChecked = false;
        this.resultMessage = '';
        this.updateProgress();
      } else {
        localStorage.setItem('quizResult', JSON.stringify({
          correctCount: this.correctCount,
          totalQuestions: this.questions.length
        }));
        this.$router.push({ name: 'QuizResult' });
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
    }
  }
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
  background-image: url('https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.question-page {
  max-width: 30rem;
  max-height: 50rem;
  margin: 1.5rem auto;
  padding: 1.3rem;
  border-radius: 1rem;
  box-shadow: 0 -4px 8px rgb(185, 204, 252), 0 4px 8px rgb(245, 245, 245);
  background-color: #f9f9f9;
  font-size: 1rem;
  margin-top: 5rem;
}

h4 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #32b16d;
}

.question-box {
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 1rem 1rem;
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
  font-weight:  500;
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
  background-color: #a5d6a7;
}

.option.incorrect {
  background-color: #ef9a9a;
}

.option input {
  margin-right: 1rem;
}

.result-message {
  margin-top: 0.5rem;
  font-size: 1.2rem;
}

.success {
  color: green;
}

.failure {
  color: red;
}


.next-button {
  font-weight: bold;
  width: 100%;
  margin-top: 0.5rem;
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

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f3f3f3;
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #32b16d;
  width: 0%;
  transition: width 0.4s ease-in-out;
}
</style>