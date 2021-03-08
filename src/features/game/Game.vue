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

export default {
  name: "Game",
  props: {
    id: String,
  },
  components: {
    "map-marker": MapMarker,
  },
  data: function () {
    let self = this;
    return {
      store: store,
      state: store.state,
      imageUrl: "",
      mapZoom: null,
    };
  },
  computed: {
    map: function () {
      return this.$el.querySelector(".map");
    },
  },
  mounted: function () {
    var self = this;
    self.store.resetGame();
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
      MapRLogger.log("mounted-> store.getGameData", gameData);
      //comes from server
      self.$set(self, "imageUrl", gameData.activeMap.imageUri);
      await self.connect(gameData.id);
    });
  },
  methods: {
    mapload: function () {
      var self = this;
      self.setMarkersPosition(self.mapZoom, self.map);
    },
    connect: async function (gameId) {
      var self = this;
      await SetUpSignalR(gameId);
      if (self.state.isOwner) {
        setUpMarkerDrag(document.querySelector("#mapVue"), self);
      }
    },
    setMarkersPosition: function (mapZoom, mapElement) {
      var self = this;
      var markers = self.state.game.markers;
      for (var marker in markers) {
        self.setMarkerPosition(markers[marker], self.mapZoom, self.map);
      }
    },
    setMarkerPosition: function (marker, mapZoom, mapElement) {
      var mapTransform = mapZoom.getTransform();
      MapRLogger.log("Selecting for marker: ", marker.id)
      var element = this.$el.querySelector("#" + marker.id);
      var markerX = marker.X,
        markerY = marker.Y,
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
      var marker = mapRApp.state.game.markers[dragItem.id];

      marker.X =
        (inElementX - mapTransform.x - mapRApp.map.offsetLeft) /
        mapTransform.scale;
      marker.Y =
        (inElementY - mapTransform.y - mapRApp.map.offsetTop) /
        mapTransform.scale;
      // //THIS NEEDS TO BE FIXED PROBABLY
      // mapRApp.connection.invoke("MoveMarker",
      //   dragItem.id,
      //   mapRApp.markers[dragItem.id].x,
      //   mapRApp.markers[dragItem.id].y);
      mapRApp.store.addOrUpdateMarker(marker);

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
    //$(el).popover('update');
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
