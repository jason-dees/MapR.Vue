import { store } from './store.js'
import * as signalR from '@aspnet/signalr';
import config from '../../config.json';
import { MapRLogger } from './Logger.js';

let SignalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function (gameData) {
            var markers = gameData.activeMap.markers;
            MapRLogger.log("gameData", gameData)

            for (var i = 0; i < markers.length; i++) {
                store.addMarker(markers[i]);
            }
        }
    },
    SetGameAdmin: {
        name: 'SetGameAdmin',
        fn: function (data) {
            console.log("triggering SetGameAdmin", data);
        }
    },
    SetMap: {
        name: 'SetMap',
        fn: function (data) {
            console.log("triggering SetMap", data);
        }
    },
    SetAllMapMarkers: {
        name: 'SetAllMapMarkers',
        fn: function (data) {
            console.log("triggering SetAllMapMarkers", data);
        }
    }
}

let SetUpSignalREvents = (connection) => {
    connection.off(SignalREvents.SetGameData.name);
    connection.on(SignalREvents.SetGameData.name,
        SignalREvents.SetGameData.fn);

    connection.off(SignalREvents.SetGameAdmin.name);
    connection.on(SignalREvents.SetGameAdmin.name,
        SignalREvents.SetGameAdmin.fn);

    connection.off(SignalREvents.SetMap.name);
    connection.on(SignalREvents.SetMap.name,
        SignalREvents.SetMap.fn)

    connection.off(SignalREvents.SetAllMapMarkers.name);
    connection.on(SignalREvents.SetAllMapMarkers.name,
        SignalREvents.SetMap.fn)
};

let SetUpSignalR = async (gameId) => {
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(config.mapRApi + "/mapHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    await connection.start()
        .then(function () { connection.invoke("AddToGame", gameId) });

    SetUpSignalREvents(connection);
};

export { SetUpSignalR, SetUpSignalREvents, SignalREvents };