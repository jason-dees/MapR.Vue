<template>
  <div>
    <ul id="example-1">
      <li v-for="game in games" v-bind:key="game.id">
        <router-link :to="{name: 'game', params: {id: game.id}}">{{ game.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "AvailableGames", 
  mounted: function(){
    this.$store.commit('resetGame');
    this.$store.dispatch('getGames');
  },
  computed: mapState([
    'games'
  ])
}
</script>