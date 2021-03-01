var wrapInData = (obj) => {
    return { 'data': obj }
}
export default {
    async getUser() {
        console.log("getting user")
        return wrapInData({
            'name': userName
        });
    },
    async getGames() {
        console.log("getting games")
        return wrapInData(games);
    },
    async getGame(gameId) {
        let game = games.filter((g) => { return g.id == gameId})[0]
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
let userName = 'Jason Dees';

let games = [
    {
        'id': 'ABD123',
        'owner': userName,
        'name': 'Fake Map 1',
        'isPrivate': false,
        'maps':[]
    }
];

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