<template>
    <div class="dashboard-container">
      <Sidebar/>
      
      <div class="filter-container">
        <h4>班級成績</h4>
        <div>
            <label for="quizSelect">選擇關卡:</label>
            <select id="quizSelect" v-model="selectedQuizId" @change="loadQuizPerformance">
            <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                {{ quiz.id + quiz.title }}
            </option>
            </select>
        </div>

        <div class="chart-container">
            <canvas ref="scatterChart"></canvas>
        </div>

        <div class="student-performance">
            <h4>學生表現</h4>
            <ul>
            <li v-for="student in students" :key="student.id">
                <h4>{{ student.name }}</h4>
                <p>班級: {{ student.class }}</p>
                <p>總答對數: {{ student.correctCount }}</p>
                <button @click="viewStudentDetails(student.id)">查看詳細</button>
            </li>
            </ul>

            <div v-if="selectedStudent" class="student-details">
                <h3>{{ selectedStudent.name }} 的答題詳細</h3>
                <ul>
                <li v-for="result in selectedStudent.results" :key="result.questionId">
                    <p>問題: {{ result.question }}</p>
                    <p>選擇: {{ result.choice }}</p>
                    <p>是否正確: {{ result.isRight ? '正確' : '錯誤' }}</p>
                </li>
                </ul>
            </div>
        </div>
      </div>

    </div>
  </template>
  
  <script>
  import { db } from "@/config/firebaseConfig";
  import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
  import Chart from 'chart.js/auto';
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    name: 'Dashboard',
    components: {
      Sidebar,
    },
    data() {
      return {
        selectedQuizId: null,
        quizzes: [],
        students: [],
        selectedStudent: null,
        chart: null,
      };
    },
    async created() {
      await this.loadStudentPerformance();
      await this.loadQuizzes();
      this.renderChart();
    },
    methods: {
      async loadQuizzes() {
        // 載入所有關卡資料
        const quizzesRef = collection(db, "quizzes");
        const quizSnapshot = await getDocs(quizzesRef);

        this.quizzes = quizSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: data.quiz_id, // 使用正確的 ID 屬性
            title: data.title,
            };
        });

        // 對關卡進行排序
        this.quizzes.sort((a, b) => {
            const numA = parseInt(a.id.replace('ch', ''));
            const numB = parseInt(b.id.replace('ch', ''));
            return numA - numB;
        });

        console.log(this.quizzes); // 確認排序後的結果
        },

      async loadQuizPerformance() {
        if (!this.selectedQuizId) return;

        // 根據選擇的關卡載入班級成績資料
        const studentsRef = collection(db, "user");
        const q = query(studentsRef, where("user_role", "==", "student"));
        const studentSnapshot = await getDocs(q);

        this.students = await Promise.all(studentSnapshot.docs.map(async (doc) => {
            const studentData = doc.data();
            const scoresRef = collection(db, `user/${doc.id}/scores/${this.selectedQuizId}/questions`);
            const scoresSnapshot = await getDocs(scoresRef);
            const correctCount = scoresSnapshot.docs.reduce((count, scoreDoc) => count + (scoreDoc.data().is_right ? 1 : 0), 0);

            return {
            id: doc.id,
            name: studentData.user_name,
            class: studentData.user_class,
            correctCount: correctCount,
            };
        }));

        this.renderChart();
      },

      async loadStudentPerformance() {
        // 載入班級成績資料
        const studentsRef = collection(db, "user");
        const q = query(studentsRef, where("user_role", "==", "student"));
        const studentSnapshot = await getDocs(q);
  
        this.students = await Promise.all(studentSnapshot.docs.map(async (doc) => {
          const studentData = doc.data();
          const scoresRef = collection(db, `user/${doc.id}/scores`);
          const scoresSnapshot = await getDocs(scoresRef);
          const correctCount = scoresSnapshot.docs.reduce((count, scoreDoc) => count + (scoreDoc.data().correct_count || 0), 0);
  
          return {
            id: doc.id,
            name: studentData.user_name,
            class: studentData.user_class,
            correctCount: correctCount,
          };
        }));
      },
      
      async viewStudentDetails(studentId) {
        // 顯示特定學生的詳細答題結果
        const studentRef = doc(db, `user/${studentId}`);
        const studentDoc = await getDoc(studentRef);
        const studentData = studentDoc.data();
  
        const scoresRef = collection(db, `user/${studentId}/scores`);
        const scoresSnapshot = await getDocs(scoresRef);
  
        const results = await Promise.all(scoresSnapshot.docs.map(async (scoreDoc) => {
          const scoreData = scoreDoc.data();
          const questionId = scoreData.question_id;
  
          const questionRef = doc(db, `quizzes/${scoreData.quiz_id}/questions/${questionId}`);
          const questionDoc = await getDoc(questionRef);
          const questionData = questionDoc.data();
  
          return {
            questionId: questionId,
            question: questionData.question,
            choice: scoreData.choice,
            isRight: scoreData.is_right,
          };
        }));
  
        this.selectedStudent = {
          name: studentData.user_name,
          results: results,
        };
      },
      
      renderChart() {
        const ctx = this.$refs.scatterChart.getContext('2d');

        // 如果已經有 Chart 實例，先銷毀它
        if (this.chart) {
            this.chart.destroy();
        }

        const data = {
            labels: [this.selectedQuizId],
            datasets: [{
            label: `關卡 ${this.selectedQuizId} 學生答對題數`,
            data: [{
                x: this.selectedQuizId,
                y: this.students.reduce((total, student) => total + student.correctCount, 0) // 總答對數
            }],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
            }]
        };

        // 創建新的 Chart 實例
        this.chart = new Chart(ctx, {
            type: 'bar', // 設置為長條圖
            data: data,
            options: {
            scales: {
                x: {
                title: { display: false, text: '關卡' },
                stacked: true
                },
                y: {
                title: { display: true, text: '答對題數' },
                beginAtZero: true
                }
            }
            }
        });
        }
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    height: 100vh;
    background-image: url('https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .filter-container {
    display: block;
    max-width: 60rem;
    max-height: 50rem;
    margin: 2rem auto;
    padding: 1.3rem;
    border-radius: 1rem;
    background-color: #f9f9f971;
    font-size: 1rem;
    margin-right: 50rem;
  }

  .chart-container {
    margin-bottom: 20px;
    width: 30rem;
  }
  
  .chart-container canvas{
    width: 30rem;
  }

  .student-performance {
    display: block;
    max-width: 30rem;
    border-radius: 1rem;
    font-size: 1rem;

  }

  .student-performance ul {
    list-style-type: none;
    padding: 0;
  }
  
  .student-performance li {
    margin-bottom: 10px;
  }
  
  .student-details {
    margin-top: 20px;
  }

  #quizSelect {
    display: block;
    visibility: visible;
  }
  </style>