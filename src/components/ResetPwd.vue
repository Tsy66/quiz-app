<template>
  <div class="page-container">
    <div class="reset-password-container">
      <h4>重設密碼</h4>
      <form @submit.prevent="resetPassword">
        <div class="input-field">
          <input type="email" id="email" class="inputph" placeholder="請輸入您的電子郵件" v-model="email" required/>
        </div>
        <button type="submit" class="btn waves-effect waves-light">
          發送重設密碼郵件
        </button>
      </form>
        <a href="/login" class="btn waves-effect waves-light">
          返回登入
        </a>
      <p v-if="message">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  
  export default {
    name: 'ResetPwd',
    setup() {
      const email = ref('');
      const message = ref('');
      const error = ref('');
  
      const resetPassword = async () => {
        const auth = getAuth();
        try {
          await sendPasswordResetEmail(auth, email.value);
          message.value = '重設密碼的郵件已發送，請檢查你的信箱。';
          error.value = '';  // 清除錯誤訊息
        } catch (err) {
          error.value = '發送重設密碼郵件失敗: ' + err.message;
          message.value = '';  // 清除成功訊息
        }
      };
  
      return {
        email,
        message,
        error,
        resetPassword
      };
    }
  };
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-image: url('https://images.unsplash.com/photo-1647707342987-f8ebafc8de58?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .reset-password-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 5rem;
    text-align: center;
    max-width: 100%;
    margin: 1rem auto;
    border-radius: 2.5rem;
    box-shadow: 0 -4px 8px rgb(223, 222, 222), 0 4px 8px rgb(255, 255, 255);
    background-color: #ffffffe5;
    font-size: 1.3rem;
    margin-top: 5rem;
    color: rgb(48, 111, 184);
  }

  .reset-password-container button {
    font-family: "Kiwi Maru", serif;
    font-style: normal;
    margin-bottom: 1rem;
    border-radius: 0.8rem;
  }

  .inputph {
    font-family: "Kiwi Maru", serif;
    font-style: normal;
    color: rgb(48, 111, 184);
  }

  .inputph::placeholder {
    color: rgba(48, 112, 184, 0.454);
  }

  a {
    border-radius: 0.8rem;
  }
  
  .input-field {
    margin-bottom: 20px;
  }
  
  .btn {
    background-color: rgb(53, 140, 181);
  }

  .error {
    color: red;
  }
  </style>  