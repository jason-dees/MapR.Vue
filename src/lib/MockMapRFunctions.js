import { GamesData } from './MockGamesDataStore.js'
import { MapRLogger } from './Logger.js'

let wrapInData = (obj) => {
    return { 'data': obj }
}
var IsAdmin = true;

function transformGameData(rawGame) {
    if (IsAdmin) {
        return {
            ...rawGame.gameId,
            ...rawGame.owner,
            ...rawGame.name,
            ...rawGame.maps,
            activeMap: rawGame.maps.filter(m => m.isActive)[0]
        }
    }
    else {
        return {
            ...rawGame.gameId,
            ...rawGame.owner,
            ...rawGame.name,
            activeMap: rawGame.maps.filter(m => m.isActive)[0]
        }
    }
}
export default {
    async getUser() {
        MapRLogger.log("getting user")
        return wrapInData({
            'name': GamesData.userName
        });
    },
    async getGames() {
        MapRLogger.log("getting games")
        return wrapInData(GamesData.games);
    },
    async getGame(gameId) {
        let rawGame = GamesData.games.filter((g) => { return g.id == gameId })[0]
        if (rawGame == null) {
            MapRLogger.log("did not find game " + gameId);
            return null;
        }
        else {
            MapRLogger.log("found game " + gameId);
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
    }
}
