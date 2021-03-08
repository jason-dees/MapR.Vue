import { SignalREvents } from './SignalRSetup.js'
import { GamesDataStore } from './MockGamesDataStore.js'
import { MapRLogger } from './Logger.js'

export { SetUpSignalR };

let methods = {};
let IsAdmin = true;

function transformGameData(rawGame) {
    if (IsAdmin) {
        return {
            ...rawGame,
            activeMap: rawGame.maps.filter(m => m.isActive)[0]
        }
    }
    else {
        return {
            ...rawGame,
            activeMap: rawGame.maps.filter(m => m.isActive)[0],
            maps: null
        }
    }
}

let mockServer = {
    AddToGame: function (gameId) {
        MapRLogger.log("AddToGame", gameId);
        const game = transformGameData(GamesDataStore.getGame(gameId));
        methods[SignalREvents.SetGameData.name](game)
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
};