<template>
  <div>
      <MapRNav v-bind:functionsUrl="config.mapRApi"
              v-bind:appServerUrl="appServer"
              />
    <div id="app">
      <router-view />
    </div>
  </div>
</template>

<script>
import MapRNav from '../nav/MapRNav.vue'
import config from '../../../config.json'

export default {
  name: 'MaprIndex',
  data: function() {
    this.$store.dispatch('getUser')
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
