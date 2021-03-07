import { SignalREvents } from './SignalRSetup.js'
import { GamesData } from './MockGamesDataStore.js'
import { MapRLogger } from './Logger.js'

export { SetUpSignalR };

let methods = {};

let mockServer = {
    AddToGame: function (gameId) {
        MapRLogger.log("AddToGame", gameId);
        //SetGameData?
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