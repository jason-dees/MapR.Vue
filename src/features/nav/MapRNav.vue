<template>
    <nav class="navbar navbar-expand-lg">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <router-link :to="{ 'name': 'home'}" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/games" class="nav-link">Games</router-link>
            </li>
            <li class="nav-item dropdown" v-if="sharedState.isOwner">
                <div class="btn-group">
                    <button class="btn btn-primary" data-toggle="modal" data-target="#newMapModal">+</button>
                    <div class="btn-group" role="group">
                        <button id="mapGroupDropdown" type="button" class="btn btn-primary dropdown-toggle"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Change Map
                        </button>
                        <div class="dropdown-menu" aria-labelledby="mapGroupDropdown">
                            <span class="dropdown-item"
                                v-for="map in sharedState.game.maps"
                                v-bind:key="map.id"
                                v-on:click="changeMap(map.id)"
                                v-bind:class="{ active: sharedState.primaryMapId == map.id }">
                                {{map.name}}
                            </span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <span class="title mr-auto">
            {{sharedState.title}}
        </span>
        <ul class="right navbar-nav mr-auto" v-if="!sharedState.loadedUserInfo && !sharedState.loadingUserInfo">
            <li>
                <span>
                    Login with a provider
                </span>
            </li>
            <li>
                <a  href="#" v-on:click.prevent="googleLogin">google</a>
            </li>
        </ul>
        <span class=" mr-0" v-else-if="sharedState.loadingUserInfo">Loading User</span>
        <ul class="navbar-nav mr-0" v-else>
            <li class="nav-item">
                <span v-if="sharedState.loadedUserInfo" class="nav-link">
                    {{sharedState.user}}
                </span>
            </li>
            <li class="nav-item">
                <a v-bind:href="functionsUrl+'api/logout'" class="nav-link">logout</a>
            </li>
        </ul>
        <new-marker-modal />
    </nav>
</template>
<script>
import { store } from '../../lib/store.js';
import NewMarkerModal from './NewMarkerModal.vue';

export default{
    name: 'MapRNav',
    props: {
        functionsUrl: String,
        appServerUrl: String
    },
    components: {
         'new-marker-modal': NewMarkerModal
    },
    data: function(){
        return {
            sharedState: store.state,
            googleUrl: `${this.functionsUrl}account/googleLogin?redirect=${encodeURIComponent(window.location.href)}`
        };
    },
    methods: {
        googleLogin: function(){
            window.location.href = this.googleUrl;
        },
        changeMap: function(mapId){
            store.changeMap(mapId);
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../shared/variables.scss';
    .navbar{
        background-color:$papyrus;
        z-index:1000;
    }
</style>