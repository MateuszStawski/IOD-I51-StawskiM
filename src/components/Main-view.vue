<template>
  <div class="main-container">
    <form @submit.prevent="karta">   
      <router-link to="/card-add">
        <button type="submit" class="control-btn">Dodaj firmę</button>
      </router-link>
      <div class="divider" />
      <router-link to="/view-list">
        <button type="submit" class="control-btn">Lista firm</button>
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

.control-btn{
    padding: 0.5rem 1rem;
    width: 15%;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: 0.3rem;
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
    border: 1px solid transparent;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    width: 30%;
  }
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