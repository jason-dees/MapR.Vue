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
import mapRFunctions from '../../lib/MapRFunctions.js'
import { store } from '../../lib/store.js';

export default {
  name: "AvailableGames", 
  data: function(){
    let self = this;
    store.resetGame();
    mapRFunctions.getGames().then(r => {
      console.log(r,self)
      self.gamesList = r.data
    })
    .catch((e) => {console.log(e)})
    .finally(() =>{})
    return {
      gamesList: []
    };
  }
}
</script>