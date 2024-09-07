 <template>
  <div class="app-container">
    <Sidebar />  
    <div class="class-manager">
      <br>
      <h3>班級管理</h3>
        <div class="import-students">
          <span>匯入學生資料
            <input type="file" @change="handleFileUpload" />
            <button @click="importStudents" class="custom-button">匯入</button>
          </span>
        </div>

        <div class="academicYear-choose">
          <span>學年度選擇&管理
            <select class="select-css">
              <option>110</option>
              <option>111</option>
              <option>112</option>
            </select>
          </span>
        </div>
    </div>
  </div>
 </template>
  
 <script>
  import * as XLSX from "xlsx";
  import { ref } from "vue";
  import { auth, db } from "@/config/firebaseConfig";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { setDoc, doc } from "firebase/firestore";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    name: "class",
    components: {
      Sidebar,
    },
    setup() {
      const file = ref(null);
      const students = ref([]);
  
      const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            students.value = XLSX.utils.sheet_to_json(worksheet);
          };
          reader.readAsArrayBuffer(files[0]);
        }
      };
  
      const importStudents = async () => {
        for (const student of students.value) {
          const { name, email, password, class: userClass } = student;
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;
  
            await setDoc(doc(db, "user", uid), {
              user_id: uid,
              user_email: email,
              user_name: name,
              user_class: userClass,
              user_answers: []
            });
            console.log(`User ${name} imported successfully`);
          } catch (error) {
            console.error(`Error importing user ${name}:`, error);
          }
        }
      };
  
      return {
        handleFileUpload,
        importStudents
      };
    }
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

  </style>  