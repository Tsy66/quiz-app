<template>
    <div class="container grey-text center">
      <div class="top"></div>
      <h3>あ、やばい、、</h3>
      <p>Currently you cannot view this page offline</p>
      <router-link to="/" class="btn waves-effect waves-light">Go to Homepage</router-link>
    </div>
</template>
  
<script>
  export default {
    name: 'Fallback',
  }
</script>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Dela+Gothic+One&family=DotGothic16&display=swap');
  
  body, button, input {
      font-family: "Darumadrop One", "DotGothic16";
      font-weight: 400;
      font-style: normal;
  }
  
  .top{
      width: 100%;
      max-width: 400px;
      padding: 7rem;
  }
  
  .container {
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 2rem;
  }
  
  h3 {
    text-align: center;
  }
  
  .btn {
    border-radius: 8px;
  }
</style>