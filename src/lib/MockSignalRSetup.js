import { SignalREvents } from './SignalREvents'
import { GamesDataStore } from './MockGamesDataStore.js'
import { MapRLogger } from './Logger.js'

let methods = {};
let IsAdmin = true;

function transformGameData(rawGame) {
    if (IsAdmin) {
        return {
            ...rawGame,
            primaryMap: rawGame.maps.filter(m => m.isPrimary)[0]
        }
    }
    else {
        return {
            ...rawGame,
            primaryMap: rawGame.maps.filter(m => m.isPrimary)[0],
            maps: null
        }
    }
}

let mockServer = {
    AddToGame: function (gameId) {
        const game = transformGameData(GamesDataStore.getGame(gameId));
        methods[SignalREvents.SetGameData.name](game)
    },
    MoveMarker: function(markerId, x, y){ 
        MapRLogger.log("new Marker position for", markerId, x, y);
     },
    ChangeMap: function(gameId, mapId){
        MapRLogger.log("Change Map for", gameId, "to", mapId);
        GamesDataStore.setPrimaryMap(gameId, mapId);
        mockConnection.trigger(SignalREvents.SetMap.name, GamesDataStore.getMap(gameId, mapId));
    }
};

let mockConnection = {
    invoke: function (methodName, ...arg) {
        MapRLogger.log("connection.invoke", arguments);
        mockServer[methodName].bind(null, ...arg)();

    },
    on: function (methodName, fn) {
        methods[methodName] = fn;
    },
    off: function (methodName, fn) {
        methods[methodName] = null;
    },
    trigger: function(methodName, ...arg){
        methods[methodName](...arg)
    }
}

let SetUpSignalR = async (gameId) => {
    mockConnection.off(SignalREvents.SetGameData.name);
    mockConnection.on(SignalREvents.SetGameData.name,
        SignalREvents.SetGameData.fn);

    mockConnection.off(SignalREvents.SetGameAdmin.name);
    mockConnection.on(SignalREvents.SetGameAdmin.name,
        SignalREvents.SetGameAdmin.fn);

    mockConnection.off(SignalREvents.SetMap.name);
    mockConnection.on(SignalREvents.SetMap.name,
        SignalREvents.SetMap.fn);

    mockConnection.off(SignalREvents.SetAllMapMarkers.name);
    mockConnection.on(SignalREvents.SetAllMapMarkers.name,
        SignalREvents.SetMap.fn);
    mockConnection.invoke('AddToGame', gameId);
    
    return mockConnection;
};

export { SetUpSignalR };