import axios from 'axios';
import mockFunctions from './MockMapRFunctions.js'
import config from '../../config.json';

const getInstance = function(){
    return axios.create({
        baseURL: config.mapRApi,
        withCredentials: true
    });
}
 
var functions = {
    async getUser(){
       return await getInstance().get(`/account/user`);
    },
    async getGames(){
       return await getInstance().get(`/games`);
    },
    async getGame(gameId){
       return await getInstance().get(`games/${gameId}`);
    },
    async negotiateSignalr(){
       return await getInstance().get('negotiate');
    },
    async addToGame(gameId){
        return await getInstance().post('AddToGame', {gameId});
    },
    async getMaps(gameId){
        return await getInstance().get(`games/${gameId}/maps`);
    }
}
if(config.isDemo) {
    functions = mockFunctions
}
export default functions