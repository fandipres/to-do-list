import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Todo from './components/Todo.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('user-token')) {
        next();
      } else {
        next({ name: 'Login' }); 
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;