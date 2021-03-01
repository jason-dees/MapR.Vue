import { store } from './store.js'
import * as signalR from '@aspnet/signalr';
import config from '../../config.json';

let signalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function(gameData){
            var markers = gameData.markers;
            console.log("triggering SetGameData", gameData);

            store.setIsOwner(gameData.isGameOwner);

            for(var i = 0; i< markers.length; i++){
                store.addOrUpdateMarker(markers[i]);
            }
        }
    },
    SetGameAdmin: {
        name: 'SetGameAdmin',
        fn: function(data){
            console.log("triggering SetGameAdmin", data);
        }
    },
    SetMap: {
        name: 'SetMap',
        fn: function(data) {
            console.log("triggering SetMap", data);
        }
    },
    SetAllMapMarkers: {
        name: 'SetAllMapMarkers',
        fn: function(data) {
            console.log("triggering SetAllMapMarkers", data);
        }
    }
}

let SetUpSignalREvents = (connection) => {
    connection.off(signalREvents.SetGameData.name);
    connection.on(signalREvents.SetGameData.name,
        signalREvents.SetGameData.fn);

    connection.off(signalREvents.SetGameAdmin.name);
    connection.on(signalREvents.SetGameAdmin.name,
        signalREvents.SetGameAdmin.fn);
    
    connection.off(signalREvents.SetMap.name);
    connection.on(signalREvents.SetMap.name,
        signalREvents.SetMap.fn)

    connection.off(signalREvents.SetAllMapMarkers.name);
    connection.on(signalREvents.SetAllMapMarkers.name,
        signalREvents.SetMap.fn)
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

export { SetUpSignalR, SetUpSignalREvents };