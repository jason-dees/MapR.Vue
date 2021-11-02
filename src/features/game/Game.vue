<template>
  <div id="mapVue">
    <div class="mapContainer">
      <img v-bind:src="primaryMapUri" class="map" v-on:load="mapload" />
    </div>
    <map-marker
      v-for="marker in markersArray"
      v-bind:key="marker.id"
      v-bind:marker="marker"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import * as panzoom from "panzoom";
import MapMarker from "./MapMarker.vue";
import * as bootstrap from "bootstrap";

export default {
  name: "MapRGame",
  props: {
    id: String,
  },
  components: {
    "map-marker": MapMarker,
  },
  data: function () {
    return {
      mapZoom: null,
    };
  },
  computed: {
    map: function () {
      return this.$el.querySelector(".map");
    },
    ...mapState(["connection", "game"]),
    ...mapGetters(["gameId", "isOwner", "markers", "markersArray", "primaryMap", "primaryMapUri"]),
  },
  mounted: function () {
    const self = this;
    self.$store.commit("resetGame");
    self.mapZoom = panzoom(self.map, {
      maxZoom: 1,
      smoothScroll: false,
      minZoom: 0.1,
    });
    self.mapZoom.on("transform", function () {
      self.setMarkersPosition();
    });
    self.$store.dispatch("getGameData", self.id).then(async () => {
      if (self.isOwner) {
        setUpMarkerDrag(document.querySelector("#mapVue"), self);
        if (self.connection == null) {
          self.$store.dispatch('makeConnection', self.gameId);
        }
      }
    });
  },
  methods: {
    mapload: function () {
      const self = this;
      self.setMarkersPosition(self.mapZoom, self.map);
    },
    setMarkersPosition: function () {
      const self = this;
      var markers = this.game.markers;
      for (var marker in markers) {
        self.setMarkerPosition(markers[marker], self.mapZoom, self.map);
      }
    },
    setMarkerPosition: function (marker, mapZoom, mapElement) {
      var mapTransform = mapZoom.getTransform();
      var element = this.$el.querySelector("#" + marker.id);
      bootstrap.Popover.getInstance(element).hide();
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
      var marker = mapRApp.markers[dragItem.id];

      let newX =
        (inElementX - mapTransform.x - mapRApp.map.offsetLeft) /
        mapTransform.scale;
      let newY =
        (inElementY - mapTransform.y - mapRApp.map.offsetTop) /
        mapTransform.scale;

      if (newX != marker.x || newY != marker.y) {
        marker.x = newX;
        marker.y = newY;
        mapRApp.$store.dispatch('updateMarker', marker);
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
    bootstrap.Popover.getInstance(el).hide();
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
