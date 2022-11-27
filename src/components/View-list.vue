<template>
    <div class = "container-display"> 
        <router-link to="/card-add">
            <button class="add-button float-right">Dodaj nowy</button>
        </router-link>
        <h1 class = "text-center" >Lista firm</h1>
        <div class="filtersTab" >
            <multiselect 
                v-model="selectedFilter" 
                :options="options"
                placeholder="Wybierz filtr"
                :select-label="selectName"
                :selected-label="selectedName"
                :deselect-label="deselectName"
                :allow-empty="false"
                :searchable="false"
            >
            </multiselect>
        </div>
        <div class="setPagination">
            <input class="form-control-lg"
                type="number"
                min="1"
                max="100"
                v-model="pageNumber"
                placeholder="Wybierz stronę"
                v-on:change="setPage"
                v-on:keydown="setPage"
            />
        </div>
        <div v-if="!displayServerError" class="display-error"></div>
        <div v-if="displayServerError" class="display-error">  Problem z serwerem </div>
        <div v-if="!displayEmptyListError" class="display-error"></div>
        <div v-if="displayEmptyListError" class="display-error">  Brak firm z danym statusem </div>
        <div v-if="!displayNumberOfElementsError" class="display-error"></div>
        <div v-if="displayNumberOfElementsError" class="display-error">  Nie można zmienić strony, strona byłaby pusta </div>
        <div v-if="!displayWrongPageNumberError" class="display-error"></div>
        <div v-if="displayWrongPageNumberError" class="display-error">  Wpisano niepoprawny numer strony </div>
        <div v-if='displayTotalNumberOfElements' class="display-total-elements"> Liczba elementów dla {{ selectedFilter }}: {{totalNumberOfElements}}</div>
        <table class="table table=striped" id="scrollHere"> 
            <thead>
                <th>ID</th>
                <th>URL</th>
                <th>Logo</th>
                <th>Nr tel.</th>
                <th>Email</th>
                <th>Status</th>
                <th>Akcje</th>
            </thead>
            <tbody >
                <tr v-for="client in clients" v-bind:key="client.id">
                    <td>{{client.id}}</td>
                    <td>{{client.url}}</td>
                    <td>
                        <img class="logoImg" v-bind:src=client.logoPath />
                        <img class="redirectToLogo" v-if="displayInfoIcon" @click="redirectToLogoPage(client.logoPath)" width="17" height="17" src='../img/info_icon.svg' />
                    </td>
                    <td>{{client.phoneNumber}}</td>
                    <td v-if="client.emails.length!==0 && client.status === 'NIE_MA_R'">
                        <multiselect 
                            v-model="emailName" 
                            :options="client.emails"
                            placeholder="Wybierz email"
                            :select-label="selectName"
                            :selected-label="selectedName"
                            :deselect-label="deselectName"
                            :allow-empty="false"
                            :searchable="false"
                        >
                        </multiselect>
                        <div class="accept-email" @click="setEmail(emailName, client.id)">Potwierdź</div>
                    </td>
                    <td v-if="client.emails.length === 0 && client.status === 'NIE_MA_R'">
                        NOT FOUND
                    </td>
                    <td v-if="client.status !== 'NIE_MA_R'">
                    </td>

                    <td>{{client.status}}</td>
                    <div v-if="client.status === 'OCZEKUJE'">
                        <th>
                            <button class="changeStatusBtn acceptButton" @click="setAction(0, client.id)">Ma ®</button>
                        </th>
                        <th>
                            <button class="changeStatusBtn declineButton" @click="setAction(1, client.id)">Nie ma ®</button>
                        </th>
                        <th>
                            <button class="changeStatusBtn bugButton" @click="setAction(2, client.id)">Błędna grafika</button>
                        </th>
                    </div>
                    <div v-if="client.status !== 'OCZEKUJE'">
                        <th>
                            <button class="changeStatusBtn noActionRed">Ma ®</button>
                        </th>
                        <th>
                            <button class="changeStatusBtn noActionGreen">Nie ma ®</button>
                        </th>
                        <th>
                            <button class="changeStatusBtn noActionOrange">Błędna grafika</button>
                        </th>
                    </div>
                </tr>
            </tbody>
        </table>
    </div>
  </template>

  <script>
  import ClientService from '../services/ClientService'
  import Multiselect from 'vue-multiselect'
  
    export default {
        /* eslint-disable */
        components: {
            Multiselect
        },
        name: 'clients',
        data(){
            return{
                 clients : [],
                 selectedFilter: "WSZYSTKIE",
                 displayServerError: false,
                 selectName: "Wybierz",
                 deselectName: "Wybrane",
                 selectedName: "Wybrane",
                 displayInfoIcon: true,
                 displayEmptyListError: false,
                 displayNumberOfElementsError: false,
                 displayTotalNumberOfElements: true,
                 displayWrongPageNumberError: false,
                 totalNumberOfElements: 0,
                 pageNumber: 1,
                 pravnaUrl: this.pravnaUrl,
                 options: ["WSZYSTKIE", "OCZEKUJE", "MA_R", "NIE_MA_R", "BLEDNA_GRAFIKA", "WYSŁANO_MAILA"],
                 selectedEmail: "",
                 emailName: ""
           }
        },
        watch: {
            selectedFilter() {
                localStorage.setItem('filter', this.selectedFilter)
                localStorage.setItem('pageNumber',1)
                this.pageNumber = 1;
                this.getClients()
            }
        },
        methods: {
            async setEmail(email_name, email_id) {

                try {
                    var response = await fetch(this.pravnaUrl + "company/status", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Headers": "*"
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                        email: email_name,
                        id: email_id
                    }),
                    }).then(response => response.json())
                        if (response.data !== null || response.data !== undefined) {
                            if (response.data.numberOfElements !== null) {
                                if (response.data.numberOfElements === 0) {
                                    if (this.selectedFilter !== "WSZYSTKIE") {
                                        this.displayEmptyListError = true
                                    }
                                    this.displayServerError = false
                                    this.displayNumberOfElementsError = false
                                }
                            }
                            if (response.data.numberOfElements === 0 || response.data.numberOfElements === null) {      
                                if (this.pageNumber !== 1) {
                                    this.displayNumberOfElementsError = true
                                }
                                this.displayEmptyListError = false
                            }
                        }
                    }
                    catch (error) {
                        console.error('There was an error!', error)
                        const stringError = String(error)

                        if (stringError.includes("Failed to fetch")) {
                            this.displayServerError = true
                        }
                    }
                    this.getClients()
                
            },
            scrollDown() {
                let element = document.getElementById("scrollHere");
                element.scrollIntoView({behavior: "smooth", block: "start"});
            },
            async setPage() {
                this.displayNumberOfElementsError = false
                this.displayServerError = false

                if (this.pageNumber < 1 || this.pageNumber === null || this.pageNumber === undefined || this.pageNumber === "" || isNaN(this.pageNumber)) {
                    this.displayWrongPageNumberError = true
                    return
                }

                localStorage.setItem('pageNumber', this.pageNumber)
                
                try {
                    var response = await fetch(this.pravnaUrl + "company/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Headers": "*"
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                        status: this.selectedFilter,
                        pageNumber: this.pageNumber
                    }),
                    }).then(response => response.json())
                        if (response.content.length === 0) {
                            if (this.pageNumber !== 1) {
                                this.displayNumberOfElementsError = true
                            }
                        }
                    }
                    catch (error) {
                        console.error('There was an error!', error)
                        const stringError = String(error)
                        this.displayServerError = true
                    }

                    this.getClients()
            },
            redirectToLogoPage(page) {
                window.open(page)
            },
            getClients() {
                this.displayServerError = false
                this.displayNumberOfElementsError = false
                this.displayEmptyListError = false

                
                    ClientService.getClients().then((response) =>{
                        try {
                            this.totalNumberOfElements = response.data.totalElements
                            this.clients = response.data.content


                            if (response.data.numberOfElements === null){
                                if (this.pageNumber !== 1) {
                                    this.displayNumberOfElementsError = true
                                }
                            }
                            if (response.data.numberOfElements === 0) {
                                if (this.pageNumber === 1) {
                                    this.displayEmptyListError = true
                                }
                                if (this.pageNumber !== 1) {
                                    this.displayNumberOfElementsError = true
                                 }
                            }   
                        }
                        catch {
                            this.displayServerError = true
                        }
                    })
            },
            setAction(type, id) {
                if (type === 0) {
                    //accept
                    this.sendStatusInfo("MA_R", id)
                }
                else if (type === 1) {
                    //not accept
                    this.sendStatusInfo("NIE_MA_R", id)
                }
                else if (type === 2) {
                    // bug
                    this.sendStatusInfo("BLEDNA_GRAFIKA", id)
                }
            },
            async sendStatusInfo(status, id) {
                this.displayServerError = false
                this.displayNumberOfElementsError = false
                this.displayEmptyListError = false

                try {
                    var response = await fetch(this.pravnaUrl + "company/status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Headers": "*"
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                        status: status,
                        id: id
                    }),
                    }).then(response => response.json())
                        if (response.data !== null || response.data !== undefined) {
                            if (response.data.numberOfElements !== null ) {
                                if (response.data.numberOfElements === 0) {
                                    if (this.pageNumber === 1) {
                                        this.displayEmptyListError = true
                                    }
                                    else {
                                        this.displayNumberOfElementsError = true
                                    }
                                }
                            }
                        }
                            else {

                            }
                    }
                    catch (error) {
                    //this.errorMessage = error;
                    console.error('There was an error!', error)
                    const stringError = String(error)
                    //this.addingStatus = false

                    if (stringError.includes("Failed to fetch")) {
                        this.displayServerError = true
                        }
                    }
                    this.getClients()
            }
        },
        created(){
            localStorage.setItem('pageNumber', this.pageNumber)
            this.selectedFilter = "WSZYSTKIE"
            this.getClients()
        },
        beforeMount() {
            localStorage.setItem('filter',"WSZYSTKIE")
            if(localStorage.getItem('token') == null){
                this.$router.push('/log-in')
            }
    }
}
  
  
  </script>

<style src="../assets/css/vue-multiselect.min.css"></style>

  <style>

.accept-email {
    font-size: 15px;
    float: right;
    color: black;
    justify-content: center;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    display: block;
    width: 100%;
}
  .accept-email:hover {
    text-decoration: underline;
    cursor: pointer;
  }
    .changeStatusBtn {
        display: inline-block;
        font-weight: 400;
        width: 100%;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    div {
        margin-left : 20px;
    }
    input {
        display: inline-block;
    }
    .scrollable:hover {
        cursor: pointer;
    }
    .add-button{
        width: 20%;
        padding: 0.5rem 1rem;
        font-size: 1.25rem;
        line-height: 1.5;
        border-radius: 0.3rem;
        color: #fff;
        background-color: #343a40;
        border-color: #343a40;
        border: 1px solid transparent;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    button {
        text-align: center;
        display: inline-block;
        padding-right: 1%;
    }
    .acceptButton {
        background-color: red;
        color: white;
        width: 100px;
    }
    .declineButton {
        background-color: green;
        color: white;
        width: 100px;
    }
    .bugButton {
        background-color: orange;
        color: white;
        width: 140px;
    }
    .noActionRed {
        background-color: #bf9494;
        width: 100px;
        color: white
    }
    .noActionOrange {
        background-color: #D8B083;
        width: 140px;
        color: white
    }
    .noActionGreen {
        background-color: #75816b;
        width: 100px;
        color: white
    }
    h1 {
        padding-bottom: 2%;
    }
    .display-error {
        color: #ff0000!important;
        margin: auto;
        border-radius: 2%;
        display: inline-block;
        text-align: center;
        padding-bottom: 2%;
        list-style-type: none;
    }
    .logoImg {
        width: 200px; 
        height: 120px;
        padding: 10%;
        margin: auto;
    }
    .redirectToLogo {
        display: inline-block;
        margin: auto;
    }
    .redirectToLogo:hover {
        cursor: pointer;
    }
    .setPagination {
        width: 25%;
        float: right;
        padding: 2%;
    }
    .display-total-elements {
        padding-bottom: 2%;
        color: green;
    }

  </style> 