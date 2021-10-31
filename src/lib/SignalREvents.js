import { store } from './store.js'

let SignalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function (gameData) {
            var markers = gameData.primaryMap.markers;

            for (var i = 0; i < markers.length; i++) {
                store.addMarker(markers[i]);
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
            store.setPrimaryMapGameData(data);
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