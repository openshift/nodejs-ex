import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Calculate from '@/components/Calculate/Calculate'
import Android from '@/components/Android/Android'
import Calendar from '@/components/Calendar/Calendar'
import Alert from '@/components/Alert/Alert'
import Files from '@/components/Files/Files'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
    	path: '/calculate',
    	name: 'Calculate',
    	component: Calculate
    },
    {
    	path: '/android',
    	name: 'Android',
    	component: Android
    },
    {
    	path: '/calendar',
    	name: 'Calendar',
    	component: Calendar
    },
    {
    	path: '/alert',
    	name: 'Alert',
    	component: Alert
    },
    {
    	path: '/files',
    	name: 'Files',
    	component: Files
    }

  ],
  mode: 'history'
})
