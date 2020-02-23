import mapRFunctions from './MapRFunctions.js'

var store = {
    state: {
        title: 'MapR',
        user: '',
        loadedUserInfo: false,
        loadingUserInfo: true,
        connection: null,
        game:{
            markers: {},
            isOwner: false
        }
    },
    setPageTitle  (newTitle){
        this.state.title = newTitle;
    },
    setUser (newUser){
        this.state.user = newUser;
    },
    getUser(){
        var self = this;
        mapRFunctions.getUser().then((r) => {
            console.log(r);
            if(r.data.name != null){
                self.setUser(r.data.name);
                self.state.loadedUserInfo = true;
            }
            else{
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
    addToGame(gameId){
        return mapRFunctions.addToGame(gameId);
    },
    setIsGameOwner(isGameOwner){
        this.state.game.isOwner = isGameOwner;
    },
    addMarker(marker){
        this.state.game.markers[marker.Id] = marker;
    },
    resetGame(){
        this.state.game = {
            markers: {},
            isOwner: false
        };
    },
    clearMarkers(){
        this.state.game.markers = {};
    },
    isOnGamePage(){
        //maybe this to check whether it's on the game page rather than set a variable a whole bunch
    }
};
export {store}