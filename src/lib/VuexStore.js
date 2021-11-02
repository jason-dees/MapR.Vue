import { createStore } from 'vuex'
import mapRFunctions from './MockMapRFunctions.js'
import { SetUpSignalR } from "./MockSignalRSetup.js";

var defaultGame = {
    markers: {},
    markersArray: [],
    maps: {},
    gameData: null
};
var defaultMap = {
    'id': '',
    'gameId': '',
    'imageUri': '',
    'name': 'NA',
    'isActive': false,
    'isPrimary': false
}

const store = createStore({
    state() {
        return {
            title: 'MapR',
            user: '',
            loadedUserInfo: false,
            loadingUserInfo: true,
            connection: null,
            games: [],
            game: defaultGame,
            isAdmin: true,
        }
    },
    getters: {
        gameId(state) {
            return state.game.gameData.id;
        },
        isOwner(state) {
            if (state.game != null && state.game.gameData != null) {
                return state.game.gameData.owner == state.user
            }
            return false;
        },
        markers(state) {
            return state.game.markers
        },
        markersArray(state) {
            return Object.values(state.game.markers);
        },
        primaryMap(state) {
            if (state.game.gameData == null) {
                return defaultMap;
            }
            return state.game.gameData.primaryMap;
        },
        primaryMapId(state) {
            if (state.game.gameData == null) {
                return defaultMap.id;
            }
            return state.game.gameData.primaryMap.id;
        },
        primaryMapUri(state) {
            if (state.game.gameData) {
                return state.game.gameData.primaryMap.imageUri
            }
            return ''
        },
        invoke(state, methodName, ...arg) {
            state.connection.invoke(methodName, ...arg);
        }
    },
    mutations: {
        addMarker(state, marker) {
            state.game.markers[marker.id] = marker;
            state.game.markersArray = Object.values(state.game.markers);
        },
        changeMap(state, mapId) {
            state.connection.invoke("ChangeMap", state.game.gameData.id, mapId);
        },
        resetGame(state) {
            state.game = defaultGame;
        },
        setConnection(state, connection) {
            state.connection = connection;
        },
        setGameData(state, gameData) {
            state.title = gameData.name;
            state.game.gameData = gameData;
            state.game.maps = gameData.maps;
        },
        setGames(state, games) {
            state.games = games
        },
        setMaps(state, maps) {
            state.game.maps = maps
        },
        setPageTitle(state, title) {
            state.title = title;
        },
        setPrimaryMapGameData(state, mapData) {
            state.game.gameData.primaryMap = mapData;
            state.game.markers = {};
            state.game.markersArray = [];
            var markers = mapData.markers;
            for (var i = 0; i < markers.length; i++) {
                state.game.markers[markers[i].id] = markers[i];
            }
            state.game.markersArray = Object.values(state.game.markers);
        },
        setUser(state, userName) {
            state.user = userName;
            state.loadedUserInfo = true;
            state.loadingUserInfo = false;
        }
    },
    actions: {
        getUser(context) {
            mapRFunctions.getUser().then((r) => {
                if (r.data.name != null) {
                    context.commit('setUser', r.data.name);
                }
                else {
                    context.commit('setUser', "User Not Found");
                }
            }).catch(() => {
                context.commit('setUser', "error: User Not Found");
            });
        },
        async getGameData(context, gameId) {
            var gameData = (await mapRFunctions.getGame(gameId)).data;
            context.commit('setGameData', gameData)
        },
        async getGames(context) {
            context.commit('setGames', (await mapRFunctions.getGames()).data)
        },
        async makeConnection(context, gameId) {
            context.commit('setConnection', await SetUpSignalR(gameId));
        },
        updateMarker(context, marker) {
            if (context.state.isOwner) {
                context.state.connection.invoke("MoveMarker", marker.id, marker.x, marker.y);
            }
            context.commit('addMarker', marker);
        }
    }
})
export { store }