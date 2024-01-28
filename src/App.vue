<template>
  <v-layout class="content" >
    <!------------Navbar------------>
    <v-app-bar>
      <img src="./assets/logo.png" class="logo">
      <SearchBar @searchData="handleSearch" :stopLoading="finishedLoading"></SearchBar>
    </v-app-bar>
    <!------------Sidebar------------>
    <div class="bodycomponents">
      <v-container class="sidebar">
        <Multiselect @item-selected="handleItemSelect"></Multiselect>
        <v-card>
          <!--Filter Checkboxen zur Sortierung-->
          <DynamicFilterCheckbox v-for="checkbox in checkboxes" :key="checkbox.id" :checkboxId="checkbox.id"
            :checkboxLabel="checkbox.label" :dataLocation="checkbox.location" :dataValue="checkbox.value"
            @checkboxChanged="handleCheckboxChanged"/>
        </v-card>
    </v-container>
      <!------------Main (Ergebnisse)------------>
      <v-main class="studicards">
        <div v-if="filteredResponseData=='error'">
          <p>error fetching data, no results found</p>
        </div>
        <div v-else-if="filteredResponseData=='not found'">
          <p>No results found, sorry</p>
        </div>
        <div v-else-if="filteredResponseData=='loading'">
          <v-icon icon="fa:fas fa-circle-notch fa-spin"></v-icon>
          <p>loading...</p>
        </div>
        <div v-else-if="filteredResponseData">
          <h2 class="results">Such Ergebnisse:</h2>
          <p class="resultsnumber">{{this.filteredResponseData.length}} Ergebnisse gefunden</p>
          <!--stud Informationen werden an die studInfoCard Komponente übergeben-->
          <!--CHAT GPT: "v-for"-Schleife-->
          <StudInfoCard v-for="(stud, index) in filteredResponseData" :key="index" :studInfo="{
            name: stud.name,
            nameUni: stud.nameUni,
            studInhalt: stud.studInhalt,
            logoURL: stud.logoURL,
            abschlussGrad: stud.abschlussGrad,
            dual: stud.dual,
          }">
          </StudInfoCard>
        </div>
        <!--Wird ausgegeben, wenn noch nichts geladen wurde-->
        <div v-else class="welcometext">
          <h1 class="welcome">Willkommen!</h1>
          <p class="description"><span class="descr_bold">StudiScout®</span> hilft dir dabei, das <span class="descr_bold">Traum-Studium</span> in deiner Nähe zu finden!<br>
          Suche einfach nach einem <span class="descr_bold">Studiengang</span> ,der dich interressiert und passe die <span class="descr_bold">Parameter</span> für dich an!</p>
        </div>
      </v-main>
    </div>
  </v-layout>
</template>


<!------------------------Script---------------------------->
<script>
//imports
import axios from 'axios';
import StudInfoCard from './components/StudInfoCard.vue';
import DynamicFilterCheckbox from './components/DynamicFilterCheckbox.vue';
import SearchBar from './components/SearchBar.vue';
import Multiselect from './components/Multiselect.vue'

import placeholderImage from './assets/notFound.png';

//exported to main
export default {
  //data
  data() {
    return {
      inputValue: '',
      responseData: { items: [] },
      filters: [],
      filteredResponseData: null,
      finishedLoading: true,

      upperCallLimit: 51,

      clientId: '5aee2cfe-1709-48a9-951d-eb48f8f73a74', //client id for the API

      index: 1,

      placeholderImage: placeholderImage,

      checkboxes: [
        { id: 1, label: 'Duales Studium', location: "item.studienangebot.studienmodelle.some(model => model.id === 5)", value: true },
        { id: 2, label: 'Bachelor', location: "item.studienangebot.abschlussgrad.id", value: 2 },
        { id: 3, label: 'Master', location: "item.studienangebot.abschlussgrad.id", value: 10 },
        { id: 4, label: 'Fernstudium', location: "item.studienangebot.studienform.id", value: 4 },
        { id: 5, label: 'Vollzeitstudium', location: "item.studienangebot.studienform.id", value: 1 },

      ],
    };
  },
  methods: {
    //fetches data, when the search button is pressed
    fetchData(inputValueName) {
      this.filteredResponseData = 'loading';
      // Axios GET request, url searches by input field
      let apiUrl = `https://rest.arbeitsagentur.de/infosysbub/studisu/pc/v1/studienangebote?sw=${inputValueName}&pg=${this.index}`;
      const proxyUrl = '/.netlify/functions/proxy?url=' + apiUrl;
      console.log(proxyUrl);
      axios
        .get(proxyUrl, {
          headers: {
            'X-API-Key': this.clientId //API Key 
          }
        })
        .then((response) => {
          // Handle successful response
          this.responseData.items = this.responseData.items.concat(response.data.items);

          if (response.data.items.length > 0 && this.index < this.upperCallLimit) {
            this.index++;
            this.fetchData(inputValueName);
            this.filterAndDisplayData();
          }
          else if(this.responseData.items.length == 0){
            this.finishedLoading = true;
            this.filteredResponseData = 'not found';
          }
          else{
            this.finishedLoading = true;
          }
          
        })
        .catch((error) => {
          this.filteredResponseData = 'error';
          this.finishedLoading = true;
          console.error(this.filteredResponseData);
          console.error("Error fetching data:", error);
        });
    },
    handleSearch(inputValueName) {
      if (inputValueName.length != 0 && this.finishedLoading) {
        console.log("2")
        this.finishedLoading = false;
        this.index = 1;
        this.responseData = { items: [] };
        this.fetchData(inputValueName);
      }
    },
    handleItemSelect(selectedIds) {
      console.log(selectedIds);
      let id = 0;
      let found = this.filters.some(filter => filter.id === id);
      //CHAT GPT: "if (found)"//
      if (found) {
        console.log("success");
        this.filters = this.filters.filter(filter => filter.id !== id);
      }
      if(selectedIds.length > 0){
        this.filters.push({ id: id, location: "filter.selectedIds.some(selectedId => selectedId.includes(item.studienangebot.region.Key))", value: true, selectedIds: selectedIds});
      }
      this.filterAndDisplayData();
    },
    handleCheckboxChanged(checkboxData) {
      let found = this.filters.some(filter => filter.id === checkboxData.id);
      if (found) {
        console.log("success");
        this.filters = this.filters.filter(filter => filter.id !== checkboxData.id);
      }
      else {
        this.filters.push({ id: checkboxData.id, location: checkboxData.location, value: checkboxData.value });
      }
      this.filterAndDisplayData();
    },
    filterAndDisplayData() {
      this.filteredResponseData=='loading'

      if (this.responseData.items.length > 0) {
        let filteredData = this.responseData;

        filteredData = filteredData.items.map(item => item);

        if (this.filters.length > 0) {
          this.filters.forEach(filter => {
            filteredData = filteredData.filter(item => eval(filter.location) === filter.value)
          });
        }

        filteredData = filteredData.map(item => ({
          name: item.studienangebot.studiBezeichnung,
          nameUni: item.studienangebot.studienanbieter.name,
          studInhalt: item.studienangebot.studiInhalt,
          abschlussGrad: item.studienangebot.abschlussgrad.label,
          dual: item.studienangebot.studienmodelle.some(model => model.id === 5 ),
          //ChatGPT: Use optional chaining and nullish coalescing in case no logo is there
          logoURL: item.studienangebot.studienanbieter.logo?.externalURL ?? this.placeholderImage
        }));
        this.filteredResponseData = filteredData;
      }
    }
  },
  //components
  components: { StudInfoCard, DynamicFilterCheckbox, SearchBar, Multiselect }
};
</script>


<!------------------------CSS---------------------------->
<style scoped>
*{
  font-family: "neue-haas-grotesk-display", sans-serif;
  font-weight: 700;
  font-style: normal;
  color: #3b417c;
}
.content{
  display: flex;
  justify-content: center;
}
header {
  height: 10rem;
  justify-content: center;
}
.logo {
  margin-left: 1rem;
  margin-right: 1.5rem;
  width: 20rem;
}
.bodycomponents{
  width: 80%;
  display: flex;
  margin-top: 5rem;
  margin-left: 0;
}
.sidebar {
  position: flex;
  margin-top: 50px;
  margin-right: 10px;
  width: 30%;
}
.studicards{
  min-height: 300px;
  width: 70%;
}
.results {
  padding-left: 15px;
}
.resultsnumber{
  margin: 1rem;
}
.welcometext{
  display: flex;
  justify-content: top;
  align-items: flex-start;
  height: 100%;
  flex-direction: column;
  margin-left: 1.5rem;
  margin-top: 3rem;

}
.welcome{
  font-size: 80px;
  font-weight: 600;
  color: #23274b;
}
.description{
  font-size: 24px;
  color: #525782;
  font-weight: 300;
}
.descr_bold{
  font-weight: 700;
  color: #23274b;
}
</style>
