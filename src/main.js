import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from './features/index/Index.vue'
import Game from './features/game/Game.vue'
import Games from './features/games/Games.vue'
import 'bootstrap';

const routes = [
  { path: '/games', name: 'games', component: Games, props: true },
  { path: '/', name: 'home', component: Games, props: true },
  { path: '/games/:id', name:'game', component: Game, props: true },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})
const app = createApp(Index)
app.use(router)
app.mount('#app')