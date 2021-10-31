<template>
    <div class="modal" role="form" id="newMarkerModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Add New Marker</h5>
                </div>
                <div class="modal-body" v-bind:class="{ 'alert-danger' : (formErrorMessage.length > 0) }">
                    <div class="form-group">
                        <input type="text" name="name" class="form-control"
                            placeholder="New Marker Name"
                            v-model="markerName"
                            v-bind:class="{ 'is-invalid' : (nameErrorMessage.length > 0) }"
                            v-on:keyup="checkIsEmpty" />
                    </div>
                    <div class="alert alert-warning" v-show="nameErrorMessage.length > 0">{{nameErrorMessage}}</div>
                    <div class="form-group">
                        <input type="text"
                            class="form-control"
                            placeholder="Custom CSS"
                            v-model="customCSS" />
                    </div>
                    <div class="form-group">
                        <label for="">Description</label>
                        <textarea class="form-control" rows="3" v-model="description"></textarea>
                    </div>
                    <image-upload v-model:image="imageData"></image-upload>
                    <div class="alert alert-warning" v-show="formErrorMessage.length > 0">{{formErrorMessage}}</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-outline-primary" v-on:click="submit">Create</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ImageUpload from './ImageUpload.vue';
export default {
    name: 'new-marker-modal',
    props:[],
    components: {
         'image-upload': ImageUpload
    },
    data: function(){
        return {
            markerName: "",
            customCSS: "",
            description: "",
            nameErrorMessage: "",
            formErrorMessage: "",
            imageData: null
        };
    },
    methods:{
        submit: function() {
            // let self = this;

            // let newMarkerUrl = '/games/' + self.gameId + '/maps/' + self.mapId + '/markers/AddMarker';

            // let formData = new FormData();
            // console.log(self.imageData)
            // formData.append("ImageData", self.imageData);
            // formData.set("Name", self.markerName);
            // formData.set("Description", self.description);
            // formData.set("CustomCSS", self.customCSS);

            // const config =  { headers: {'Content-Type': 'multipart/form-data' }};
            // axios({
            //     method: 'post',
            //     url: newMarkerUrl,
            //     data: formData,
            //     config: config
            // }).then(function (response) {
            //     self.formErrorMessage = "";
            // }).catch(function (error) {
            //     self.formErrorMessage = error.message;
            // });

        },
        checkIsEmpty: function(event) {
        },
        emptyForm: function(){
            this.markerName = '';
            this.customCSS = '';
            this.description = '';
        }
    }
}
</script>