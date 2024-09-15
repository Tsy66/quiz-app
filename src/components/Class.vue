<template>
  <div class="app-container">
    <Sidebar />
    <div class="class-manager">
      <h3>班級管理</h3>
      <div class="import-students">
        <span>匯入學生資料
          <input type="file" @change="handleFileUpload" />
          <button @click="importStudents" class="custom-button">匯入</button>
        </span>
      </div>

      <div class="academicYear-choose">
        <span>班級學生名單
          <select class="select-css" v-model="selectedClass" @change="loadStudents">
            <option v-for="classOption in classes" :key="classOption" :value="classOption">
              {{ classOption }}
            </option>
          </select>
        </span>
      </div>

      <div class="student-list" v-if="students.length">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>班級</th>
              <th>電子郵件</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.user_id">
              <td>{{ student.user_name }}</td>
              <td>{{ student.user_class }}</td>
              <td>{{ student.user_email }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db, auth } from '@/config/firebaseConfig';
import { collection, getDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, deleteUser } from "firebase/auth";
import * as XLSX from 'xlsx';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'class',
  components: {
    Sidebar,
  },
  setup() {
    const classes = ref([]);
    const selectedClass = ref(null);
    const students = ref([]);
    const file = ref(null);

    // 讀取班級資料
    const loadClasses = async () => {
      const usersRef = collection(db, 'user');
      const userSnapshot = await getDocs(usersRef);
      const classSet = new Set();
      
      userSnapshot.docs.forEach((doc) => {
        const userData = doc.data();
        if (userData.user_class) {
          classSet.add(userData.user_class);
        }
      });

      classes.value = Array.from(classSet);
    };

    // 根據選擇的班級讀取學生資料
    const loadStudents = async () => {
      if (!selectedClass.value) return;

      const usersRef = collection(db, 'user');
      const userSnapshot = await getDocs(usersRef);
      students.value = userSnapshot.docs
        .map((doc) => doc.data())
        .filter((student) => student.user_class === selectedClass.value);
    };

    // 處理文件上傳
    const handleFileUpload = (event) => {
      const files = event.target.files;
      if (files.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          students.value = XLSX.utils.sheet_to_json(worksheet);
        };
        reader.readAsArrayBuffer(files[0]);
      }
    };

    const importStudents = async () => {
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      for (const student of students.value) {
        const { name, email, password, user_class, user_id } = student;

        // 確保 user_id 是字符串
        const userId = String(user_id);

        // 檢查電子郵件是否已經註冊
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
          skippedCount++;
          continue;
        }

        // 創建 Firebase Authentication 用戶
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const uid = user.uid;

          // 檢查 Firestore 中是否已經存在該 uid
          const userDocRef = doc(db, "user", uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            skippedCount++;
            continue;
          }

          // 在 Firestore 中新增用戶資料
          await setDoc(userDocRef, {
            user_class: user_class,
            user_name: name,
            user_id: userId, // 使用從 Excel 輸入的 user_id
            user_role: 'student',
            user_email: email
          });

          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      alert(`匯入完成！成功 ${successCount} 位學生，跳過 ${skippedCount} 位學生，失敗 ${errorCount} 位學生。`);
      loadStudents();
    };

    onMounted(() => {
      loadClasses();
    });

    return {
      classes,
      selectedClass,
      students,
      loadStudents,
      handleFileUpload,
      importStudents
    };
  },
};
</script>
  
  <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Dela+Gothic+One&family=DotGothic16&display=swap');

    .app-container {
      display: flex;
      height: 100vh;
      margin-left: 1rem;
      background-image: url('@/assets/img/masaaki-komori-14cHwhRKJh8-unsplash.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin: 0;
    }

    .content {
      flex-grow: 1;
      padding: 2rem;
    }

    .import-students {
      text-align: left;
      margin-top: 15rem;
      border: 1px solid #32b16d;
      background-color: rgba(249, 255, 127, 0.128);
      border-radius: 4rem;
      max-width: 40rem;
      padding: 0.7rem;
      margin: 2rem auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.053);
    }

    .import-students span {
      font-size: large;
      margin-left: 2rem;
    }

    .import-students input {
      margin-left: 2rem;
    }

    /* 匯入按鈕 */
    .custom-button {
      background-color: #32b16d;
      color: #fff;
      padding: 0.5rem 1.2rem;
      border: none;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: bolder; 
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .custom-button:hover {
      background-color: #2a935b;
    }

    .custom-button:active {
      transform: scale(0.95);
    }

    .custom-button:focus {
      outline: none;
    }

    .custom-button:disabled {
      background-color: #cccccc; 
      cursor: not-allowed;
    }

    .class-manager {
      text-align: center;
      color: #32b16d;
      margin-left: 2rem;
    }

    .academicYear-choose {
      text-align: left;
      border: 1px solid #32b16d;
      background-color: rgba(249, 255, 127, 0.128);
      border-radius: 4rem;
      max-width: 40rem;
      padding: 1rem;
      margin: 2rem auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.053);
    }

    .academicYear-choose span {
      font-size: large;
      margin-left: 2rem;
    }

    .select-css {
      display: inline-block;
      width: 25%;
      height: 2.5rem;
      margin-left: 1rem;
      border: 1px solid #32b16d;
      border-radius: 1rem;
    }

    .student-list {
      width: 100%;
      max-height: 25rem;
      background-color: #ffffff71;
      color: rgb(0, 0, 0);
      border-radius: 1.5rem;
      padding: 0.5rem 1.5rem;
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: #ece55eb4 #f1f1f100;
    }
  </style>  