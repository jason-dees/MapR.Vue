
import { store } from './store.js'
/*
user
{ 'name': 'User Name' }

game
{
    'id': 'someid',
    'owner': 'Some Owner',
    'name': 'Map Name',
    'isPrivate': true
    'maps': []
}
map
{
    'id': 'someid',
    'gameId': 'somegameid',
    'imageUri': 'some image uri',
    'name': 'Some Name',
    'isActive': true,
    'isPrimary': false,
}

marker
{
    'id': 'someid',
    'gameId': 'somegameid',
    'mapId': 'somemapid',
    'x': 1,
    'y': 2,
    'name': 'Some Name',
    'description': 'some longer text goes here',
    'customCss': 'some customcss this isn't a thing yet',
    'imageUri': 'some image uri'
}
*/


let adminUserName = 'Jason Dees';
let userName = 'Not Jason Dees';

let games = [
    {
        'id': 'ABD123',
        'owner': adminUserName,
        'name': 'Fake Game 0',
        'isPrivate': false,
        'maps': [
            {
                'id': 'ABD123-1',
                'gameId': 'ABD123',
                'imageUri': require('../assets/india_map.jpg'),
                'name': 'ABD123 Map 1',
                'isActive': true,
                'isPrimary': false,
                'markers': [
                    {
                        'id': 'ABD123-1-1',
                        'gameId': 'ABD123',
                        'mapId': 'ABD123-1',
                        'x': 1,
                        'y': 2,
                        'name': 'Some Name',
                        'description': 'some longer text goes here',
                        'customCss': '',
                        'imageUri': 'some image uri'
                    }
                ]
            },
            {
                'id': 'ABD123-2',
                'gameId': 'ABD123',
                'imageUri':  require('../assets/Italy-Political-Map.jpg'),
                'name': 'ABD123 Map 2',
                'isActive': true,
                'isPrimary': true,
                'markers': []
            }
        ]
    }
];

let GamesData = {
    games,
    userName
}

let GamesDataStore = {

    addGame: function (gameData) {
        GamesData.games.push(gameData);
    },

    getGame: (gameId) => {
        const game = GamesData.games.filter((g) => { return g.id == gameId })[0];
        return game
    },
    getGames: () => GamesData.games,
    updateGame: function (gameId, gameData) {
    },
    setPrimaryMap: function (gameId, newMapId) {
        const game = GamesData.games.filter((g) => { return g.id == gameId })[0];
        game.maps.forEach( m => m.isPrimary = false);
        game.maps.filter( m => m.id == newMapId)[0].isPrimary = true;
        console.log(GamesData.games)
    },
    addMap: function (gameId, mapData) { },

    getMap: function (gameId, mapId) { 
        const game = this.getGame(gameId);
        return game.maps.filter((m) => m.id == mapId)[0];
    },

    updateMap: function (gameId, mapId, mapData) {
    },

    addMarker: function (gameId, mapId, markerData) { },

    getMarker: function (gameId, mapId, markerId) { },

    updateMarker: function (gameId, mapId, markerId, markerData) {
    },
    getUser: function () {
        if(store.state.isAdmin){
            return { 'name': adminUserName }
        }
        return { 'name': userName }
    }
}

export { GamesDataStore }