<template>
  <div class="vue-template" @mouseover="updateLoginButton">
    <!-- Navigation -->
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container">
        <ul class="nav navbar-nav flex-row float-left">
          <li class="nav-item">
            <router-link v-if="showLogoutButton" class="nav-link pr-3" to="/main">Strona główna</router-link>
          </li>
        </ul>
        <ul class="nav navbar-nav flex-row float-right">
          <li class="nav-item">
            <router-link v-if="showLogoutButton" class="nav-link pr-3" to="/log-in" @click="clearSessionStorage">Wyloguj</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

 export default {

  data() {
    return {
      showLogoutButton: true
      }
  },
    methods: {
      updateLoginButton() {
            const checkURL = String(window.location.href)

            if (checkURL.includes("log-in")) {
              this.showLogoutButton = false
            }
            else {
              this.showLogoutButton = true
            }
          },
      clearSessionStorage () {
             localStorage.removeItem('token');
          }
      },
    mounted:function() {
      const checkURL = String(window.location.href)
      if (checkURL.includes("log-in")) {
        this.showLogoutButton = false
        }
      },
 }
  


</script>


<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #62478a;
}
a, li {
  list-style-type: none;
}
.vertical-center {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}


.inner-block {
  display: inline-block;
}


</style>