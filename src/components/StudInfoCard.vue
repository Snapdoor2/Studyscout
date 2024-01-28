<template>
    <v-container class="cardcontainer">
        <v-card class="studicard">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div class="cardcontent">
                <v-card-title  class="text-h5, title"> {{ studInfo.name }}</v-card-title>
                <v-card-subtitle class="subtitle">{{ studInfo.nameUni }}</v-card-subtitle>
                <div v-if="studInfo.abschlussGrad=='Bachelor/Bakkalaureus'" class="degree">
                    <img src="/src/assets/bachelor.png" class="degreeicon"> 
                    <h4 class="degreetest">Bachelor </h4>   
                </div>
                <div v-else-if="studInfo.abschlussGrad=='Master'" class="degree">
                    <img src="/src/assets/master.png" class="degreeicon"> 
                    <h4 class="degreetest">{{ studInfo.abschlussGrad }} </h4>   
                </div>
                <div v-else-if="studInfo.abschlussGrad=='Staatsexamen'" class="degree">
                    <img src="/src/assets/staatsexamen.png" class="degreeicon"> 
                    <h4 class="degreetest">{{ studInfo.abschlussGrad }} </h4>   
                </div>
                <div v-if="studInfo.dual" class="degree">
                    <img src="/src/assets/dual.png" class="dualicon"> 
                    <h4 class="degreetest">Duales Studium </h4>   
                </div>
                <!--CHAT GPT: "v-html" -->
                <p v-html="studInfo.studInhalt" class="cardtext"></p>
              </div>
              <v-avatar class="ma-3" size="125" rounded="0">
                <v-img :src="studInfo.logoURL" alt="logo des Studiengangs" :width="125"  class="cardimage"></v-img>
              </v-avatar>
            </div>
        </v-card>
    </v-container>
</template>

 
<!----------Script----------->
<script>
    export default {
        name: 'studInfoCard',
        props: {
            studInfo: Object
        },
        data() {
            return {
                arbeitszeitmodell: "n.a"
            };
        },
}
</script>
<!----------CSS---------->  
<style scoped>

.cardcontainer{
    display: flex;
}
.studicard{
    padding: 1rem 1rem 1rem 1rem;
    width: 100%;
    float: right;
    color: #3a3e64;
}
.cardcontent{
    max-width: 70%;
}
.title{
    padding: 0;
    font-weight: 700;
    font-size:x-large;
}
.subtitle{
    padding-left: 0;
}
.degree{
    display:inline-flex;
}
.degreeicon{
    margin-right: 10px;
    margin-top: 6px;
    width: 20px;
    height: 20px;
}
.degreetest{
    margin-top: 5px;
}
.dualicon{
    margin-right: 8px;
    margin-top: 6px;
    width: 20px;
    height: 20px;
    margin-left: 50px;
}
.cardimage{
    max-width: 150px;
}
.cardtext{
    padding-top: 2rem;
}
h4{
    font-weight: 600;
}
</style>