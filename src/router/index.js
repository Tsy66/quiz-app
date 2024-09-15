// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Class from '@/components/Class.vue';
import Fallback from '@/components/Fallback.vue';
import Levels from '@/components/Levels.vue';
import Quiz from '@/components/Quiz.vue';
import QuizResult from '@/components/QuizResult.vue';
import Dashboard from '@/components/Dashboard.vue';
import ResetPwd from '@/components/ResetPwd.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/class', name: 'Class', component: Class },
  { path: '/fallback', name: 'Fallback', component: Fallback },
  { path: '/levels', name: 'Levels', component: Levels },
  { path: '/quiz/:quizId', name: 'Quiz', component: Quiz, props: true, },
  { path: '/quizresult', name: 'QuizResult', component: QuizResult},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard},
  { path: '/resetpwd', name: 'ResetPwd', component: ResetPwd},
]

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;