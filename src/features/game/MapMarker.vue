<template>
    <div v-bind:style="computedCss" v-bind:id="marker.id" class="marker">
        </div>
</template>

<script>
import 'bootstrap'
import $ from 'jquery'
export default {
    name: 'map-marker',
    props: ['marker'],
    computed: {
        computedCss: function(){
            var url = `${this.marker.imageUri}`;
            var backgroundImage = 'background-image: url("' + url + '?width=25&height=25");';
            return backgroundImage + this.marker.customCSS;
        }
    },
    mounted: function(){
        $('#' + this.marker.id).popover({
            container:'body',
            content: this.marker.description || "",
            title: this.marker.name
        });
    }
}
</script>