import {GamesData} from './MockGamesDataStore.js'

var wrapInData = (obj) => {
    return { 'data': obj }
}
export default {
    async getUser() {
        console.log("getting user")
        return wrapInData({
            'name': GamesData.userName
        });
    },
    async getGames() {
        console.log("getting games")
        return wrapInData(GamesData.games);
    },
    async getGame(gameId) {
        let game = GamesData.games.filter((g) => { return g.id == gameId})[0]
        if(game == null){
            console.log("did not find game "+ gameId);
        }
        else{
            console.log("found game "  + gameId);
        }
        return wrapInData(game);
    },
    async negotiateSignalr() {
        return {}
    },
    async addToGame(gameId) {
        return {}
    },
    async getMaps(gameId) {
        return {}
    }
}
