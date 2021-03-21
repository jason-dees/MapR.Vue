<template>
  <div>
    games go here
    <ul id="example-1">
      <li v-for="game in gamesList" v-bind:key="game.id">
        <router-link :to="{name: 'game', params: {id: game.id}}">{{ game.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import mapRFunctions from '../../lib/MockMapRFunctions.js'
import { store } from '../../lib/store.js';

export default {
  // props: {
  //   gamesList: Array
  // },
  data: function(){
    let self = this;
    store.resetGame();
    mapRFunctions.getGames().then(r => {
      self.$set(self, 'gamesList', r.data);
    })
    .catch(() => {})
    .finally(() =>{})
    return {
      gamesList: []
    };
  },
  components: {
  }
}
</script>