import { GamesDataStore } from './MockGamesDataStore.js'
import { MapRLogger } from './Logger.js'

let wrapInData = (obj) => {
    return { 'data': obj }
}
var IsAdmin = true;
var IsLoggedIn = true;

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

export default {
    async getUser() {
        MapRLogger.log("getting user")
        if (IsLoggedIn) {
            return wrapInData(GamesDataStore.getUser());
        }
        return wrapInData({});
    },
    async getGames() {
        MapRLogger.log("getting games")
        return wrapInData(GamesDataStore.getGames());
    },
    async getGame(gameId) {
        let rawGame = GamesDataStore.getGame(gameId)
        if (rawGame == null) {
            MapRLogger.debug("did not find game " + gameId);
            return null;
        }
        else {
            MapRLogger.debug("found game " + gameId);
        }
        return wrapInData(transformGameData(rawGame));
    },
    async negotiateSignalr() {
        return {}
    },
    async addToGame(gameId) {
        return {}
    },
    async getMaps(gameId) {
        return {}
    },
    setAdmin(isAdmin) {
        IsAdmin = isAdmin
    },
    setIsLoggedIn(isLoggedIn) {
        IsLoggedIn = isLoggedIn
    }
}
