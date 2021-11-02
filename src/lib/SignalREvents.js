import { store } from './VuexStore'

let SignalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function (gameData) {
            var markers = gameData.primaryMap.markers;
            for (var i = 0; i < markers.length; i++) {
                store.commit('addMarker',markers[i]);
            }
        }
    },
    SetGameAdmin: {
        name: 'SetGameAdmin',
        fn: function () {
        }
    },
    SetMap: {
        name: 'SetMap',
        fn: function (data) {
            store.commit('setPrimaryMapGameData', data);
        }
    },
    SetAllMapMarkers: {
        name: 'SetAllMapMarkers',
        fn: function (data) {
            console.log("triggering SetAllMapMarkers", data);
        }
    }
}

export { SignalREvents }