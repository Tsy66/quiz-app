<template>
    <div class="sidebar">
      <ul>
        <h5>ようこそ 教師端 !</h5>
        <br>
        <li><a href="/class">🏫班級管理🧑‍🏫</a></li>
        <hr>
        <li><a href="/dashboard">💯學生表現📊</a></li>
        <hr>
        <li><a href="/levels">🚧學習分析🚧</a></li>
        <hr>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 15rem;
    background-color: #2c3e50;
    color: #fff;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin: 1rem 0;
  }
  
  .sidebar ul li a {
    color: #fff;
    text-decoration: none;
    display: block;
    padding: 0.5rem;
    transition: background-color 0.3s;
  }
  
  .sidebar ul li a:hover {
    background-color: #34495e;
    border-radius: 0.5rem;
  }
  </style>
  