import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './features/index/Index.vue'
import Game from './features/game/Game.vue'
import Games from './features/games/Games.vue'
import 'bootstrap';
Vue.config.productionTip = false

Vue.use(VueRouter);
const routes = [
  { path: '/games', name: 'games', component: Games, props: true },
  { path: '/', name: 'home', component: Games, props: true },
  { path: '/games/:id', name:'game', component: Game, props: true },
];
const router = new VueRouter({
  routes // short for `routes: routes`
});
new Vue({
  render: h => h(Index),
  router,
}).$mount('#app')