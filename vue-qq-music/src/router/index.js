import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 异步加载模块
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  }
  // {
  //   path: '/singer',
  //   componen: Singer,
  //   children: [
  //     {
  //       path: ':id',
  //       component: SingerDetail
  //     }
  //   ]
  // },
  // {
  //   path: '/rank',
  //   componen: Rank,
  //   children: [
  //     {
  //       path: ':id',
  //       component: TopList
  //     }
  //   ]
  // },
  // {
  //   path: '/search',
  //   componen: Search,
  //   children: [
  //     {
  //       path: ':id',
  //       component: SingerDetail
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: UserCenter
  // }
]

const router = new Router({
  routes
})

export default router
