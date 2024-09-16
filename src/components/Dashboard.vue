  <template>
    <div class="dashboard-container">
      <Sidebar/>

      <div class="filter-container">
        <h4>班級成績</h4>
        <div class="qselect">
          <label for="quizSelect">選擇關卡:</label>
          <select id="quizSelect" v-model="selectedQuizId" @change="loadQuizPerformance">
            <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
              {{ quiz.id + quiz.title }}
            </option>
          </select>
        </div>

        <div class="class-select">
          <label for="classSelect">選擇班級:</label>
          <select id="classSelect" v-model="selectedClass" @change="loadQuizPerformance">
            <option v-for="classItem in classes" :key="classItem" :value="classItem">
              {{ classItem }}
            </option>
          </select>
        </div>

        <div class="chart-container">
          <canvas v-if="students.length" ref="scatterChart"></canvas>
        </div>

        <h4 class="sperform">學生表現</h4>
        <div class="student-performance">
          <!-- 學生總覽表格 -->
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>班級</th>
                <th>總答對數</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.class }}</td>
                <td>{{ student.correctCount }}</td>
                <td><button @click="viewStudentDetails(student.id)" class="btn">查看詳細</button></td>
              </tr>
            </tbody>
          </table>

          <!-- 選擇學生後的詳細答題結果 -->
          <div v-if="selectedStudent" class="student-details">
            <h3>{{ selectedStudent.name }} 的答題詳細</h3>
            <table>
              <thead>
                <tr>
                  <th>問題</th>
                  <th>選擇</th>
                  <th>是否正確</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in selectedStudent.results" :key="result.questionId">
                  <td>{{ result.question }}</td>
                  <td>{{ result.choice }}</td>
                  <td>{{ result.isRight ? '正確' : '錯誤' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { nextTick } from 'vue';
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
        selectedClass: null,
        quizzes: [],
        classes: [],
        students: [],
        selectedStudent: null,
        chart: null,
      };
    },
    async created() {
      await this.loadStudentPerformance();
      await this.loadQuizzes();
      await this.loadClasses();
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
      },

      async loadClasses() {
        // 載入所有班級資料
        const studentsRef = collection(db, "user");
        const q = query(studentsRef, where("user_role", "==", "student"));
        const studentSnapshot = await getDocs(q);

        const classSet = new Set();
        studentSnapshot.docs.forEach(doc => {
          const studentData = doc.data();
          classSet.add(studentData.user_class);
        });

        this.classes = Array.from(classSet).sort(); // 將班級按字母排序
      },

      async loadQuizPerformance() {
        if (!this.selectedQuizId || !this.selectedClass) return;

        // 根據選擇的關卡和班級載入成績資料
        const studentsRef = collection(db, "user");
        const q = query(studentsRef, where("user_role", "==", "student"), where("user_class", "==", this.selectedClass));
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

        this.$nextTick(() => {
          if (this.chart) {
            this.chart.destroy(); // 確保 Chart.js 實例完全銷毀
          }
          this.renderChart(); // 在 DOM 更新後重新渲染圖表
        });
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
            // question: questionData.question,
            choice: scoreData.choice,
            isRight: scoreData.is_right,
          };
        }));

        this.selectedStudent = {
          name: studentData.user_name,
          results: results,
        };
      },

      async renderChart() {
        await this.$nextTick(); // 確保 DOM 更新完成

        const canvas = this.$refs.scatterChart;
        if (!canvas) {
          console.error('Canvas element not found');
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Failed to get 2D context from canvas');
          return;
        }

        // 如果已經有 Chart 實例，先銷毀它
        if (this.chart) {
          this.chart.destroy();
        }

        // 計算每個答對題數對應的學生人數分布
        const correctCounts = this.students.map(student => student.correctCount);
        const distribution = correctCounts.reduce((acc, count) => {
          acc[count] = (acc[count] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(distribution); // X 軸顯示的答對題數
        const data = Object.values(distribution); // Y 軸顯示的對應人數

        // 創建新的 Chart 實例
        this.chart = new Chart(ctx, {
          type: 'bar', // 設置為長條圖
          data: {
            labels: labels,
            datasets: [{
              label: `${this.selectedQuizId} 成績人數`,
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                title: { display: true, text: '答對題數' },
                beginAtZero: true
              },
              y: {
                title: { display: true, text: '學生人數' },
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
    display: 1;
    max-width: 60rem;
    max-height: 50rem;
    margin: 2rem auto;
    padding: 1rem;
    border-radius: 1rem;
    background-color: #f9f9f971;
    font-size: 1rem;
    margin-right: 40rem;
    margin-top: -1rem;
  }

  .filter-container h4 {
    color: rgb(13, 47, 119);
  }

  .chart-container {
    margin-bottom: 20px;
    width: 40rem;
    height: 40rem;
  }

  .sperform {
    margin-top: -20rem;
    color: rgb(13, 47, 119);
  }

  .btn {
    background-color: aliceblue;
    color: rgb(13, 47, 119);
    font-family: "Kiwi Maru", serif;
    font-style: normal;
    margin-bottom: 1rem;
    border-radius: 0.8rem;
  }

  .student-performance {
    display: block;
    max-width: 40rem;
    border-radius: 1rem;
    font-size: 1rem;
    max-height: 15rem;
    overflow: auto;
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
    max-width: 40rem;
  }

  #quizSelect {
    display: block;
    visibility: visible;
  }

  .qselect {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }

  .qselect label {
    color: rgb(13, 47, 119);
    font-size: 14px;
  }

  .qselect select {
    width: 10rem;
    height: 2rem;
    margin-left: 1rem;
  }

  .class-select {
    margin: 10px 0;
    display: flex;
    direction: ltr;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    margin-right: -14rem;
    margin-top: -2.6rem;
  }

  .class-select select {
    display: block;
    width: 10rem;
    height: 2rem;
    margin-left: 1rem;
  }

  .class-select label {
    color: rgb(13, 47, 119);
    font-size: 14px;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(207, 206, 206, 0.856);
    border-radius: 10px;
  }
  </style>