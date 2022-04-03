<template>
  <div>
    <div class="navbar">
      <div class="left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </div>
      <div class="right">
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/register" class="nav-link">Register</router-link>
      </div>
    </div>
    <router-view class="content" />
  </div>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  background-color: #456ddb;
}
.left,
.right {
  display: flex;
  align-items: center;
}
.left {
  margin-left: 20px;
}
.right {
  margin-right: 20px;
}
.nav-link {
  color: #333;
  margin: 0 10px;
  text-decoration: none;
}
body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.content {
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form > input {
  margin-bottom: 20px;
}
</style>
