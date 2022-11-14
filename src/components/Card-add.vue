<template>
  <div class="containerDisplay">
    <h3> Dodaj link do strony </h3>
    <div class="infoTab">
      <div v-if=displayInfoTab class="displayInfo">
        <label>
            Podany URL musi zawierać: <br>
            - http lub https <br>
            - domena (.pl lub .com, itp.) <br>
            <br>
            Przykład: <br>
            https://pravna.pl/ <br>
        </label>
      </div>
      <div v-if=improperUrl class="display-error">
        <label>
          Strona nieprawidłowa
        </label>
      </div>
      <div v-if=duplicatePage class="display-error">
        <label>
          Strona jest już dodana
        </label>
      </div>
      <div v-if=displayServerError class="display-error">
        <label>
          Problem z sewerem
        </label>
      </div>
    </div>
    <form @submit.prevent="login">
      <div class="form-group">
        <input type="text" class="form-control-lg" v-model="urlAddress" placeholder="URL" required />   
      </div> 
      <div class="button-panel">
        <button type="submit" v-if="!addingStatus" class="btn btn-dark btn-lg">Dodaj</button>
        <button type="submit" v-if="addingStatus" class="btn btn-dark btn-lg">Dodawanie...</button>
      </div>
    </form>
    <div class="importPanel">
      <h4>
        Import z pliku
      </h4>
      <input 
        type="file"
        id="avatar" 
        ref="importedFile"
        name="avatar"
        accept=".txt, .csv"
        @change="sendFile"
        />
      <div class="importPage" v-if="displayImportPage">
        <label>
          Status:
        </label>
        <br>
        <div class="acceptedItems">
          Liczba stron zaakceptowanych <br>
          {{ importAcceptedItemsNumbers }} <br>
        </div>
        <div class="canceledItems">
          Liczba stron odrzuconych <br>
          {{ importCanceledItemsNumbers }} <br>
          Strony odrzucone <br>
          <div class="iterateElements" v-for="items in importCanceledItems" :key="items">
            {{ items }} <br>
          </div>
        </div>
          <router-link to="/view-list" class="redirectToViewList">
              <button class="btn btn-dark btn-lg float-right">Wyświetl listę</button>
          </router-link>
          <div class="resetButton" @click="reloadPage">
            By dodać nowy plik/URL, kliknij mnie w celu odświeżenia strony
          </div>
      </div>
  </div>
</div>

  </template>


<script>
  
  export default {
  data () {
    return {
      urlAddress: "",
      addingStatus: false,
      displayInfoTab: true,
      improperUrl: false,
      duplicatePage: false,
      displayServerError: false,
      httpsMissing: false,
      fileContent: "",
      displayImportPage: false,
      isVisible: false,
      importCanceledItemsNumbers: "",
      importCanceledItems: [],
      importAcceptedItemsNumbers: ""
    }
  },
  methods: {
    reloadPage() {
      location.reload()
    },
    async receiveImportData() {
      var continueChecking = true

      while (continueChecking) {
        try {
            var urlId = localStorage.getItem('importId')
            var response = await fetch("http://54.37.234.76:8081/import/status/"+ urlId , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*",
              "Access-Control-Allow-Headers": "*"
            }
            }).then(response => response.json()) 

              setTimeout(() => {
              console.log("Delayed for 1 second.");
              }, 5000)
          
            if (response.id ==  urlId) {
              console.log(response.id)
              this.importAcceptedItemsNumbers = response.iloscZaakceptowanych
              this.importCanceledItemsNumbers = response.iloscOdrzuconych
              this.importCanceledItems = response.odrzucone
              this.addingStatus = false
              continueChecking = false
            }
          }
          catch (error) {
            this.errorMessage = error;
            console.error('There was an error!', error)
            this.addingStatus = false
          }
        }
        
    },

    async sendFile(event) {
        const file = event.target.files[0]
        this.displayImportPage = true
        this.addingStatus = true

        let reader = new FileReader();

        reader.onload = async function(e) {
            let resultTab = []
            resultTab = e.currentTarget.result
              try {
                var response = await fetch("http://54.37.234.76:8081/company/add-multiple", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "*",
                  "Access-Control-Allow-Headers": "*"
              },
                body: JSON.stringify({
                  token: localStorage.getItem('token', this.token),
                  list: resultTab
                }),
               }).then(response => response.json())
              }
              catch (error) {
                  this.errorMessage = error;
                  console.error('There was an error!', error)
                  this.addingStatus = false
              }
              localStorage.setItem("importId", response.importId)
        }
        reader.readAsText(file)

        this.receiveImportData()
      },

      async login(e) {
        
        this.addingStatus = true
        this.improperUrl = false
        this.duplicatePage = false
        this.displayServerError = false
        this.httpMissing = false

        if (!this.urlAddress.includes('http') || !this.urlAddress.includes('.')) {
          this.improperUrl = true
          this.addingStatus = false
          return
        }

        e.preventDefault();

        this.urlAddress = this.urlAddress.replace(/\s/g,'')


        try {
          var response = await fetch("http://54.37.234.76:8081/company/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
          },
          body: JSON.stringify({
            token: localStorage.getItem('token', this.token),
            url: this.urlAddress
          }),
          }).then(response => response.json())
        }
        catch (error) {
          this.errorMessage = error;
          console.error('There was an error!', error)
          const stringError = String(error)
          this.addingStatus = false

          if (stringError.includes("COMPANY NOT FOUND")) {
            this.improperUrl = true
            this.displayInfoTab = false
            this.duplicatePage = false
            this.displayServerError = false
          }
          if (stringError.includes("COMPANY EXISTS")) {
            this.duplicatePage = true
            this.displayInfoTab = false
            this.improperUrl = false
            this.displayServerError = false
          }
          if (stringError.includes("Failed to fetch")) {
            console.log("x")
            this.displayServerError = true
            this.displayInfoTab = false
            this.imprtoperUrl = false
            this.displayServerError = true
          }
        }
        {
        if (response) {
          console.log('OK')
          this.$router.push('/View-list')
          }
        }
      }
      },
      beforeMount() {
      localStorage.setItem('filter',"WSZYSTKIE")
      if(localStorage.getItem('token') == null){
        this.$router.push('/log-in')
        }
      }
}

  
  
</script>

<style>

#pre {
  padding-top: 0%;
  padding-bottom: 0%;
}

.infoTab {
  padding-bottom: 5%;
}

.containerDisplay {
    text-align: center;
    align-items: center;
    justify-content: center;
    display: inline-block;
    float: none;
  }
  .infoTab {
    text-align: center;
  }

  .form-control-lg {
    display: block;
    width: 50%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    display: inline-block;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
  .btn-dark {
    width: 50% !important;
    justify-content: center;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #62478a;
  }

  .display-error {
    color: #ff0000!important;
    margin: auto;
    border-radius: 5%;
    display: inline-block;
    text-align: center;
    padding-top: 1%;
  }

  .setPagination {
        width: 25%;
        float: right;
        padding: 2%;
    }
  .acceptedItems {
    color: #00D100;
    padding-top: 1%;
  }
  .canceledItems {
    color: red;
    padding-bottom: 2%;
  }
  .importPanel {
    padding-top: 3%;
  }
  .redirectToViewList {
    padding-top:1%;
  }
  .resetButton {
    padding-top:5%;
  }
  .resetButton:hover{
    cursor: pointer;
  }
</style>


