import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import FileManagePage from '../views/FileManagePage.vue'
import UserProfilePage from '../views/UserProfilePage.vue'
import AdminUserManagePage from '../views/AdminUserManagePage.vue'
import talk from '../views/talkAboutPage.vue'
import ApiLogPage from '../views/ApiLogPage.vue'
import CommandInjection from '../views/CommandInjection.vue'
import store from '@/store'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/file-manage',
    name: 'FileManagePage',
    component: FileManagePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-profile',
    name: 'UserProfilePage',
    component: UserProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-user-manage',
    name: 'AdminUserManagePage',
    component: AdminUserManagePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/talk',
    name: 'talk',
    component: talk,
    meta: { requiresAuth: true }
  },
  {
    path: '/CommandInjection',
    name: 'CommandInjection',
    component: CommandInjection,
    meta: { requiresAuth: true }
  },
  {
    path: '/ApiLogPage',
    name: 'ApiLogPage',
    component: ApiLogPage,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new Router({
  routes
})
// 定义白名单
const whiteList = ['/login', '/register', '/about']
// 路由守卫：未登录用户重定向到登录页
router.beforeEach((to, from,next) => {
  const token = store.state.token // 获取 Vuex 中存储的 token

  // 检查是否在白名单中
  if (whiteList.includes(to.path)) {
    next() // 放行
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果需要认证且没有 token，则重定向到登录页
    if (!token) {
      next('/login')
    } else {
      next() // 有 token，继续导航
    }
  } else {
    // 其他情况直接放行
    next()
  }
})
export default router
