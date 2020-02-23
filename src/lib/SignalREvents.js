import { store } from './store.js'
let signalREvents = {
    SetGameData: {
        name: "SetGameData",
        fn: function(gameData){
            var markers = gameData.markers;

            console.log("triggering SetGameData", gameData);

            store.resetGame();
            store.setIsGameOwner(gameData.isGameOwner);

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
}

export { SetUpSignalREvents };