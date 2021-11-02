import * as signalR from '@microsoft/signalr';
import { SignalREvents } from './SignalREvents'
import mockSignalRSetup from './MockSignalRSetup'
import config from '../../config.json';

let setUpSignalREvents = (connection) => {
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

var SetUpSignalR = async (gameId) => {
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(config.mapRApi + "/mapHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    await connection.start()
        .then(function () { connection.invoke("AddToGame", gameId) });

    setUpSignalREvents(connection);
};

if(config.isDemo) {
    SetUpSignalR = mockSignalRSetup
}

export { SetUpSignalR }