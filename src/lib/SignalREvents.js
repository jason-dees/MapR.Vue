import { store } from './store.js'
import * as signalR from '@aspnet/signalr';
import mapRFunctions from './MapRFunctions.js'
import config from '../../config.json';

let signalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function(gameData){
            var markers = gameData.markers;
            console.log("triggering SetGameData", gameData);

            store.setIsOwner(gameData.isGameOwner);

            for(var i = 0; i< markers.length; i++){
                store.addMarker(markers[i]);
            }
        }
    },
    SetGameAdmin: {
        name: 'SetGameAdmin',
        fn: function(data){
            console.log("triggering SetGameAdmin", data);
        }
    }
}

let SetUpSignalREvents = (connection) => {
    connection.on(signalREvents.SetGameData.name,
        signalREvents.SetGameData.fn);

    connection.on(signalREvents.SetGameAdmin.name,
        signalREvents.SetGameAdmin.fn);
};

let SetUpSignalR = (gameId) => {
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(config.mapRFunctionsUrl + 'api/')
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start().then(async function () {
        SetUpSignalREvents(connection);
        await store.addToGame(gameId);
    }).catch(function (error) {
        console.error(error.message);
    });
};

export { SetUpSignalR, SetUpSignalREvents };