<template>
    <v-text-field v-model="inputValueName" clearable label="nach Studiengang suchen" variant="solo" class="searchfield"
        placeholder="z.B. Medizin" icon="fa:fas fa-search"></v-text-field>
    <v-btn color="primary" id="searchButton" @click="searchData" :loading="animationLoading" prepend-icon="fa:fas fa-search">
        Suchen
        <template v-slot:loader>
            <v-progress-circular color="orange" indeterminate></v-progress-circular>
        </template></v-btn>
</template>
 
<!------------Script------------>
<script>

export default {
    name: 'SearchBar',
    emits: ['searchData'],
    props: ['stopLoading'],
    data() {
        return {
            inputValueName: '',
            animationLoading: false,
        };
    },
    methods: {
        searchData() {
            this.$emit('searchData', this.inputValueName);
        }
    },
    watch: {
        stopLoading(newValue) {
            this.animationLoading = !newValue;
        }
    },
}
</script>

<!-----------CSS----------->  
<style scoped>
.searchfield{
    padding-top: 1.5rem;
}

#searchButton{
    margin-right: 7rem;
    margin-left: 1rem;
}
</style>