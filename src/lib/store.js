import mapRFunctions from './MockMapRFunctions.js'
import { MapRLogger } from './Logger.js'
var defaultGame = {
    markers: {},
    markersArray: [],
    maps: {},
    gameData: null
};
var store = {
    state: {
        title: 'MapR',
        user: '',
        loadedUserInfo: false,
        loadingUserInfo: true,
        connection: null,
        isOwner: false,
        game: defaultGame
    },
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
                self.state.loadedUserInfo = true;
            }
            else {
                self.state.user = null;
                self.state.loadedUserInfo = false;
            }
        }).catch((r) => {
            self.state.user = null;
            self.state.loadedUserInfo = false;
        }).finally((r) => {
            self.state.loadingUserInfo = false;
        });
    },
    async getGameData(gameId) {
        var gameData = (await mapRFunctions.getGame(gameId)).data;
        this.setPageTitle(gameData.name);
        this.state.game.maps = gameData.maps;
        return gameData;
    },
    addToGame(gameId) {
        return mapRFunctions.addToGame(gameId);
    },
    setGameData(data) {
        this.state.game.gameData = data;
    },
    setIsOwner(isOwner) {
        this.state.isOwner = isOwner;
    },
    addOrUpdateMarker(marker) {
        MapRLogger.log("adding marker", marker);
        this.state.game.markers[marker.Id] = marker;
        this.state.game.markersArray = [];

        //Keeping these in line will suck
        for (var markerId in this.state.game.markers) {
            this.state.game.markersArray.push(this.state.game.markers[markerId]);
        }
    },
    resetGame() {
        MapRLogger.log("resetGame");
        this.setIsOwner(false);
        this.state.game = defaultGame;
    },
    clearMarkers() {
        MapRLogger.log("clearing markers")
        this.state.game.markers = {};
    },
    isOnGamePage() {
        //maybe this to check whether it's on the game page rather than set a variable a whole bunch
    }
};
export { store }