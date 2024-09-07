<template>
  <div class="container">
    <div class="top"></div>
    <h3>観光日本語でGO!</h3>
    <div class="gap"></div>
    <router-link to="/login" class="waves-effect waves-light ikuzo">Press Start</router-link>
  </div>
</template>

<script>
  export default {
    name: 'Home',
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Dela+Gothic+One&family=DotGothic16&display=swap');

  body {
      font-family: "Darumadrop One", "DotGothic16";
      font-weight: 400;
      font-style: normal;
  }

  .top {
      width: 100%;
      max-width: 400px;
      padding: 8rem;
  }

  .gap {
      width: 100%;
      max-width: 400px;
      padding: 0.2rem;
  }

  .container {
    width: 100%;
    max-width: 100%;
    background: #fff;
    padding: 2rem;
    text-align: center;
    background-image: url('https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
    height: 100vh;
  }

  h3 {
    text-align: center;
    color: #fff;
  }

  @keyframes slowBlink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
  }

  .ikuzo{
    font-size: 30px;
    animation: slowBlink 3s infinite;
    text-shadow: 2px 2px 5px rgba(254, 254, 254, 0.815);
  }
</style>