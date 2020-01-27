import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import store from '../store'
import ShowRecipe from '@/views/ShowRecipe.vue'
import MojiRecepti from '@/views/paneli/Korisnik/MojiRecepti.vue'
import ListajKomentare from '@/views/paneli/Moderator/ListajKomentare.vue'
import Recepti from '@/views/paneli/Moderator/Recepti.vue'
import Glavni_Meni from '@/views/paneli/Glavni_Meni.vue'
import PromenaSifre from '@/views/paneli/Korisnik/PromenaSifre.vue'
import Namirnice from '@/views/paneli/Moderator/Namirnice.vue'
import Korisnici from '@/views/paneli/Administrator/Korisnici.vue'
import Favoriti from '@/views/paneli/Korisnik/Favoriti.vue'
import aboutPromena from '@/views/paneli/Administrator/aboutPromena.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'home',
  component: Home
},

{
  path: '/Login',
  name: 'login',
  component: Login,
  meta: {
    preusmeravanje: true
  }
},
{
  path: '/Register',
  name: 'register',
  component: Register,
  meta: {
    preusmeravanje: true
  }
},

{
  path: '/ShowRecipe/:recipe_id',
  name: 'ShowRecipe',
  component: ShowRecipe,
},
{
  path: '/MojiRecepti',
  name: 'mojiRecepti',
  component: MojiRecepti
},
{
  path: '/ListajKomentare',
  name: 'ListajKomentare',
  component: ListajKomentare
},
{
  path: '/Recepti',
  name: 'recepti',
  component: Recepti
},
{
  path: '/Glavni_Meni',
  name: 'glavni_Meni',
  component: Glavni_Meni
},
{
  path: '/PromenaSifre',
  name: 'promenaSifre',
  component: PromenaSifre
},
{
  path: '/Namirnice',
  name: 'namirnice',
  component: Namirnice
},
{
  path: '/korisnici',
  name: 'korisnici',
  component: Korisnici
},
{
  path: '/favoriti',
  name: 'favoriti',
  component: Favoriti,
},
{
  path: '/aboutPromena',
  name: 'aboutPromena',
  component: aboutPromena,
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// spreci ne ulogovanog korisnika da ode na panel 
router.beforeEach((to, from, next) => {

  if (to.matched.some(rec => rec.meta.preusmeravanje)) {
    if (store.state.isLoggedIn === true) {
      next({
        name: 'userPanel'
      })
    } else {
      next()
    }
  } else {
    next()
  }

})
export default router