<template>
    <div>
        <input type="file" class="form-input"
            name="imageUpload" id="imageUpload"
            accept="image/png, image/jpeg"
            v-on:change="fileSelected" />
        <img id="imagePreview" v-bind:src="imagePreview" style="width:100%;" />
    </div>
</template>
<script>
export default {
    data: function(){
        return {
            imagePreview: "",
            image:null
        };
    },
    methods:{
        fileSelected: function(event){
            let self = this;
            self.imagePreview = "";
            self.image = null;

            if(event.target.files.length == 0) return;
            self.image = event.target.files[0];

            let fileReader = new FileReader();
            fileReader.addEventListener('load', function(){
                self.imagePreview = fileReader.result;
            }, false);
            fileReader.readAsDataURL(self.image);
            this.$emit('update:image', self.image)
        }
    }
}
</script>