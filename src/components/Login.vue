<template>
  <div class="container">
    <div class="top"></div>
    <h3>ログイン</h3>
    <form id="login-form" @submit.prevent="signIn">
      <div class="input-field">
        <input type="text" id="email" placeholder="帳號 アカウント" v-model="email" required>
        <label for="email"></label>
      </div>
      <div class="input-field">
        <input type="password" id="password" placeholder="密碼 パスワード" v-model="password" required>
        <label for="password"></label>
        <span id="toggle-password" @click="togglePasswordVisibility">
          <i class="fas fa-eye"></i>
        </span>
      </div>
      <button type="submit" class="btn waves-effect waves-light">登入</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '/src/config/firebaseConfig.js';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const passwordVisible = ref(false);
    const passwordIcon = ref('fas fa-eye');
    const router = useRouter();
    const db = getFirestore();

    const signIn = async () => {
      try {
        // 使用 Firebase Authentication 登入
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        // console.log('User signed in:', userCredential.user.uid);

        // 查詢 Firestore 獲取用戶角色
        const userDoc = doc(db, 'user', userCredential.user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (userData.user_role === 'teacher') {
            // 跳轉到教師頁面
            router.push('/class');
          } else if (userData.user_role === 'student') {
            // 跳轉到學生頁面
            router.push('/class');
          } else {
            error.value = '未設定用戶角色';
          }
        } else {
          error.value = '用戶資料不存在';
        }
      } catch (err) {
        console.error('Firebase Error:', err); 
        error.value = '登入失敗: ' + err.message;
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
      const passwordInput = document.getElementById('password');
      if (passwordVisible.value) {
        passwordInput.type = 'text';
        passwordIcon.value = 'fas fa-eye-slash';
      } else {
        passwordInput.type = 'password';
        passwordIcon.value = 'fas fa-eye';
      }
    };

    return {
      email,
      password,
      error,
      signIn,
      togglePasswordVisibility,
      passwordIcon
    };
  }
};

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Dela+Gothic+One&family=DotGothic16&display=swap');
  
  body, button, input {
      font-family: "Darumadrop One", "DotGothic16";
      font-weight: 400;
      font-style: normal;
  }
  
  .top{
      width: 100%;
      max-width: 400px;
      padding: 5rem;
  }
  
  .container {
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 2rem;
  }
  
  h3 {
    text-align: center;
  }
  
  .btn {
    margin-left: 40%;
    border-radius: 8px;
  }
  
  .input-field {
    position: relative;
  }
  
  #toggle-password {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
  }
  
  #toggle-password i {
      font-size: 1.2em;
      color: #aaa;
  }
</style>
