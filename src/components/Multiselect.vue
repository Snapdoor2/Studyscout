<template>
    <v-autocomplete
      clearable
      v-model="selectedItem"
      :items="items"
      label="Bundesland wählen"
      @update:modelValue="itemSelected"
      variant="solo-filled"
      color="primary"
      multiple  
    ></v-autocomplete>
</template>
  
  <script>
  export default {
    data() {
      return {
        selectedItem: null,
        items: [
          { title: 'Baden Würtemberg', value: 'BW' },
          { title: 'Bayern', value: 'BY' },
          { title: 'Berlin', value: 'BE' },
          { title: 'Brandenburg', value: 'BB' },
          { title: 'Bremen', value: 'HB' },
          { title: 'Hamburg', value: 'HH' },
          { title: 'Hessen', value: 'HE' },
          { title: 'Mecklenburg Vorpommern', value: 'MV' },
          { title: 'Niedersachsen', value: 'NI' },
          { title: 'Nordrein-Westfalen', value: 'NW' },
          { title: 'Reinland Pfalz', value: 'RP' },
          { title: 'Saarland', value: 'SL' },
          { title: 'Sachsen', value: 'SN' },
          { title: 'Sachsen Anhalt', value: 'ST' },
          { title: 'Schleswig Holstein', value: 'SH' },
          { title: 'Thüringen', value: 'TH' },
          { title: 'Österreich', value: 'iA' }
        ],
      };
    },
    methods: {
      itemSelected() {
        // Emit an event to notify the parent component with the selected item's id
        this.$emit('item-selected', this.selectedItem);
      },
    },
  };
  </script>
  <style scoped>
</style>