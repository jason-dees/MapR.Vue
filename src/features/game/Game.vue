<template>
  <div id="mapVue">
    <div class="mapContainer">
      <img v-bind:src="imageUrl" class="map" v-on:load="mapload" />
    </div>
    <map-marker
      v-for="marker in state.game.markersArray"
      v-bind:key="marker.id"
      v-bind:marker="marker"
    />
  </div>
</template>

<script>
import { SetUpSignalR } from "../../lib/MockSignalRSetup.js";
import { MapRLogger } from "../../lib/Logger.js";
import { store } from "../../lib/store.js";
import * as panzoom from "panzoom";
import MapMarker from "./MapMarker.vue";
import 'bootstrap'
import $ from 'jquery'

export default {
  name: "Game",
  props: {
    id: String,
  },
  components: {
    "map-marker": MapMarker,
  },
  data: function () {
    return {
      store: store,
      state: store.state,
      mapZoom: null,
    };
  },
  computed: {
    map: function () {
      return this.$el.querySelector(".map");
    },
    imageUrl: function() {
      MapRLogger.log("Getting ImageUrl", this.store.state.primaryMapUri);
      return this.store.state.primaryMapUri;
    }
  },
  mounted: function () {
    const self = this;
    self.store.resetGame();
    console.log(self.id)
    self.mapZoom = panzoom(self.map, {
      maxZoom: 1,
      smoothScroll: false,
      minZoom: 0.1,
    });
    self.mapZoom.on("transform", function () {
      var markers = self.state.game.markers;
      for (var marker in markers) {
        self.setMarkerPosition(markers[marker], self.mapZoom, self.map);
      }
    });
    this.store.getGameData(self.id).then(async (gameData) => {
      self.store.setGameData(gameData);
      if(store.state.connection == null) {
        self.store.setConnection(await self.connect(gameData.id));
      }
      if (self.state.isOwner) {
        setUpMarkerDrag(document.querySelector("#mapVue"), self);
      }
    });
  },
  methods: {
    mapload: function () {
      const self = this;
      self.setMarkersPosition(self.mapZoom, self.map);
    },
    connect: async function (gameId) {
      return await SetUpSignalR(gameId);
    },
    setMarkersPosition: function () {
      const self = this;
      var markers = self.state.game.markers;
      for (var marker in markers) {
        self.setMarkerPosition(markers[marker], self.mapZoom, self.map);
      }
    },
    setMarkerPosition: function (marker, mapZoom, mapElement) {
      var mapTransform = mapZoom.getTransform();
      var element = this.$el.querySelector("#" + marker.id);
      var markerX = marker.x,
        markerY = marker.y,
        left =
          mapTransform.scale * markerX + mapTransform.x + mapElement.offsetLeft,
        top =
          mapTransform.scale * markerY + mapTransform.y + mapElement.offsetTop;

      var transformValue =
        "matrix(" +
        mapTransform.scale +
        ",0, 0, " +
        mapTransform.scale +
        ", " +
        left +
        ", " +
        top +
        ")";
      element.style.transform = transformValue;
    },
  },
  watch: {},
};
function setUpMarkerDrag(container, mapRApp) {
  let dragItem;

  let active = false;
  let currentX;
  let currentY;
  let inElementX;
  let inElementY;
  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("touchmove", drag, false);

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  container.addEventListener("mousemove", drag, false);

  let mapTransform = null;
  function dragStart(e) {
    mapTransform = mapRApp.mapZoom.getTransform();

    if (e.target.classList.contains("marker")) {
      if (e.type === "touchstart") {
        inElementX = 0;
        inElementY = 0;
      } else {
        inElementX = e.layerX;
        inElementY = e.layerY;
      }

      dragItem = e.target;
      active = true;
    }
  }

  function dragEnd(e) {
    if (active) {
      inElementX = currentX;
      inElementY = currentY;

      var marker = mapRApp.store.getMarkerById(dragItem.id);

      let newX = (inElementX - mapTransform.x - mapRApp.map.offsetLeft) /
        mapTransform.scale;
      let newY = (inElementY - mapTransform.y - mapRApp.map.offsetTop) /
        mapTransform.scale;

      if(newX != marker.x || newY != marker.y) {
        marker.x = newX;
        marker.y = newY;
        mapRApp.store.updateMarker(marker);
      }

      active = false;
    }
  }

  function drag(e) {
    if (active) {
      e.preventDefault();
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - inElementX;
        currentY = e.touches[0].clientY - inElementY;
      } else {
        currentX = e.clientX - inElementX;
        currentY = e.clientY - inElementY;
      }

      setTranslate(currentX, currentY, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    $(el).popover('hide');
    let transformValue =
      "matrix(" +
      mapTransform.scale +
      ",0, 0, " +
      mapTransform.scale +
      ", " +
      xPos +
      ", " +
      yPos +
      ")";
    el.style.transform = transformValue;
  }
}
</script>
