<template>
    <v-container class="checkboxcontainer">
        <v-checkbox v-model="isChecked" :label="checkboxLabel" @change="handleChange" color="blue"></v-checkbox>
    </v-container>
</template>


<!------------Script------------>
<script>

export default {
    name: 'DynamicFilterCheckbox',
    emits: ['checkboxChanged'],
    props: {
        checkboxId: Number,
        checkboxLabel: String,
        dataLocation: String,
        dataValue: null,
    },
    data() {
        return {
            isChecked: false,
        };
    },
    methods: {
        handleChange(){
            this.$emit('checkboxChanged', { id: this.checkboxId, location: this.dataLocation, value: this.dataValue });
        }
    }
}
</script>