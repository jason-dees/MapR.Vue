import mapRFunctions from './MockMapRFunctions.js'
import { MapRLogger } from './Logger.js'

//I want to refactor this
var defaultGame = {
    markers: {},
    markersArray: [],
    maps: {},
    gameData: null
};
var state = {
    title: 'MapR',
    user: '',
    loadedUserInfo: false,
    loadingUserInfo: true,
    connection: null,
    get isOwner() {
        if (this.game != null && this.game.gameData != null) {
            return this.game.gameData.owner == this.user
        }
        return false;
    },
    game: defaultGame
};
var store = {
    get state() { return state },
    setPageTitle(newTitle) {
        this.state.title = newTitle;
    },
    setUser(newUser) {
        this.state.user = newUser;
    },
    getUser() {
        const self = this;
        mapRFunctions.getUser().then((r) => {
            if (r.data.name != null) {
                self.setUser(r.data.name);
                state.loadedUserInfo = true;
            }
            else {
                state.user = null;
                state.loadedUserInfo = false;
            }
        }).catch((r) => {
            state.user = null;
            state.loadedUserInfo = false;
        }).finally((r) => {
            state.loadingUserInfo = false;
        });
    },
    async getGameData(gameId) {
        var gameData = (await mapRFunctions.getGame(gameId)).data;
        this.setPageTitle(gameData.name);
        state.game.maps = gameData.maps;
        return gameData;
    },
    addToGame(gameId) {
        return mapRFunctions.addToGame(gameId);
    },
    setGameData(data) {
        state.game.gameData = data;
    },
    addMarker(marker){
        state.game.markers[marker.id] = marker;
        state.game.markersArray = [];

        //Keeping these in line will suck
        for (var markerId in this.state.game.markers) {
            this.state.game.markersArray.push(this.state.game.markers[markerId]);
        }
    },
    updateMarker(marker) {
        this.addMarker(marker);
        if(state.isOwner){
            state.connection.invoke("MoveMarker", marker.id, marker.x, marker.y);
        }
    },
    resetGame() {
        state.game = defaultGame;
    },
    clearMarkers() {
        state.game.markers = {};
    },
    isOnGamePage() {
        //maybe this to check whether it's on the game page rather than set a variable a whole bunch
    },
    getMarkerById(markerId) {
        return state.game.markers[markerId];
    },
    setConnection(connection){
        state.connection = connection;
    },
    invoke(methodName, ...arg) {
        state.connection.invoke(methodName, ...arg)
    }
};
export { store }