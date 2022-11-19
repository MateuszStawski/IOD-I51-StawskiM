<template>
  <div class="main-container">
    <form @submit.prevent="karta">   
      <router-link to="/card-add">
        <button type="submit" class="btn btn-dark btn-lg btn-block">Dodaj firmę</button>
      </router-link>
      <div class="divider" />
      <router-link to="/view-list">
        <button type="submit" class="btn btn-dark btn-lg btn-block">Lista firm</button>
      </router-link>
    </form>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  methods: {
    
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

.btn {
  width: 30%!important;
  text-align: center;

  margin: auto;
}

.main-container {
  text-align: center;
}

.divider{
    width:5px;
    height:auto;
    display:inline-block;
}
</style>