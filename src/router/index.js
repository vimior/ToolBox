import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/Editor'
import WebSSH from '@/components/WebSSH'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WebSSH',
      component: WebSSH
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor
    },
    {
      path: '/webssh',
      name: 'WebSSH',
      component: WebSSH
    }
  ]
})
