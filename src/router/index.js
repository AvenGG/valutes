import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Authorization from '../views/Authorization.vue'
import Registration from '../views/Registration.vue'
import NavigationPanel from '../views/NavigationPanel.vue'
import Wallet from '../views/Wallet.vue'
import NotFound from '../views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: NavigationPanel,
    children:[
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'wallet',
        name: "Wallet",
        component: Wallet,
        props: true,
        beforeEnter: (to, from, next) =>{
          if(localStorage.getItem('user'))
            next()
          else{
            next({name: 'Authorization'})
          }
        }
      },
      {
        path: 'authorization',
        name: 'Authorization',
        component: Authorization,
        beforeEnter: (to, from, next) =>{
          if(!localStorage.getItem('user'))
            next()
          else{
            next({name: 'Home'})
          }
        }
      },
      {
        path: 'registration',
        name: 'Registration',
        component: Registration,
        beforeEnter: (to, from, next) =>{
          if(!localStorage.getItem('user'))
            next()
          else{
            next({name: 'Home'})
          }
        }
      },

    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
 
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
