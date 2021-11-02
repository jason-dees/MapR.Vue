import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from './features/index/Index.vue'
import Game from './features/game/Game.vue'
import Games from './features/games/Games.vue'
import { store } from './lib/VuexStore.js'
import 'bootstrap/dist/css/bootstrap.min.css';

const routes = [
  { path: '/games', name: 'games', component: Games },
  { path: '/', name: 'home', component: Games },
  { path: '/games/:id', name:'game', component: Game, props: true },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})
const app = createApp(Index)
app.use(router)
app.use(store)
app.mount('#app')
window.r = router
window.s = store