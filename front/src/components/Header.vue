<template>
    <div class="frame" id="titleBar">
      <p id="title">
          <span style="cursor:pointer" @click="this.goMsg">Siserie Talk</span>
    </p>
    </div>
</template>

<script>
  export default {
    methods:{
        goMsg(){
            if(this.$store.state.loginStatus == "YES"){
                this.$router.push("/message");
            }
        }
    }
  }
  
</script>

<style>
    
    #titleBar{
        display: table;
        margin: auto;
        width: 100vw;
        height: 70px;
        position: fixed;
        top: 0px;
    }
    #title{
        display: table-cell;
        vertical-align: middle;
        font-weight: bold;
        font-size: 30px;
    }
    
    @media(max-width:500px){
        #titleBar{
            height: 8vh;
        }
        
        #title{
            font-size: 6vw;
        }
    }
</style>