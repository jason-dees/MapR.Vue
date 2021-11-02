<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'home' }" class="nav-link"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/games" class="nav-link">Games</router-link>
        </li>
        <li class="nav-item" v-if="isOwner">
          <div class="btn-group">
            <button
              class="btn btn-primary"
              data-toggle="modal"
              data-target="#newMapModal"
            >
              +
            </button>
            <div class="dropdown">
              <button
                id="mapGroupDropdown"
                type="button"
                class="btn btn-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Change Map
              </button>
              <ul class="dropdown-menu" aria-labelledby="mapGroupDropdown">
                <li
                  class="dropdown-item"
                  v-for="map in game.maps"
                  v-bind:key="map.id"
                  v-on:click="changeMap(map.id)"
                  v-bind:class="{ active: primaryMapId == map.id }"
                >
                  {{ map.name }}
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>

      <span class="title bar-brand">
        {{ title }}
      </span>
      <ul class="navbar-nav d-flex" v-if="!loadedUserInfo && !loadingUserInfo">
        <li class="nav-item">
          <span> Login with a provider </span>
        </li>
        <li class="nav-item">
          <a href="#" v-on:click.prevent="googleLogin">google</a>
        </li>
      </ul>
      <span class="mr-0" v-else-if="loadingUserInfo">Loading User</span>
      <ul class="navbar-nav d-flex" v-else>
        <li class="nav-item">
          <span v-if="loadedUserInfo" class="nav-link">
            {{ user }}
          </span>
        </li>
        <li class="nav-item">
          <a v-bind:href="functionsUrl + 'api/logout'" class="nav-link"
            >logout</a
          >
        </li>
      </ul>
      <new-marker-modal />
    </div>
  </nav>
</template>
<script>
import NewMarkerModal from "./NewMarkerModal.vue";
import { mapState, mapGetters } from "vuex";
import * as bootstrap from "bootstrap";

export default {
  name: "MapRNav",
  props: {
    functionsUrl: String,
    appServerUrl: String,
  },
  components: {
    "new-marker-modal": NewMarkerModal,
  },
  mounted() {},
  data() {
    return {
      googleUrl: `${
        this.functionsUrl
      }account/googleLogin?redirect=${encodeURIComponent(
        window.location.href
      )}`,
    };
  },
  computed: {
    ...mapState(["loadingUserInfo", "loadedUserInfo", "user", "title", "game"]),
    ...mapGetters([
      "gameId",
      "isOwner",
      "markersArray",
      "primaryMap",
      "primaryMapId",
      "primaryMapUri",
    ]),
  },
  methods: {
    googleLogin: function () {
      window.location.href = this.googleUrl;
    },
    changeMap: function (mapId) {
      document
        .querySelectorAll(".marker")
        .forEach((element) => bootstrap.Popover.getInstance(element)?.hide());
      this.$store.commit("changeMap", mapId);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../shared/variables.scss";
.navbar {
  background-color: $papyrus;
  z-index: 1000;
}
</style>