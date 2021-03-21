import mapRFunctions from './MockMapRFunctions.js'
import { MapRLogger } from './Logger.js'

//I want to refactor this
var defaultGame = {
    markers: {},
    markersArray: [],
    maps: {},
    gameData: null,
    isAdmin: true
};
var defaultMap = {
    'id': '',
    'gameId': '',
    'imageUri': '',
    'name': 'NA',
    'isActive': false,
    'isPrimary': false
}
var primaryState = {
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
    get primaryMap() {
        if (this.game.gameData == null) {
            return defaultMap;
        }
        return this.game.gameData.primaryMap;
    },
    get primaryMapUri() {
        return this.primaryMap.imageUri
    },
    get primaryMapId() {
        return this.primaryMap.id;
    },
    game: defaultGame
};
var store = {
    get state() { return primaryState },
    invertIsAdmin() {
        primaryState.isAdmin = !primaryState.isAdmin
    },
    setPageTitle(newTitle) {
        primaryState.title = newTitle;
    },
    setUser(newUser) {
        primaryState.user = newUser;
    },
    getUser() {
        const self = this;
        mapRFunctions.getUser().then((r) => {
            if (r.data.name != null) {
                self.setUser(r.data.name);
                primaryState.loadedUserInfo = true;
            }
            else {
                primaryState.user = null;
                primaryState.loadedUserInfo = false;
            }
        }).catch((r) => {
            primaryState.user = null;
            primaryState.loadedUserInfo = false;
        }).finally((r) => {
            primaryState.loadingUserInfo = false;
        });
    },
    async getGameData(gameId) {
        var gameData = (await mapRFunctions.getGame(gameId)).data;
        this.setPageTitle(gameData.name);
        primaryState.game.maps = gameData.maps;
        return gameData;
    },
    addToGame(gameId) {
        return mapRFunctions.addToGame(gameId);
    },
    setGameData(data) {
        primaryState.game.gameData = data;
    },
    setPrimaryMapGameData(mapData) {
        primaryState.game.gameData.primaryMap = mapData;
        primaryState.game.markers = {};
        primaryState.game.markersArray = [];
        var markers = mapData.markers;
        for (var i = 0; i < markers.length; i++) {
            this.addMarker(markers[i]);
        }
    },
    addMarker(marker) {
        primaryState.game.markers[marker.id] = marker;
        primaryState.game.markersArray = [];

        //Keeping these in line will suck
        for (var markerId in primaryState.game.markers) {
            primaryState.game.markersArray.push(primaryState.game.markers[markerId]);
        }
    },
    updateMarker(marker) {
        this.addMarker(marker);
        if (primaryState.isOwner) {
            primaryState.connection.invoke("MoveMarker", marker.id, marker.x, marker.y);
        }
    },
    changeMap(mapId) {
        //Do an 'invoke'
        primaryState.connection.invoke("ChangeMap", primaryState.game.gameData.id, mapId);
    },
    resetGame() {
        primaryState.game = defaultGame;
    },
    clearMarkers() {
        primaryState.game.markers = {};
    },
    isOnGamePage() {
        //maybe this to check whether it's on the game page rather than set a variable a whole bunch
    },
    getMarkerById(markerId) {
        return primaryState.game.markers[markerId];
    },
    setConnection(connection) {
        primaryState.connection = connection;
    },
    invoke(methodName, ...arg) {
        primaryState.connection.invoke(methodName, ...arg)
    }
};
export { store }