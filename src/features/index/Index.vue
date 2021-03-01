<template>
  <div>
      <MapRNav v-bind:functionsUrl="config.mapRApi"
              v-bind:appServerUrl="appServer"
              />
    <div id="app">
      index is here
      <router-view>
      this is the index
      </router-view>
      </div>
  </div>
</template>

<script>
import MapRNav from '../nav/MapRNav.vue'
import { store } from '../../lib/store.js'
const config = require('../../../config.json')

export default {
  name: 'index',
  data: function() {
    store.getUser();
    return  {
      games: [],
      activeGame: null,
      config: config,
      appServer: window.location.href
    }
  },
  components: {
    MapRNav
  }
}
</script>

<style lang="scss">
  @import '../shared/main.scss';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
